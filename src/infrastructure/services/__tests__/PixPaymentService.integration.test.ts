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