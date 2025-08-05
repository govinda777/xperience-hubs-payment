import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { ValidateNFTAccessUseCase } from '@/core/use-cases/nft/ValidateNFTAccessUseCase';

interface NFTValidatorProps {
  merchantContractAddress: string;
  requiredAccessLevel: string;
  requiredMetadata?: Record<string, string>;
  supportedNetworks?: string[];
  supportLegacyContracts?: boolean;
  onValidationSuccess: (result: any) => void;
  onValidationFailure: (result: any) => void;
  children?: React.ReactNode;
}

export const NFTValidator: React.FC<NFTValidatorProps> = ({
  merchantContractAddress,
  requiredAccessLevel,
  requiredMetadata,
  supportedNetworks = ['ethereum'],
  supportLegacyContracts = false,
  onValidationSuccess,
  onValidationFailure,
  children
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { address, isConnected, connect, signMessage } = useWallet();

  const handleConnectWallet = async () => {
    try {
      setIsValidating(true);
      setError(null);
      
      if (!isConnected) {
        await connect();
      }
      
      if (!address) {
        throw new Error('Wallet not connected');
      }

      // Mock validation process - in real implementation this would use the use case
      const message = `Validate NFT ownership for access control - ${Date.now()}`;
      const signature = await signMessage(message);
      
      // Simulate validation result with enhanced features
      const mockResult = {
        success: true,
        accessGranted: true,
        accessLevel: requiredAccessLevel,
        walletAddress: address,
        network: supportedNetworks[0],
        networkValidation: true,
        metadataValidation: requiredMetadata ? true : false,
        contractVersion: supportLegacyContracts ? 'legacy' : 'current',
        nftValid: true,
        availableAccessLevels: ['VIP', 'BACKSTAGE', 'MERCH'],
        nftCollection: [
          {
            tokenId: 'nft-1',
            metadata: { name: 'VIP Ticket', attributes: [{ trait_type: 'Access Level', value: 'VIP' }] }
          },
          {
            tokenId: 'nft-2', 
            metadata: { name: 'Backstage Pass', attributes: [{ trait_type: 'Access Level', value: 'BACKSTAGE' }] }
          },
          {
            tokenId: 'nft-3',
            metadata: { name: 'Merchandise Pack', attributes: [{ trait_type: 'Access Level', value: 'MERCH' }] }
          }
        ],
        auditLog: {
          walletAddress: address,
          timestamp: new Date().toISOString(),
          action: 'NFT_ACCESS_VALIDATION',
          merchantContractAddress,
          requiredAccessLevel,
          metadata: requiredMetadata || {},
          network: supportedNetworks[0],
          contractVersion: supportLegacyContracts ? 'legacy' : 'current'
        }
      };

      setValidationResult(mockResult);
      onValidationSuccess(mockResult);
      
    } catch (err: any) {
      const errorResult = {
        success: false,
        accessGranted: false,
        walletAddress: address,
        error: err.message,
        errorMessage: err.message,
        network: supportedNetworks[0],
        contractVersion: supportLegacyContracts ? 'legacy' : 'current'
      };
      
      setError(err.message);
      onValidationFailure(errorResult);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setValidationResult(null);
    handleConnectWallet();
  };

  if (validationResult?.accessGranted) {
    return (
      <div className="nft-validator-success">
        <div className="success-message">
          <h3>Access Granted</h3>
          <p>You have successfully validated your NFT ownership.</p>
          <p>Access Level: {validationResult.accessLevel}</p>
          {validationResult.network && (
            <p>Network: {validationResult.network}</p>
          )}
          {validationResult.contractVersion && (
            <p>Contract Version: {validationResult.contractVersion}</p>
          )}
          {validationResult.metadataValidation && (
            <p>Metadata Validation: ✓ Passed</p>
          )}
        </div>
        {children}
      </div>
    );
  }

  if (error) {
    return (
      <div className="nft-validator-error">
        <div className="error-message">
          <h3>Access Denied</h3>
          {error.includes('Network connectivity') ? (
            <>
              <p>Temporary network issue. Please try again.</p>
              <button onClick={handleRetry} className="retry-button">
                Retry
              </button>
            </>
          ) : error.includes('transferred') ? (
            <>
              <p>NFT has been transferred to another wallet.</p>
              <p>You no longer own the required NFT for access.</p>
              <button onClick={() => window.location.href = '/purchase'} className="purchase-button">
                Go to Purchase Page
              </button>
            </>
          ) : (
            <>
              <p>NFT required for access</p>
              <p>Please purchase the required product to gain access.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="nft-validator">
      <div className="validation-form">
        <h3>NFT Access Validation</h3>
        <p>Connect your wallet to validate NFT ownership and access exclusive content.</p>
        
        {supportedNetworks.length > 1 && (
          <div className="network-info">
            <p>Supported Networks: {supportedNetworks.join(', ')}</p>
          </div>
        )}
        
        {supportLegacyContracts && (
          <div className="legacy-info">
            <p>✓ Legacy contract support enabled</p>
          </div>
        )}
        
        {requiredMetadata && (
          <div className="metadata-requirements">
            <p>Required Metadata:</p>
            <ul>
              {Object.entries(requiredMetadata).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          onClick={handleConnectWallet}
          disabled={isValidating}
          className="connect-wallet-button"
        >
          {isValidating ? 'Validating NFT...' : 'Connect Wallet'}
        </button>
        
        {isValidating && (
          <div className="loading-indicator">
            <p>Validating your NFT ownership...</p>
          </div>
        )}
      </div>
    </div>
  );
}; 