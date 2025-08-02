import { Money, PixTransaction } from '@/types/payment';
import { NFT } from '@/types/nft';

export type OrderStatus = 
  | 'pending'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed';

export type OrderType = 
  | 'single'
  | 'subscription'
  | 'bundle';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
  attributes: Record<string, string>;
  nftTokenId?: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  walletAddress: string;
}

export interface OrderShipping {
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  method: string;
  cost: Money;
  trackingCode?: string;
  estimatedDelivery?: Date;
}

export interface OrderPayment {
  method: 'pix' | 'credit_card' | 'debit_card' | 'crypto';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  pixTransaction?: PixTransaction;
  transactionId?: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: Money;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  description: string;
  metadata?: Record<string, any>;
}

export class Order {
  public readonly id: string;
  public readonly merchantId: string;
  public readonly userId: string;
  public items: OrderItem[];
  public customer: OrderCustomer;
  public shipping?: OrderShipping;
  public payment: OrderPayment;
  public status: OrderStatus;
  public type: OrderType;
  public subtotal: Money;
  public shippingCost: Money;
  public tax: Money;
  public total: Money;
  public timeline: OrderTimeline[];
  public nftTokens: string[];
  public metadata: Record<string, any>;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    merchantId: string;
    userId: string;
    items: OrderItem[];
    customer: OrderCustomer;
    shipping?: OrderShipping;
    payment: OrderPayment;
    status?: OrderStatus;
    type?: OrderType;
    subtotal: Money;
    shippingCost?: Money;
    tax?: Money;
    total: Money;
    timeline?: OrderTimeline[];
    nftTokens?: string[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.merchantId = params.merchantId;
    this.userId = params.userId;
    this.items = params.items;
    this.customer = params.customer;
    this.shipping = params.shipping;
    this.payment = params.payment;
    this.status = params.status || 'pending';
    this.type = params.type || 'single';
    this.subtotal = params.subtotal;
    this.shippingCost = params.shippingCost || { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' };
    this.tax = params.tax || { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' };
    this.total = params.total;
    this.timeline = params.timeline || [{
      status: 'pending',
      timestamp: new Date(),
      description: 'Pedido criado',
    }];
    this.nftTokens = params.nftTokens || [];
    this.metadata = params.metadata || {};
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  public addItem(item: OrderItem): void {
    this.items.push(item);
    this.recalculateTotals();
    this.updatedAt = new Date();
  }

  public removeItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.recalculateTotals();
    this.updatedAt = new Date();
  }

  public updateItemQuantity(itemId: string, quantity: number): void {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      item.totalPrice = {
        amount: item.unitPrice.amount * quantity,
        currency: item.unitPrice.currency,
        formatted: `R$ ${(item.unitPrice.amount * quantity).toFixed(2).replace('.', ',')}`,
      };
      this.recalculateTotals();
      this.updatedAt = new Date();
    }
  }

  public updateStatus(status: OrderStatus, description?: string): void {
    this.status = status;
    this.timeline.push({
      status,
      timestamp: new Date(),
      description: description || `Status alterado para ${status}`,
    });
    this.updatedAt = new Date();
  }

  public updatePayment(payment: Partial<OrderPayment>): void {
    this.payment = { ...this.payment, ...payment };
    this.updatedAt = new Date();
  }

  public updateShipping(shipping: Partial<OrderShipping>): void {
    if (this.shipping) {
      this.shipping = { ...this.shipping, ...shipping };
    } else {
      this.shipping = shipping as OrderShipping;
    }
    this.recalculateTotals();
    this.updatedAt = new Date();
  }

  public addNFTToken(tokenId: string): void {
    if (!this.nftTokens.includes(tokenId)) {
      this.nftTokens.push(tokenId);
      this.updatedAt = new Date();
    }
  }

  public removeNFTToken(tokenId: string): void {
    this.nftTokens = this.nftTokens.filter(token => token !== tokenId);
    this.updatedAt = new Date();
  }

  public updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.updatedAt = new Date();
  }

  private recalculateTotals(): void {
    // Recalculate subtotal
    this.subtotal = this.items.reduce((total, item) => ({
      amount: total.amount + item.totalPrice.amount,
      currency: item.totalPrice.currency,
      formatted: `R$ ${(total.amount + item.totalPrice.amount).toFixed(2).replace('.', ',')}`,
    }), { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' });

    // Recalculate total
    this.total = {
      amount: this.subtotal.amount + this.shippingCost.amount + this.tax.amount,
      currency: 'BRL',
      formatted: `R$ ${(this.subtotal.amount + this.shippingCost.amount + this.tax.amount).toFixed(2).replace('.', ',')}`,
    };
  }

  public isPaid(): boolean {
    return this.payment.status === 'paid';
  }

  public isPending(): boolean {
    return this.status === 'pending';
  }

  public isConfirmed(): boolean {
    return this.status === 'confirmed';
  }

  public isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  public isRefunded(): boolean {
    return this.status === 'refunded';
  }

  public hasNFTs(): boolean {
    return this.nftTokens.length > 0;
  }

  public getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  public getCustomerName(): string {
    return this.customer.name;
  }

  public getCustomerEmail(): string {
    return this.customer.email;
  }

  public getCustomerWallet(): string {
    return this.customer.walletAddress;
  }

  public getPaymentMethod(): string {
    return this.payment.method;
  }

  public getPaymentStatus(): string {
    return this.payment.status;
  }

  public getLastTimelineEvent(): OrderTimeline | null {
    return this.timeline.length > 0 ? this.timeline[this.timeline.length - 1] : null;
  }

  public canBeCancelled(): boolean {
    return ['pending', 'paid', 'confirmed'].includes(this.status);
  }

  public canBeRefunded(): boolean {
    return this.isPaid() && !this.isRefunded();
  }

  public toJSON(): object {
    return {
      id: this.id,
      merchantId: this.merchantId,
      userId: this.userId,
      items: this.items,
      customer: this.customer,
      shipping: this.shipping,
      payment: this.payment,
      status: this.status,
      type: this.type,
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      tax: this.tax,
      total: this.total,
      timeline: this.timeline,
      nftTokens: this.nftTokens,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 