import { Order, OrderStatus, OrderType } from '../Order';
import { Money } from '@/types/payment';

describe('Order Entity', () => {
  let order: Order;
  let mockMoney: Money;

  beforeEach(() => {
    mockMoney = {
      amount: 10000,
      currency: 'BRL',
      formatted: 'R$ 100,00'
    };

    order = new Order({
      id: 'order-123',
      merchantId: 'merchant-123',
      userId: 'user-123',
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          productName: 'Test Product',
          productImage: 'https://example.com/image.jpg',
          quantity: 2,
          unitPrice: { amount: 5000, currency: 'BRL', formatted: 'R$ 50,00' },
          totalPrice: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
          attributes: { color: 'red', size: 'M' },
        }
      ],
      customer: {
        id: 'customer-123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+5511999999999',
        walletAddress: '0x1234567890123456789012345678901234567890',
      },
      payment: {
        method: 'pix',
        status: 'pending',
      },
      subtotal: mockMoney,
      total: mockMoney,
    });
  });

  describe('Constructor', () => {
    it('should create order with required fields', () => {
      expect(order.id).toBe('order-123');
      expect(order.merchantId).toBe('merchant-123');
      expect(order.userId).toBe('user-123');
      expect(order.status).toBe('pending');
      expect(order.type).toBe('single');
      expect(order.items).toHaveLength(1);
      expect(order.customer.name).toBe('John Doe');
      expect(order.payment.method).toBe('pix');
      expect(order.payment.status).toBe('pending');
    });

    it('should create order with default values', () => {
      const minimalOrder = new Order({
        id: 'order-456',
        merchantId: 'merchant-456',
        userId: 'user-456',
        items: [],
        customer: {
          id: 'customer-456',
          name: 'Jane Doe',
          email: 'jane@example.com',
          walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        },
        payment: {
          method: 'pix',
          status: 'pending',
        },
        subtotal: mockMoney,
        total: mockMoney,
      });

      expect(minimalOrder.status).toBe('pending');
      expect(minimalOrder.type).toBe('single');
      expect(minimalOrder.shippingCost.amount).toBe(0);
      expect(minimalOrder.tax.amount).toBe(0);
      expect(minimalOrder.nftTokens).toEqual([]);
      expect(minimalOrder.metadata).toEqual({});
      expect(minimalOrder.timeline).toHaveLength(1);
      expect(minimalOrder.timeline[0].status).toBe('pending');
      expect(minimalOrder.timeline[0].description).toBe('Pedido criado');
    });

    it('should create order with custom values', () => {
      const customOrder = new Order({
        id: 'order-789',
        merchantId: 'merchant-789',
        userId: 'user-789',
        items: [],
        customer: {
          id: 'customer-789',
          name: 'Bob Smith',
          email: 'bob@example.com',
          walletAddress: '0x789abcdef123456789abcdef123456789abcdef12',
        },
        payment: {
          method: 'crypto',
          status: 'paid',
        },
        status: 'confirmed',
        type: 'subscription',
        subtotal: mockMoney,
        shippingCost: { amount: 2000, currency: 'BRL', formatted: 'R$ 20,00' },
        tax: { amount: 1000, currency: 'BRL', formatted: 'R$ 10,00' },
        total: { amount: 13000, currency: 'BRL', formatted: 'R$ 130,00' },
        nftTokens: ['nft-1', 'nft-2'],
        metadata: { source: 'mobile-app' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });

      expect(customOrder.status).toBe('confirmed');
      expect(customOrder.type).toBe('subscription');
      expect(customOrder.shippingCost.amount).toBe(2000);
      expect(customOrder.tax.amount).toBe(1000);
      expect(customOrder.total.amount).toBe(13000);
      expect(customOrder.nftTokens).toEqual(['nft-1', 'nft-2']);
      expect(customOrder.metadata).toEqual({ source: 'mobile-app' });
      expect(customOrder.createdAt).toEqual(new Date('2024-01-01'));
      expect(customOrder.updatedAt).toEqual(new Date('2024-01-02'));
    });
  });

  describe('addItem', () => {
    it('should add item to order', () => {
      const newItem = {
        id: 'item-2',
        productId: 'product-2',
        productName: 'Another Product',
        productImage: 'https://example.com/image2.jpg',
        quantity: 1,
        unitPrice: { amount: 3000, currency: 'BRL', formatted: 'R$ 30,00' },
        totalPrice: { amount: 3000, currency: 'BRL', formatted: 'R$ 30,00' },
        attributes: { color: 'blue' },
      };

      const initialItemCount = order.items.length;
      const initialSubtotal = order.subtotal.amount;

      order.addItem(newItem);

      expect(order.items).toHaveLength(initialItemCount + 1);
      expect(order.items[initialItemCount]).toEqual(newItem);
      expect(order.subtotal.amount).toBe(initialSubtotal + newItem.totalPrice.amount);
      expect(order.total.amount).toBe(initialSubtotal + newItem.totalPrice.amount);
    });

    it('should update updatedAt when adding item', () => {
      const originalUpdatedAt = order.updatedAt;
      const newItem = {
        id: 'item-2',
        productId: 'product-2',
        productName: 'Another Product',
        productImage: 'https://example.com/image2.jpg',
        quantity: 1,
        unitPrice: { amount: 3000, currency: 'BRL', formatted: 'R$ 30,00' },
        totalPrice: { amount: 3000, currency: 'BRL', formatted: 'R$ 30,00' },
        attributes: {},
      };

      order.addItem(newItem);

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('removeItem', () => {
    it('should remove item from order', () => {
      const initialItemCount = order.items.length;
      const initialSubtotal = order.subtotal.amount;
      const itemToRemove = order.items[0];

      order.removeItem(itemToRemove.id);

      expect(order.items).toHaveLength(initialItemCount - 1);
      expect(order.items.find(item => item.id === itemToRemove.id)).toBeUndefined();
      expect(order.subtotal.amount).toBe(initialSubtotal - itemToRemove.totalPrice.amount);
      expect(order.total.amount).toBe(initialSubtotal - itemToRemove.totalPrice.amount);
    });

    it('should not remove non-existent item', () => {
      const initialItemCount = order.items.length;
      const initialSubtotal = order.subtotal.amount;

      order.removeItem('non-existent-id');

      expect(order.items).toHaveLength(initialItemCount);
      expect(order.subtotal.amount).toBe(initialSubtotal);
    });

    it('should update updatedAt when removing item', () => {
      const originalUpdatedAt = order.updatedAt;

      order.removeItem(order.items[0].id);

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity and recalculate totals', () => {
      const item = order.items[0];
      const newQuantity = 3;
      const expectedTotalPrice = item.unitPrice.amount * newQuantity;

      order.updateItemQuantity(item.id, newQuantity);

      expect(item.quantity).toBe(newQuantity);
      expect(item.totalPrice.amount).toBe(expectedTotalPrice);
      expect(order.subtotal.amount).toBe(expectedTotalPrice);
      expect(order.total.amount).toBe(expectedTotalPrice);
    });

    it('should not update non-existent item', () => {
      const initialSubtotal = order.subtotal.amount;

      order.updateItemQuantity('non-existent-id', 5);

      expect(order.subtotal.amount).toBe(initialSubtotal);
    });

    it('should update updatedAt when updating item quantity', () => {
      const originalUpdatedAt = order.updatedAt;

      order.updateItemQuantity(order.items[0].id, 5);

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('updateStatus', () => {
    it('should update order status and add timeline event', () => {
      const newStatus: OrderStatus = 'confirmed';
      const description = 'Order confirmed by merchant';

      order.updateStatus(newStatus, description);

      expect(order.status).toBe(newStatus);
      expect(order.timeline).toHaveLength(2);
      expect(order.timeline[1].status).toBe(newStatus);
      expect(order.timeline[1].description).toBe(description);
      expect(order.timeline[1].timestamp).toBeInstanceOf(Date);
    });

    it('should use default description when not provided', () => {
      const newStatus: OrderStatus = 'shipped';

      order.updateStatus(newStatus);

      expect(order.status).toBe(newStatus);
      expect(order.timeline[1].description).toBe(`Status alterado para ${newStatus}`);
    });

    it('should update updatedAt when updating status', () => {
      const originalUpdatedAt = order.updatedAt;

      order.updateStatus('confirmed');

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('updatePayment', () => {
    it('should update payment information', () => {
      const paymentUpdate = {
        status: 'paid' as const,
        paidAt: new Date(),
        transactionId: 'tx-123',
      };

      order.updatePayment(paymentUpdate);

      expect(order.payment.status).toBe('paid');
      expect(order.payment.paidAt).toEqual(paymentUpdate.paidAt);
      expect(order.payment.transactionId).toBe('tx-123');
      expect(order.payment.method).toBe('pix'); // Should preserve existing values
    });

    it('should update updatedAt when updating payment', () => {
      const originalUpdatedAt = order.updatedAt;

      order.updatePayment({ status: 'paid' });

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('updateShipping', () => {
    it('should update existing shipping information', () => {
      const shipping = {
        address: {
          street: 'Rua Teste',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
        },
        method: 'express',
        cost: { amount: 2000, currency: 'BRL', formatted: 'R$ 20,00' },
      };

      order.updateShipping(shipping);

      expect(order.shipping).toEqual(shipping);
      expect(order.shippingCost.amount).toBe(2000);
      expect(order.total.amount).toBe(12000); // 10000 + 2000
    });

    it('should create shipping when it does not exist', () => {
      const orderWithoutShipping = new Order({
        id: 'order-456',
        merchantId: 'merchant-456',
        userId: 'user-456',
        items: [
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
        ],
        customer: {
          id: 'customer-456',
          name: 'Jane Doe',
          email: 'jane@example.com',
          walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        },
        payment: {
          method: 'pix',
          status: 'pending',
        },
        subtotal: mockMoney,
        shippingCost: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
        total: mockMoney,
      });

      const shipping = {
        address: {
          street: 'Rua Teste',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
        },
        method: 'standard',
        cost: { amount: 1500, currency: 'BRL', formatted: 'R$ 15,00' },
      };

      orderWithoutShipping.updateShipping(shipping);

      expect(orderWithoutShipping.shipping).toEqual(shipping);
      expect(orderWithoutShipping.shippingCost.amount).toBe(1500);
      expect(orderWithoutShipping.total.amount).toBe(11500); // 10000 + 1500
    });

    it('should update updatedAt when updating shipping', () => {
      const originalUpdatedAt = order.updatedAt;

      order.updateShipping({
        method: 'express',
        cost: { amount: 2000, currency: 'BRL', formatted: 'R$ 20,00' },
      });

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('addNFTToken', () => {
    it('should add NFT token to order', () => {
      const tokenId = 'nft-123';

      order.addNFTToken(tokenId);

      expect(order.nftTokens).toContain(tokenId);
      expect(order.nftTokens).toHaveLength(1);
    });

    it('should not add duplicate NFT token', () => {
      const tokenId = 'nft-123';

      order.addNFTToken(tokenId);
      order.addNFTToken(tokenId);

      expect(order.nftTokens).toHaveLength(1);
      expect(order.nftTokens).toEqual([tokenId]);
    });

    it('should update updatedAt when adding NFT token', () => {
      const originalUpdatedAt = order.updatedAt;

      order.addNFTToken('nft-123');

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('removeNFTToken', () => {
    it('should remove NFT token from order', () => {
      const tokenId = 'nft-123';
      order.addNFTToken(tokenId);

      order.removeNFTToken(tokenId);

      expect(order.nftTokens).not.toContain(tokenId);
      expect(order.nftTokens).toHaveLength(0);
    });

    it('should update updatedAt when removing NFT token', () => {
      const tokenId = 'nft-123';
      order.addNFTToken(tokenId);
      const originalUpdatedAt = order.updatedAt;

      order.removeNFTToken(tokenId);

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('updateMetadata', () => {
    it('should update order metadata', () => {
      const metadata = {
        source: 'mobile-app',
        campaign: 'summer-sale',
      };

      order.updateMetadata(metadata);

      expect(order.metadata).toEqual(metadata);
    });

    it('should merge metadata with existing values', () => {
      order.metadata = { existing: 'value' };
      const newMetadata = { new: 'value' };

      order.updateMetadata(newMetadata);

      expect(order.metadata).toEqual({
        existing: 'value',
        new: 'value',
      });
    });

    it('should update updatedAt when updating metadata', () => {
      const originalUpdatedAt = order.updatedAt;

      order.updateMetadata({ test: 'value' });

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('Status Check Methods', () => {
    it('should check if order is paid', () => {
      expect(order.isPaid()).toBe(false);

      order.updatePayment({ status: 'paid' });

      expect(order.isPaid()).toBe(true);
    });

    it('should check if order is pending', () => {
      expect(order.isPending()).toBe(true);

      order.updateStatus('confirmed');

      expect(order.isPending()).toBe(false);
    });

    it('should check if order is confirmed', () => {
      expect(order.isConfirmed()).toBe(false);

      order.updateStatus('confirmed');

      expect(order.isConfirmed()).toBe(true);
    });

    it('should check if order is cancelled', () => {
      expect(order.isCancelled()).toBe(false);

      order.updateStatus('cancelled');

      expect(order.isCancelled()).toBe(true);
    });

    it('should check if order is refunded', () => {
      expect(order.isRefunded()).toBe(false);

      order.updateStatus('refunded');

      expect(order.isRefunded()).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    it('should check if order has NFTs', () => {
      expect(order.hasNFTs()).toBe(false);

      order.addNFTToken('nft-123');

      expect(order.hasNFTs()).toBe(true);
    });

    it('should get total number of items', () => {
      expect(order.getTotalItems()).toBe(2); // quantity of first item

      order.addItem({
        id: 'item-2',
        productId: 'product-2',
        productName: 'Another Product',
        productImage: 'https://example.com/image2.jpg',
        quantity: 3,
        unitPrice: { amount: 1000, currency: 'BRL', formatted: 'R$ 10,00' },
        totalPrice: { amount: 3000, currency: 'BRL', formatted: 'R$ 30,00' },
        attributes: {},
      });

      expect(order.getTotalItems()).toBe(5); // 2 + 3
    });

    it('should get customer information', () => {
      expect(order.getCustomerName()).toBe('John Doe');
      expect(order.getCustomerEmail()).toBe('john@example.com');
      expect(order.getCustomerWallet()).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should get payment information', () => {
      expect(order.getPaymentMethod()).toBe('pix');
      expect(order.getPaymentStatus()).toBe('pending');
    });

    it('should get last timeline event', () => {
      const lastEvent = order.getLastTimelineEvent();

      expect(lastEvent).not.toBeNull();
      expect(lastEvent!.status).toBe('pending');
      expect(lastEvent!.description).toBe('Pedido criado');
    });

    it('should return null for last timeline event when timeline is empty', () => {
      order.timeline = [];

      expect(order.getLastTimelineEvent()).toBeNull();
    });
  });

  describe('Business Logic Methods', () => {
    it('should check if order can be cancelled', () => {
      expect(order.canBeCancelled()).toBe(true); // pending

      order.updateStatus('paid');
      expect(order.canBeCancelled()).toBe(true); // paid

      order.updateStatus('confirmed');
      expect(order.canBeCancelled()).toBe(true); // confirmed

      order.updateStatus('shipped');
      expect(order.canBeCancelled()).toBe(false); // shipped

      order.updateStatus('delivered');
      expect(order.canBeCancelled()).toBe(false); // delivered
    });

    it('should check if order can be refunded', () => {
      expect(order.canBeRefunded()).toBe(false); // not paid

      order.updatePayment({ status: 'paid' });
      expect(order.canBeRefunded()).toBe(true); // paid

      order.updateStatus('refunded');
      expect(order.canBeRefunded()).toBe(false); // already refunded
    });
  });

  describe('toJSON', () => {
    it('should return order as JSON object', () => {
      const json = order.toJSON();

      expect(json).toEqual({
        id: order.id,
        merchantId: order.merchantId,
        userId: order.userId,
        items: order.items,
        customer: order.customer,
        shipping: order.shipping,
        payment: order.payment,
        status: order.status,
        type: order.type,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tax: order.tax,
        total: order.total,
        timeline: order.timeline,
        nftTokens: order.nftTokens,
        metadata: order.metadata,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    });
  });

  describe('Total Recalculation', () => {
    it('should recalculate totals when items change', () => {
      // Add item
      order.addItem({
        id: 'item-2',
        productId: 'product-2',
        productName: 'Another Product',
        productImage: 'https://example.com/image2.jpg',
        quantity: 1,
        unitPrice: { amount: 3000, currency: 'BRL', formatted: 'R$ 30,00' },
        totalPrice: { amount: 3000, currency: 'BRL', formatted: 'R$ 30,00' },
        attributes: {},
      });

      expect(order.subtotal.amount).toBe(13000); // 10000 + 3000
      expect(order.total.amount).toBe(13000); // subtotal + shipping + tax

      // Remove item
      order.removeItem('item-2');

      expect(order.subtotal.amount).toBe(10000);
      expect(order.total.amount).toBe(10000);

      // Update quantity
      order.updateItemQuantity('item-1', 3);

      expect(order.subtotal.amount).toBe(15000); // 5000 * 3
      expect(order.total.amount).toBe(15000);
    });

    it('should include shipping and tax in total calculation', () => {
      order.updateShipping({
        cost: { amount: 2000, currency: 'BRL', formatted: 'R$ 20,00' },
      });

      expect(order.total.amount).toBe(12000); // 10000 + 2000

      // Add tax and recalculate
      order.tax = { amount: 1000, currency: 'BRL', formatted: 'R$ 10,00' };
      (order as any).recalculateTotals(); // Call private method for testing

      expect(order.total.amount).toBe(13000); // 10000 + 2000 + 1000
    });
  });
}); 