Feature: NFT Validation and Access Control
  As a customer with purchased NFTs
  I want to validate my NFT ownership and access exclusive content
  So that I can prove my purchase and access restricted areas

  Background:
    Given a merchant has deployed their smart contract
    And the merchant has products with NFT access enabled
    And the PIX payment system is configured with split payments

  Scenario: Successful NFT ownership validation for access control
    Given I have purchased a product with NFT access
    And the NFT has been minted to my wallet "0x1234567890123456789012345678901234567890"
    And I am trying to access exclusive content
    When I connect my wallet to the validation system
    And I sign a message to prove ownership
    Then the system should verify I own the required NFT
    And I should be granted access to exclusive content
    And my access should be logged for audit purposes

  Scenario: NFT validation with multiple NFTs from same merchant
    Given I have purchased multiple products from the same merchant
    And I have accumulated several NFTs in my wallet
    When I connect my wallet to access premium content
    And I sign the ownership verification message
    Then the system should verify I own at least one valid NFT
    And I should be granted access to all content levels
    And the system should show my complete NFT collection

  Scenario: NFT validation failure for non-owner
    Given I am trying to access exclusive content
    And I do not own the required NFT
    When I connect my wallet to the validation system
    And I attempt to sign the ownership verification
    Then the system should detect I do not own the required NFT
    And I should be denied access to exclusive content
    And I should see a clear message explaining the requirement

  Scenario: NFT validation with expired or invalid NFT
    Given I previously owned a valid NFT
    And the NFT has been transferred to another wallet
    When I try to access exclusive content
    And I connect my wallet for validation
    Then the system should detect I no longer own the NFT
    And I should be denied access to exclusive content
    And I should be informed that the NFT has been transferred

  Scenario: NFT validation with network connectivity issues
    Given I have a valid NFT in my wallet
    And the blockchain network is experiencing connectivity issues
    When I attempt to validate my NFT ownership
    Then the system should handle the network error gracefully
    And I should see a temporary access message
    And the system should retry validation when network is restored

  Scenario: Batch NFT validation for multiple users
    Given multiple users are trying to access exclusive content simultaneously
    And each user has valid NFTs from the merchant
    When the system processes batch validation requests
    Then each user should be validated independently
    And all valid NFT owners should be granted access
    And the system should handle concurrent requests efficiently

  Scenario: NFT metadata validation for specific content access
    Given I have an NFT with specific metadata attributes
    And the exclusive content requires specific NFT attributes
    When I attempt to access the content
    And the system validates my NFT metadata
    Then the system should check the NFT's specific attributes
    And I should only be granted access to content matching my NFT attributes
    And the validation should be logged with metadata details

  Scenario: NFT transfer and access revocation
    Given I have access to exclusive content with my NFT
    And I transfer my NFT to another wallet
    When I try to access the exclusive content again
    Then the system should detect the NFT transfer
    And my access should be immediately revoked
    And I should be redirected to the purchase page

  Scenario: NFT validation with different blockchain networks
    Given the merchant supports multiple blockchain networks
    And I have NFTs on different networks
    When I connect my wallet for validation
    Then the system should detect which network my NFT is on
    And it should validate the NFT on the correct network
    And I should be granted access regardless of the network

  Scenario: NFT validation with smart contract upgrades
    Given the merchant's smart contract has been upgraded
    And I have an NFT from the old contract version
    When I attempt to validate my NFT ownership
    Then the system should handle both old and new contract versions
    And my NFT should still be considered valid
    And I should be granted access to exclusive content 