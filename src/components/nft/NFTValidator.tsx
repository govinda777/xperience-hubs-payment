import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { ValidateNFTAccessUseCase } from '@/core/use-cases/nft/ValidateNFTAccessUseCase';

interface NFTValidatorProps {
  merchantContractAddress: string;
  requiredAccessLevel: string;
  onValidationSuccess: (result: any) => void;
  onValidationFailure: (result: any) => void;
  children?: React.ReactNode;
}

export const NFTValidator: React.FC<NFTValidatorProps> = ({
  merchantContractAddress,
  requiredAccessLevel,
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
      
      // Simulate validation result
      const mockResult = {
        success: true,
        accessGranted: true,
        accessLevel: requiredAccessLevel,
        walletAddress: address,
        auditLog: {
          walletAddress: address,
          timestamp: new Date().toISOString(),
          action: 'NFT_ACCESS_VALIDATION',
          merchantContractAddress,
          requiredAccessLevel
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
        errorMessage: err.message
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