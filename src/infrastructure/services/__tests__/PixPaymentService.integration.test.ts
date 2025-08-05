import { defineFeature, loadFeature } from 'jest-cucumber';
import { PixPaymentService } from '../PixPaymentService';
import { TestDataBuilder, Given, When, Then } from '@/lib/bdd/helpers';

// Load the corresponding .feature file
const feature = loadFeature('./features/payment/pix-integration.feature');

defineFeature(feature, test => {
  let pixPaymentService: PixPaymentService;
  let result: any;
  let testContext: {
    orderAmount?: number;
    platformFee?: number;
    merchantAmount?: number;
    platformAmount?: number;
    qrCode?: string;
    paymentId?: string;
    products?: any[];
    totalAmount?: number;
    tieredFees?: any[];
    refundAmount?: number;
    platformFeeRefund?: number;
    merchantRefund?: number;
    nftAffected?: string;
    nftsRemaining?: any[];
    remainingProductsValid?: boolean;
    errorMessage?: string;
    retryAfter?: string;
    canProceed?: boolean;
  };

  beforeEach(() => {
    pixPaymentService = new PixPaymentService({
      apiUrl: 'https://api.test-pix.com',
      apiKey: 'test-api-key',
      splitConfig: {
        platformPercentage: 5,
        merchantAccount: 'merchant@test.com',
        platformAccount: 'platform@test.com'
      }
    });

    testContext = {};
  });

  test('Successful PIX payment with automatic split', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer has selected a product priced at "R$ 100,00"', () => {
      testContext.orderAmount = 10000; // R$ 100,00 in cents
    });

    and('the platform fee is configured at "5%"', () => {
      testContext.platformFee = 0.05; // 5%
    });

    when('the customer initiates PIX payment', async () => {
      // Customer initiates payment
    });

    and('the system generates a PIX QR Code with split configuration', async () => {
      result = await pixPaymentService.generatePixQRCode({
        orderId: 'order-123',
        amount: testContext.orderAmount!,
        merchantId: 'merchant-1',
        description: 'Test product purchase',
        expiresInMinutes: 15
      });

      testContext.qrCode = result.qrCode;
      testContext.paymentId = result.paymentId;
    });

    then('the QR Code should contain the total amount "R$ 100,00"', () => {
      expect(result.success).toBe(true);
      expect(result.amount).toBe(testContext.orderAmount);
      expect(result.qrCode).toBeDefined();
    });

    and('the split should be configured for merchant "R$ 95,00" and platform "R$ 5,00"', () => {
      testContext.merchantAmount = 9500; // R$ 95,00
      testContext.platformAmount = 500; // R$ 5,00

      expect(result.split).toBeDefined();
      expect(result.split.merchantAmount).toBe(testContext.merchantAmount);
      expect(result.split.platformAmount).toBe(testContext.platformAmount);
    });

    when('the customer completes the PIX payment', async () => {
      // Customer completes payment
    });

    and('the payment is confirmed by the PIX provider', async () => {
      result = await pixPaymentService.checkPixStatus(testContext.paymentId!);
    });

    then('the merchant should receive "R$ 95,00" in their account', () => {
      expect(result.status).toBe('paid');
      expect(result.merchantAmount).toBe(testContext.merchantAmount);
    });

    and('the platform should receive "R$ 5,00" as fee', () => {
      expect(result.platformAmount).toBe(testContext.platformAmount);
    });

    and('the order should be marked as "paid"', () => {
      expect(result.orderStatus).toBe('paid');
    });

    and('an NFT should be minted to the customer\'s wallet', () => {
      expect(result.nftMinted).toBe(true);
    });
  });

  test('PIX payment failure handling', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer has initiated PIX payment', async () => {
      result = await pixPaymentService.generatePixQRCode({
        orderId: 'order-fail-123',
        amount: 10000,
        merchantId: 'merchant-1',
        description: 'Test purchase',
        expiresInMinutes: 15
      });

      testContext.paymentId = result.paymentId;
    });

    when('the PIX payment fails or is declined', async () => {
      result = await pixPaymentService.checkPixStatus(testContext.paymentId!);
      result.status = 'failed';
    });

    then('the order should be marked as "failed"', () => {
      expect(result.orderStatus).toBe('failed');
    });

    and('no NFT should be minted', () => {
      expect(result.nftMinted).toBe(false);
    });

    and('the customer should be notified of the payment failure', () => {
      expect(result.notificationSent).toBe(true);
    });

    and('the customer should be able to retry the payment', () => {
      expect(result.retryAvailable).toBe(true);
    });
  });

  test('PIX webhook with invalid signature', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a PIX payment has been completed by the customer', () => {
      testContext.paymentId = 'pix-payment-456';
    });

    when('the PIX provider sends a webhook with invalid signature', async () => {
      const invalidWebhookData = {
        paymentId: testContext.paymentId,
        status: 'paid',
        amount: 10000,
        signature: 'invalid-signature',
        timestamp: new Date().toISOString()
      };

      result = await pixPaymentService.handlePixWebhook(invalidWebhookData);
    });

    then('the system should reject the webhook', () => {
      expect(result.success).toBe(false);
      expect(result.rejected).toBe(true);
    });

    and('the payment status should remain unchanged', () => {
      expect(result.paymentStatus).toBe('pending');
    });

    and('no NFT should be minted', () => {
      expect(result.nftMinted).toBe(false);
    });

    and('the webhook should be logged for security audit', () => {
      expect(result.auditLogged).toBe(true);
    });
  });

  test('PIX payment with dynamic fee calculation', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a merchant has configured tiered platform fees:', (table) => {
      testContext.tieredFees = table.map((row: any) => ({
        range: row.order_value_range,
        percentage: parseFloat(row.fee_percentage.replace('%', '')) / 100
      }));
    });

    when('a customer purchases a product for "R$ 300,00"', async () => {
      testContext.orderAmount = 30000; // R$ 300,00 in cents
      
      // Calculate fee based on tiered structure
      const fee = testContext.tieredFees.find((tier: any) => {
        const [min, max] = tier.range.split('-').map(Number);
        return testContext.orderAmount >= min * 100 && testContext.orderAmount <= (max || Infinity) * 100;
      });
      
      testContext.platformFee = fee.percentage; // 4%
    });

    then('the platform fee should be calculated as "4%"', () => {
      expect(testContext.platformFee).toBe(0.04);
    });

    and('the merchant should receive "R$ 288,00"', () => {
      testContext.merchantAmount = testContext.orderAmount * (1 - testContext.platformFee);
      expect(testContext.merchantAmount).toBe(28800); // R$ 288,00
    });

    and('the platform should receive "R$ 12,00"', () => {
      testContext.platformAmount = testContext.orderAmount * testContext.platformFee;
      expect(testContext.platformAmount).toBe(1200); // R$ 12,00
    });
  });

  test('PIX payment reconciliation', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('multiple PIX payments have been processed', () => {
      testContext.payments = [
        { amount: 10000, status: 'paid', merchantAmount: 9500, platformAmount: 500 },
        { amount: 20000, status: 'paid', merchantAmount: 19000, platformAmount: 1000 },
        { amount: 15000, status: 'paid', merchantAmount: 14250, platformAmount: 750 }
      ];
    });

    when('the merchant requests a payment reconciliation report', async () => {
      result = await pixPaymentService.generateReconciliationReport({
        merchantId: 'merchant-1',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      });
    });

    then('the system should provide a detailed report with:', (table) => {
      const expectedFields = table.map((row: any) => row.field);
      
      expect(result.report).toBeDefined();
      expect(result.report.total_received).toBe(45000); // Sum of all payments
      expect(result.report.platform_fees).toBe(2250); // Sum of platform fees
      expect(result.report.merchant_portion).toBe(42750); // Sum of merchant portions
      expect(result.report.transaction_count).toBe(3);
      expect(result.report.date_range).toBeDefined();
    });
  });

  test('PIX payment with refund processing', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer has successfully paid via PIX', async () => {
      result = await pixPaymentService.generatePixQRCode({
        orderId: 'order-refund-123',
        amount: 10000,
        merchantId: 'merchant-1',
        description: 'Test purchase for refund',
        expiresInMinutes: 15
      });

      testContext.paymentId = result.paymentId;
    });

    and('the merchant has received their portion of the payment', () => {
      testContext.merchantAmount = 9500; // R$ 95,00
      testContext.platformAmount = 500; // R$ 5,00
    });

    when('the customer requests a refund', async () => {
      result = await pixPaymentService.requestRefund({
        paymentId: testContext.paymentId,
        reason: 'Customer request',
        amount: 10000
      });
    });

    and('the refund is approved by the merchant', async () => {
      result = await pixPaymentService.approveRefund({
        refundId: result.refundId,
        approved: true
      });
    });

    then('the system should process the refund through PIX', async () => {
      result = await pixPaymentService.processRefund({
        refundId: result.refundId,
        amount: 10000
      });
    });

    and('the customer should receive the full amount back', () => {
      expect(result.customerRefunded).toBe(10000);
    });

    and('the platform fee should be refunded to the merchant', () => {
      expect(result.merchantRefunded).toBe(500);
    });

    and('the NFT should be burned or transferred back', () => {
      expect(result.nftBurned).toBe(true);
    });

    and('the order should be marked as "refunded"', () => {
      expect(result.orderStatus).toBe('refunded');
    });
  });

  test('PIX payment with partial refund', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer has purchased multiple products via PIX', async () => {
      testContext.products = [
        { name: 'Product A', price: 5000, nftEnabled: true },
        { name: 'Product B', price: 3000, nftEnabled: true },
        { name: 'Product C', price: 2000, nftEnabled: false }
      ];
      
      testContext.totalAmount = testContext.products.reduce((sum, product) => sum + product.price, 0);
    });

    and('the payment has been successfully processed', async () => {
      result = await pixPaymentService.generatePixQRCode({
        orderId: 'order-partial-refund-123',
        amount: testContext.totalAmount,
        merchantId: 'merchant-1',
        description: 'Multiple products purchase',
        expiresInMinutes: 15
      });

      testContext.paymentId = result.paymentId;
    });

    when('the customer requests a partial refund for one product', async () => {
      result = await pixPaymentService.requestPartialRefund({
        paymentId: testContext.paymentId,
        productName: 'Product A',
        amount: 5000,
        reason: 'Defective product'
      });
    });

    and('the partial refund is approved', async () => {
      result = await pixPaymentService.approveRefund({
        refundId: result.refundId,
        approved: true
      });
    });

    then('the system should calculate the proportional refund amount', () => {
      const refundPercentage = 5000 / testContext.totalAmount;
      testContext.refundAmount = 5000;
      testContext.platformFeeRefund = 5000 * 0.05; // 5% of refunded amount
      testContext.merchantRefund = 5000 - testContext.platformFeeRefund;
    });

    and('the customer should receive the partial refund', () => {
      expect(result.customerRefunded).toBe(testContext.refundAmount);
    });

    and('the platform fee should be adjusted proportionally', () => {
      expect(result.platformFeeRefund).toBe(testContext.platformFeeRefund);
    });

    and('only the NFT for the refunded product should be affected', () => {
      expect(result.nftAffected).toBe('Product A');
      expect(result.nftsRemaining).toHaveLength(1); // Product B NFT remains
    });

    and('the remaining products should remain valid', () => {
      expect(result.remainingProductsValid).toBe(true);
    });
  });

  test('PIX payment with network connectivity issues', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer is attempting to make a PIX payment', () => {
      testContext.orderAmount = 10000;
    });

    and('the PIX payment gateway is experiencing connectivity issues', () => {
      // Mock connectivity issues
      pixPaymentService = new PixPaymentService({
        apiUrl: 'https://unreachable-api.com',
        apiKey: 'test-api-key',
        splitConfig: {
          platformPercentage: 5,
          merchantAccount: 'merchant@test.com',
          platformAccount: 'platform@test.com'
        }
      });
    });

    when('the customer tries to generate a PIX QR Code', async () => {
      try {
        result = await pixPaymentService.generatePixQRCode({
          orderId: 'order-network-issue-123',
          amount: testContext.orderAmount,
          merchantId: 'merchant-1',
          description: 'Test purchase',
          expiresInMinutes: 15
        });
      } catch (error) {
        result = { success: false, error: error.message };
      }
    });

    then('the system should handle the error gracefully', () => {
      expect(result.success).toBe(false);
      expect(result.error).toContain('connectivity');
    });

    and('the customer should see a temporary error message', () => {
      expect(result.errorMessage).toContain('temporary');
      expect(result.errorMessage).toContain('try again');
    });

    and('the system should retry the operation when connectivity is restored', () => {
      expect(result.retryAvailable).toBe(true);
      expect(result.retryAfter).toBeDefined();
    });

    and('the customer should be able to proceed once the issue is resolved', () => {
      expect(result.canProceed).toBe(true);
    });
  });

  test('PIX payment with high value order', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer has selected a product priced at "R$ 1.000,00"', () => {
      testContext.orderAmount = 100000; // R$ 1.000,00 in cents
    });

    and('the platform fee is configured at "3%"', () => {
      testContext.platformFee = 0.03; // 3%
    });

    when('the customer initiates PIX payment', async () => {
      // Customer initiates payment
    });

    and('the system generates a PIX QR Code with split configuration', async () => {
      result = await pixPaymentService.generatePixQRCode({
        orderId: 'order-456',
        amount: testContext.orderAmount!,
        merchantId: 'merchant-1',
        description: 'High value purchase',
        expiresInMinutes: 30
      });
    });

    then('the QR Code should contain the total amount "R$ 1.000,00"', () => {
      expect(result.success).toBe(true);
      expect(result.amount).toBe(testContext.orderAmount);
    });

    and('the split should be configured for merchant "R$ 970,00" and platform "R$ 30,00"', () => {
      testContext.merchantAmount = 97000; // R$ 970,00
      testContext.platformAmount = 3000; // R$ 30,00

      expect(result.split.merchantAmount).toBe(testContext.merchantAmount);
      expect(result.split.platformAmount).toBe(testContext.platformAmount);
    });

    when('the customer completes the PIX payment', async () => {
      result = await pixPaymentService.checkPixStatus(result.paymentId);
    });

    then('the merchant should receive "R$ 970,00" in their account', () => {
      expect(result.merchantAmount).toBe(testContext.merchantAmount);
    });

    and('the platform should receive "R$ 30,00" as fee', () => {
      expect(result.platformAmount).toBe(testContext.platformAmount);
    });
  });

  test('PIX payment timeout handling', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer has generated a PIX QR Code', async () => {
      result = await pixPaymentService.generatePixQRCode({
        orderId: 'order-789',
        amount: 10000,
        merchantId: 'merchant-1',
        description: 'Test purchase',
        expiresInMinutes: 15
      });

      testContext.paymentId = result.paymentId;
    });

    and('the QR Code has a 15-minute expiration time', () => {
      expect(result.expiresAt).toBeDefined();
      const expirationTime = new Date(result.expiresAt);
      const now = new Date();
      const diffInMinutes = (expirationTime.getTime() - now.getTime()) / (1000 * 60);
      expect(diffInMinutes).toBeCloseTo(15, 0);
    });

    when('15 minutes pass without payment', async () => {
      // Simulate time passing
      jest.advanceTimersByTime(15 * 60 * 1000);
    });

    then('the PIX QR Code should expire', async () => {
      result = await pixPaymentService.checkPixStatus(testContext.paymentId!);
      expect(result.status).toBe('expired');
    });

    and('the order should be marked as "expired"', () => {
      expect(result.orderStatus).toBe('expired');
    });

    and('no NFT should be minted', () => {
      expect(result.nftMinted).toBe(false);
    });

    and('the customer should be able to generate a new QR Code', async () => {
      const newResult = await pixPaymentService.generatePixQRCode({
        orderId: 'order-789-retry',
        amount: 10000,
        merchantId: 'merchant-1',
        description: 'Test purchase retry',
        expiresInMinutes: 15
      });

      expect(newResult.success).toBe(true);
      expect(newResult.qrCode).toBeDefined();
    });
  });

  test('PIX webhook processing', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a PIX payment has been completed by the customer', () => {
      testContext.paymentId = 'pix-payment-123';
    });

    when('the PIX provider sends a webhook notification', async () => {
      // PIX provider sends webhook
    });

    and('the webhook contains valid payment confirmation data', async () => {
      const webhookData = {
        paymentId: testContext.paymentId,
        status: 'paid',
        amount: 10000,
        signature: 'valid-signature',
        timestamp: new Date().toISOString()
      };

      result = await pixPaymentService.handlePixWebhook(webhookData);
    });

    then('the system should process the webhook successfully', () => {
      expect(result.success).toBe(true);
    });

    and('the payment status should be updated to "confirmed"', () => {
      expect(result.paymentStatus).toBe('confirmed');
    });

    and('the split payment should be processed automatically', () => {
      expect(result.splitProcessed).toBe(true);
      expect(result.merchantAmount).toBe(9500);
      expect(result.platformAmount).toBe(500);
    });

    and('an NFT should be minted to the customer\'s wallet', () => {
      expect(result.nftMinted).toBe(true);
    });
  });

  test('PIX payment with multiple products', ({ given, when, then, and }) => {
    given('a merchant has configured their PIX payment settings', () => {
      // Merchant PIX settings are configured
    });

    and('the platform has configured split payment rules', () => {
      // Platform split rules are configured
    });

    and('the PIX payment gateway is operational', () => {
      // PIX gateway is operational
    });

    given('a customer has selected multiple products:', (table) => {
      testContext.products = table.map((row: any) => ({
        name: row.product,
        price: parseInt(row.price.replace('R$ ', '').replace(',', '')) * 100, // Convert to cents
        nftEnabled: row.product !== 'Merchandise Pack' // Only merchandise doesn't have NFT
      }));
    });

    and('the platform fee is configured at "5%"', () => {
      testContext.platformFee = 0.05;
    });

    when('the customer initiates PIX payment', async () => {
      const totalAmount = testContext.products.reduce((sum, product) => sum + product.price, 0);
      testContext.totalAmount = totalAmount; // R$ 275,00
    });

    then('the total amount should be "R$ 275,00"', () => {
      expect(testContext.totalAmount).toBe(27500);
    });

    and('the split should be configured for merchant "R$ 261,25" and platform "R$ 13,75"', () => {
      testContext.merchantAmount = 26125; // R$ 261,25
      testContext.platformAmount = 1375; // R$ 13,75

      const calculatedMerchantAmount = testContext.totalAmount * (1 - testContext.platformFee);
      const calculatedPlatformAmount = testContext.totalAmount * testContext.platformFee;

      expect(calculatedMerchantAmount).toBe(testContext.merchantAmount);
      expect(calculatedPlatformAmount).toBe(testContext.platformAmount);
    });

    when('the customer completes the PIX payment', async () => {
      result = await pixPaymentService.processPayment({
        orderId: 'order-multi-123',
        amount: testContext.totalAmount,
        products: testContext.products,
        merchantId: 'merchant-1'
      });
    });

    then('the merchant should receive "R$ 261,25" in their account', () => {
      expect(result.merchantAmount).toBe(testContext.merchantAmount);
    });

    and('the platform should receive "R$ 13,75" as fee', () => {
      expect(result.platformAmount).toBe(testContext.platformAmount);
    });

    and('NFTs should be minted for Concert Ticket and VIP Parking', () => {
      expect(result.nftsMinted).toHaveLength(2);
      expect(result.nftsMinted[0].productName).toBe('Concert Ticket');
      expect(result.nftsMinted[1].productName).toBe('VIP Parking');
    });

    and('a traditional receipt should be issued for Merchandise Pack', () => {
      expect(result.traditionalReceipts).toHaveLength(1);
      expect(result.traditionalReceipts[0].productName).toBe('Merchandise Pack');
    });
  });
}); 