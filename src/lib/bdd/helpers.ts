import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { Product } from '@/core/entities/Product';
import { Order } from '@/core/entities/Order';
import { Merchant } from '@/core/entities/Merchant';
import { Money } from '@/types/payment';

// ===========================================
// BDD Test Helpers - Given, When, Then
// ===========================================

/**
 * Helper para criar dados de teste de forma consistente
 */
export class TestDataBuilder {
  static createProduct(overrides: Partial<any> = {}): Product {
    return new Product({
      id: 'product-1',
      name: 'Test Product',
      description: 'A test product for BDD scenarios',
      price: TestDataBuilder.createMoney(10000), // R$ 100,00
      category: 'physical_product',
      images: [],
      merchantId: 'merchant-1',
      isActive: true,
      ...overrides,
    });
  }

  static createMerchant(overrides: Partial<any> = {}): Merchant {
    return new Merchant({
      id: 'merchant-1',
      userId: 'user-1',
      name: 'Test Merchant',
      description: 'A test merchant for BDD scenarios',
      contractAddress: '0x1234567890123456789012345678901234567890',
      pixKey: 'test@merchant.com',
      settings: {
        splitPercentage: 0.05,
        nftEnabled: true,
      },
      ...overrides,
    });
  }

  static createOrder(overrides: Partial<any> = {}): Order {
    const defaultItems = [
      {
        id: 'item-1',
        productId: 'product-1',
        productName: 'Test Product',
        productImage: 'https://example.com/image.jpg',
        quantity: 1,
        unitPrice: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
        totalPrice: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
        attributes: {},
      }
    ];

    return new Order({
      id: 'order-1',
      merchantId: 'merchant-1',
      userId: 'user-1',
      items: defaultItems,
      customer: {
        id: 'customer-1',
        name: 'John Doe',
        email: 'john@example.com',
        walletAddress: '0x1234567890123456789012345678901234567890',
      },
      payment: {
        method: 'pix',
        status: 'pending',
      },
      subtotal: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
      total: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
      ...overrides,
    });
  }

  static createMoney(amount: number, currency = 'BRL'): Money {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);

    return {
      amount,
      currency,
      formatted,
    };
  }
}

/**
 * Helper para renderização de componentes em contexto BDD
 */
