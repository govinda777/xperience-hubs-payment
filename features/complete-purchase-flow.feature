Feature: Complete Purchase Flow with NFT Minting
  As a customer
  I want to purchase a product and receive an NFT
  So that I can prove my purchase and access exclusive content

  Background:
    Given a merchant has deployed their smart contract
    And the merchant has products available in their store
    And the PIX payment system is configured with split payments

  Scenario: Successful product purchase with PIX payment and NFT minting
    Given I am browsing the merchant's online store
    And there is a product "VIP Concert Ticket" priced at "R$ 150,00"
    And the product has NFT access enabled
    When I add the product to my cart
    And I proceed to checkout
    And I provide my wallet address "0x123...abc"
    And I choose PIX as payment method
    Then I should see a PIX QR Code for payment
    And the QR Code should include split payment configuration
    When I pay the PIX amount
    And the payment is confirmed by the PIX provider
    Then an NFT should be automatically minted to my wallet
    And the NFT should contain my purchase details
    And I should receive confirmation of successful purchase
    And the merchant should receive their portion of the payment
    And the platform should receive the platform fee

  Scenario: Multiple products purchase with batch NFT minting
    Given I am browsing the merchant's online store
    And there are products:
      | name                  | price    | nft_enabled |
      | Concert Ticket        | R$ 100,00| true        |
      | VIP Parking Pass      | R$ 50,00 | true        |
      | Merchandise Package   | R$ 75,00 | false       |
    When I add all products to my cart
    And I proceed to checkout with PIX payment
    And the total amount is "R$ 225,00"
    And I complete the PIX payment
    Then 2 NFTs should be minted (for Concert Ticket and VIP Parking Pass)
    And 1 traditional receipt should be issued (for Merchandise Package)
    And all NFTs should be sent to my wallet address
    And each NFT should have unique metadata for its respective product

  Scenario: Payment failure and order cancellation
    Given I have items in my cart worth "R$ 200,00"
    And I have generated a PIX QR Code
    When the PIX payment fails or is declined
    Then the order should be marked as "failed"
    And no NFT should be minted
    And I should be notified of the payment failure
    And I should be able to retry the payment

  Scenario: PIX payment timeout handling
    Given I have generated a PIX QR Code with 15-minute expiration
    When 15 minutes pass without payment
    Then the PIX QR Code should expire
    And the order should be marked as "expired"
    And no NFT should be minted
    And I should be able to generate a new QR Code if desired

  Scenario: NFT minting failure with successful payment
    Given I have successfully paid via PIX
    And the payment has been confirmed and split
    When the NFT minting process fails due to blockchain issues
    Then I should still have proof of purchase via traditional receipt
    And the system should queue the NFT minting for retry
    And I should be notified that my NFT will be delivered once the blockchain is available
    And my payment should not be refunded

  Scenario: Merchant receives correct payment split
    Given a product costs "R$ 100,00"
    And the platform fee is configured at "5%"
    When a customer completes a PIX payment
    Then the merchant should receive "R$ 95,00"
    And the platform should receive "R$ 5,00"
    And both payments should be processed automatically
    And the split should be transparent in transaction records

  Scenario: Customer accesses NFT-gated content
    Given I have purchased a product with NFT access
    And the NFT has been minted to my wallet "0x123...abc"
    When I connect my wallet to the merchant's exclusive area
    And I sign a message to prove ownership
    Then the system should verify I own the required NFT
    And I should be granted access to exclusive content
    And my access should be logged for audit purposes

  Scenario: Invalid wallet address during checkout
    Given I have items in my cart
    When I provide an invalid wallet address "invalid-address-123"
    And I attempt to proceed to checkout
    Then I should see a validation error
    And I should be prompted to enter a valid wallet address
    And the checkout process should not continue until a valid address is provided

  Scenario: Product stock validation during purchase
    Given a product has limited stock of "2 units"
    And another customer is simultaneously purchasing the same product
    When I attempt to purchase "3 units" of the product
    Then I should see an "insufficient stock" error
    And my cart should be updated to show available quantity
    And I should be able to adjust my purchase to available stock

  Scenario: Concurrent purchases of limited edition NFTs
    Given a product has a maximum NFT supply of "100 tokens"
    And "99 NFTs" have already been minted
    When multiple customers simultaneously attempt to purchase
    Then only the first customer should successfully receive the NFT
    And subsequent customers should receive appropriate error messages
    And no more than "100 NFTs" should ever be minted for this product

  Scenario: Customer views their NFT collection
    Given I have made multiple purchases over time
    And I have accumulated several NFTs in my wallet
    When I visit my profile page
    And I connect my wallet
    Then I should see all NFTs I own from this merchant
    And each NFT should display its associated purchase details
    And I should be able to view the metadata and transaction history