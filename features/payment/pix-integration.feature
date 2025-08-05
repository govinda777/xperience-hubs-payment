Feature: PIX Payment Integration with Split Payments
  As a merchant
  I want to receive PIX payments with automatic split
  So that I can sell products and receive my portion while the platform gets its fee

  Background:
    Given a merchant has configured their PIX payment settings
    And the platform has configured split payment rules
    And the PIX payment gateway is operational

  Scenario: Successful PIX payment with automatic split
    Given a customer has selected a product priced at "R$ 100,00"
    And the platform fee is configured at "5%"
    When the customer initiates PIX payment
    And the system generates a PIX QR Code with split configuration
    Then the QR Code should contain the total amount "R$ 100,00"
    And the split should be configured for merchant "R$ 95,00" and platform "R$ 5,00"
    When the customer completes the PIX payment
    And the payment is confirmed by the PIX provider
    Then the merchant should receive "R$ 95,00" in their account
    And the platform should receive "R$ 5,00" as fee
    And the order should be marked as "paid"
    And an NFT should be minted to the customer's wallet

  Scenario: PIX payment with high value order
    Given a customer has selected a product priced at "R$ 1.000,00"
    And the platform fee is configured at "3%"
    When the customer initiates PIX payment
    And the system generates a PIX QR Code with split configuration
    Then the QR Code should contain the total amount "R$ 1.000,00"
    And the split should be configured for merchant "R$ 970,00" and platform "R$ 30,00"
    When the customer completes the PIX payment
    Then the merchant should receive "R$ 970,00" in their account
    And the platform should receive "R$ 30,00" as fee

  Scenario: PIX payment timeout handling
    Given a customer has generated a PIX QR Code
    And the QR Code has a 15-minute expiration time
    When 15 minutes pass without payment
    Then the PIX QR Code should expire
    And the order should be marked as "expired"
    And no NFT should be minted
    And the customer should be able to generate a new QR Code

  Scenario: PIX payment failure handling
    Given a customer has initiated PIX payment
    When the PIX payment fails or is declined
    Then the order should be marked as "failed"
    And no NFT should be minted
    And the customer should be notified of the payment failure
    And the customer should be able to retry the payment

  Scenario: PIX webhook processing
    Given a PIX payment has been completed by the customer
    When the PIX provider sends a webhook notification
    And the webhook contains valid payment confirmation data
    Then the system should process the webhook successfully
    And the payment status should be updated to "confirmed"
    And the split payment should be processed automatically
    And an NFT should be minted to the customer's wallet

  Scenario: PIX webhook with invalid signature
    Given a PIX payment has been completed by the customer
    When the PIX provider sends a webhook with invalid signature
    Then the system should reject the webhook
    And the payment status should remain unchanged
    And no NFT should be minted
    And the webhook should be logged for security audit

  Scenario: PIX payment with multiple products
    Given a customer has selected multiple products:
      | product           | price      |
      | Concert Ticket    | R$ 150,00  |
      | VIP Parking       | R$ 50,00   |
      | Merchandise Pack  | R$ 75,00   |
    And the platform fee is configured at "5%"
    When the customer initiates PIX payment
    Then the total amount should be "R$ 275,00"
    And the split should be configured for merchant "R$ 261,25" and platform "R$ 13,75"
    When the customer completes the PIX payment
    Then the merchant should receive "R$ 261,25" in their account
    And the platform should receive "R$ 13,75" as fee
    And NFTs should be minted for Concert Ticket and VIP Parking
    And a traditional receipt should be issued for Merchandise Pack

  Scenario: PIX payment with dynamic fee calculation
    Given a merchant has configured tiered platform fees:
      | order_value_range | fee_percentage |
      | 0-100            | 5%             |
      | 101-500          | 4%             |
      | 501+             | 3%             |
    When a customer purchases a product for "R$ 300,00"
    Then the platform fee should be calculated as "4%"
    And the merchant should receive "R$ 288,00"
    And the platform should receive "R$ 12,00"

  Scenario: PIX payment reconciliation
    Given multiple PIX payments have been processed
    When the merchant requests a payment reconciliation report
    Then the system should provide a detailed report with:
      | field                    | description                    |
      | total_received           | Total amount received          |
      | platform_fees            | Total platform fees collected  |
      | merchant_portion         | Total merchant portion         |
      | transaction_count        | Number of transactions         |
      | date_range              | Report date range              |

  Scenario: PIX payment with refund processing
    Given a customer has successfully paid via PIX
    And the merchant has received their portion of the payment
    When the customer requests a refund
    And the refund is approved by the merchant
    Then the system should process the refund through PIX
    And the customer should receive the full amount back
    And the platform fee should be refunded to the merchant
    And the NFT should be burned or transferred back
    And the order should be marked as "refunded"

  Scenario: PIX payment with partial refund
    Given a customer has purchased multiple products via PIX
    And the payment has been successfully processed
    When the customer requests a partial refund for one product
    And the partial refund is approved
    Then the system should calculate the proportional refund amount
    And the customer should receive the partial refund
    And the platform fee should be adjusted proportionally
    And only the NFT for the refunded product should be affected
    And the remaining products should remain valid

  Scenario: PIX payment with network connectivity issues
    Given a customer is attempting to make a PIX payment
    And the PIX payment gateway is experiencing connectivity issues
    When the customer tries to generate a PIX QR Code
    Then the system should handle the error gracefully
    And the customer should see a temporary error message
    And the system should retry the operation when connectivity is restored
    And the customer should be able to proceed once the issue is resolved 