export class BDDRenderHelper {
  static renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
  ): RenderResult {
    // Aqui você pode adicionar providers necessários (Redux, Context, etc.)
    return render(ui, options);
  }

  static async waitForElement(
    getElement: () => HTMLElement | null,
    timeout = 5000
  ): Promise<HTMLElement> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = getElement();
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Element not found within ${timeout}ms`);
  }
}

/**
 * Helper para simulação de ações do usuário
 */
export class UserActionHelper {
  static async fillForm(fields: Record<string, string>): Promise<void> {
    const { fireEvent, screen } = await import('@testing-library/react');
    
    for (const [label, value] of Object.entries(fields)) {
      const field = screen.getByLabelText(new RegExp(label, 'i'));
      fireEvent.change(field, { target: { value } });
    }
  }

  static async clickButton(buttonText: string): Promise<void> {
    const { fireEvent, screen } = await import('@testing-library/react');
    const button = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
    fireEvent.click(button);
  }

  static async selectOption(selectLabel: string, optionValue: string): Promise<void> {
    const { fireEvent, screen } = await import('@testing-library/react');
    const select = screen.getByLabelText(new RegExp(selectLabel, 'i'));
    fireEvent.change(select, { target: { value: optionValue } });
  }
}

/**
 * Helper para asserções BDD mais expressivas
 */
export class BDDAssertionHelper {
  static expectElementToBeVisible(element: HTMLElement): void {
    expect(element).toBeInTheDocument();
    expect(element).toBeVisible();
  }

  static expectElementToHaveText(element: HTMLElement, text: string): void {
    expect(element).toHaveTextContent(text);
  }

  static expectFormToBeValid(form: HTMLFormElement): void {
    expect(form).toBeValid();
  }

  static expectPaymentStatusToBe(status: string, actualStatus: string): void {
    expect(actualStatus).toBe(status);
  }

  static expectOrderToContainItems(order: Order, expectedCount: number): void {
    expect(order.items).toHaveLength(expectedCount);
  }

  static expectPriceToMatch(actual: Money, expected: Money): void {
    expect(actual.amount).toBe(expected.amount);
    expect(actual.currency).toBe(expected.currency);
  }
}

/**
 * Helper para simulação de APIs e serviços
 */
export class MockServiceHelper {
  static mockPaymentService() {
    return {
      createPixTransaction: jest.fn(),
      getPixTransaction: jest.fn(),
      checkPixStatus: jest.fn(),
      calculateSplit: jest.fn(),
      processSplitPayment: jest.fn(),
      generatePixQRCode: jest.fn(),
      handlePixWebhook: jest.fn(),
      validatePixKey: jest.fn(),
      validateAmount: jest.fn(),
      getPaymentStats: jest.fn(),
    };
  }

  static mockAuthService() {
    return {
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      getCurrentUser: jest.fn(),
      validateToken: jest.fn(),
      refreshToken: jest.fn(),
    };
  }

  static mockNFTService() {
    return {
      mintNFT: jest.fn(),
      getNFT: jest.fn(),
      transferNFT: jest.fn(),
      burnNFT: jest.fn(),
      getNFTsByUser: jest.fn(),
      getNFTsByMerchant: jest.fn(),
    };
  }

  static setupSuccessfulPayment() {
    const mockService = this.mockPaymentService();
    
    mockService.calculateSplit.mockResolvedValue({
      merchantAmount: TestDataBuilder.createMoney(9500),
      platformAmount: TestDataBuilder.createMoney(500),
      merchantPercentage: 0.95,
      platformPercentage: 0.05,
    });

    mockService.createPixTransaction.mockResolvedValue({
      id: 'pix-123',
      amount: TestDataBuilder.createMoney(10000),
      pixKey: 'test@merchant.com',
      status: 'pending',
      qrCode: 'data:image/png;base64,test-qr-code',
      qrCodeText: 'test-qr-code-text',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date(),
    });

    return mockService;
  }
}

/**
 * Helper para cenários específicos de negócio
 */
export class BusinessScenarioHelper {
  static async simulateUserPurchaseJourney() {
    // Simular jornada completa de compra
    const product = TestDataBuilder.createProduct();
    const merchant = TestDataBuilder.createMerchant();
    const order = TestDataBuilder.createOrder();
    
    return { product, merchant, order };
  }

  static async simulatePaymentFlow(paymentMethod: 'PIX' | 'CRYPTO') {
    const mockService = MockServiceHelper.setupSuccessfulPayment();
    
    if (paymentMethod === 'PIX') {
      mockService.generatePixQRCode.mockResolvedValue({
        qrCode: 'data:image/png;base64,test-qr-code',
        qrCodeText: 'test-qr-code-text',
      });
    }
    
    return mockService;
  }
}

// Export de conveniência para importação mais limpa
export const Given = {
  aProduct: (overrides?: Partial<any>) => TestDataBuilder.createProduct(overrides),
  aMerchant: (overrides?: Partial<any>) => TestDataBuilder.createMerchant(overrides),
  anOrder: (overrides?: Partial<any>) => TestDataBuilder.createOrder(overrides),
  aSuccessfulPaymentService: () => MockServiceHelper.setupSuccessfulPayment(),
};

export const When = {
  userFillsForm: UserActionHelper.fillForm,
  userClicksButton: UserActionHelper.clickButton,
  userSelectsOption: UserActionHelper.selectOption,
  simulatingPayment: BusinessScenarioHelper.simulatePaymentFlow,
};

export const Then = {
  expectVisible: BDDAssertionHelper.expectElementToBeVisible,
  expectText: BDDAssertionHelper.expectElementToHaveText,
  expectPaymentStatus: BDDAssertionHelper.expectPaymentStatusToBe,
  expectOrderItems: BDDAssertionHelper.expectOrderToContainItems,
  expectPrice: BDDAssertionHelper.expectPriceToMatch,
};