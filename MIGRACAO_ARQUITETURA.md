# Migração de Arquitetura: Use Cases → Clean Architecture

## Resumo das Mudanças

O projeto Xperience Hubs Payment foi reestruturado de uma **arquitetura orientada a use cases** para uma **arquitetura limpa (Clean Architecture)** com **Domain-Driven Design (DDD)**, mantendo a centralização nos smart contracts como fonte única de verdade.

---

## Comparação: Antes vs Depois

### **Arquitetura Anterior (Use Cases)**

```
/xperience-hubs-payment
├── public/
├── pages/
│   ├── [contractAddress]/
│   └── api/
├── use_cases/          # ❌ Misturava lógica de negócio com implementação
│   ├── checkout/
│   ├── onboarding/
│   ├── mintNFT/
│   └── accessValidation/
├── components/         # ❌ Componentes não organizados por domínio
├── hooks/              # ❌ Hooks sem separação clara
├── services/           # ❌ Serviços sem interfaces
├── abi/                # ❌ ABIs soltos
└── tests/              # ❌ Testes não estruturados
```

**Problemas Identificados:**
- ❌ Lógica de negócio misturada com detalhes de implementação
- ❌ Dependências não invertidas (violação do princípio DIP)
- ❌ Componentes sem organização clara por domínio
- ❌ Dificuldade de teste unitário
- ❌ Acoplamento forte entre camadas
- ❌ Falta de abstrações claras

### **Nova Arquitetura (Clean Architecture + DDD)**

```
XperienceHubsPayment/
├── src/
│   ├── app/                    # ✅ Next.js 15 App Router estruturado
│   ├── components/             # ✅ Componentes organizados por domínio
│   ├── core/                   # ✅ Domain Layer isolado
│   │   ├── entities/           # ✅ Entidades ricas de domínio
│   │   ├── repositories/       # ✅ Interfaces de repositório
│   │   ├── services/           # ✅ Interfaces de serviço
│   │   └── use-cases/          # ✅ Casos de uso puros
│   ├── infrastructure/         # ✅ Implementações isoladas
│   │   ├── blockchain/         # ✅ Integração blockchain organizada
│   │   ├── repositories/       # ✅ Implementações concretas
│   │   └── services/           # ✅ Serviços implementados
│   ├── hooks/                  # ✅ Hooks especializados
│   ├── store/                  # ✅ Estado global organizado
│   └── types/                  # ✅ Tipos TypeScript centralizados
├── contracts/                  # ✅ Smart contracts separados
└── __tests__/                  # ✅ Testes estruturados por camada
```

**Benefícios Alcançados:**
- ✅ **Separação clara de responsabilidades** por camadas
- ✅ **Inversão de dependências** via interfaces
- ✅ **Testabilidade** de cada camada independentemente
- ✅ **Manutenibilidade** com código organizado por domínio
- ✅ **Escalabilidade** para múltiplos lojistas
- ✅ **Flexibilidade** para mudanças de tecnologia

---

## Principais Transformações

### 1. **Reorganização dos Use Cases**

#### **Antes:**
```javascript
// use_cases/checkout/index.js
export const processCheckout = async (data) => {
  // Lógica misturada: validação + PIX + smart contract + NFT
  const pixQR = await pixService.generateQR(data);
  const contract = new Contract(data.contractAddress);
  const result = await contract.processPayment(data);
  await nftService.mint(result.tokenId, data.userAddress);
};
```

#### **Depois:**
```typescript
// core/use-cases/orders/CreateOrder.ts
export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private paymentService: IPaymentService,
    private nftService: INFTService
  ) {}

  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    // Lógica pura de negócio
    const order = Order.create(request);
    const payment = await this.paymentService.generatePixQR(order);
    const savedOrder = await this.orderRepository.save(order);
    
    return { orderId: savedOrder.id, pixQR: payment.qrCode };
  }
}
```

### 2. **Entidades de Domínio Ricas**

#### **Antes:**
```javascript
// Dados anêmicos espalhados pelo código
const order = {
  id: uuid(),
  items: cartItems,
  total: calculateTotal(cartItems),
  status: 'pending'
};
```

#### **Depois:**
```typescript
// core/entities/Order.ts
export class Order {
  private constructor(
    public readonly id: OrderId,
    public readonly merchantId: MerchantId,
    public readonly userId: UserId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {}

  static create(request: CreateOrderRequest): Order {
    // Validações e regras de negócio
    const orderId = OrderId.generate();
    const items = OrderItem.fromCartItems(request.cartItems);
    
    return new Order(orderId, request.merchantId, request.userId, items, OrderStatus.PENDING);
  }

  public getTotalPrice(): Money {
    return this.items.reduce((total, item) => total.add(item.getPrice()), Money.zero());
  }

  public confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidOrderStatusError('Order must be pending to confirm');
    }
    this.status = OrderStatus.CONFIRMED;
  }
}
```

### 3. **Inversão de Dependências**

#### **Antes:**
```javascript
// Dependência direta de implementação
import { PixService } from '../services/pixService';
import { Web3Service } from '../services/web3Service';

export const processPayment = async (data) => {
  const pixService = new PixService(); // ❌ Acoplamento forte
  const web3Service = new Web3Service(); // ❌ Acoplamento forte
  // ...
};
```

#### **Depois:**
```typescript
// core/use-cases/payments/ProcessPaymentUseCase.ts
export class ProcessPaymentUseCase {
  constructor(
    private paymentService: IPaymentService,     // ✅ Interface
    private smartContractService: ISmartContractService // ✅ Interface
  ) {}

  async execute(request: ProcessPaymentRequest): Promise<void> {
    const payment = await this.paymentService.validatePixPayment(request.pixId);
    await this.smartContractService.confirmOrder(request.orderId);
  }
}

// infrastructure/services/PixPaymentService.ts
export class PixPaymentService implements IPaymentService {
  // Implementação concreta
}
```

### 4. **Organização de Componentes**

#### **Antes:**
```javascript
// components/ProductCard.js - Componente genérico
// components/NFTDisplay.js - Componente genérico
// components/CheckoutForm.js - Componente genérico
```

#### **Depois:**
```typescript
// components/products/ProductCard.tsx - Organizado por domínio
// components/nft/NFTDisplay.tsx - Organizado por domínio  
// components/checkout/CheckoutFlow.tsx - Organizado por domínio
// components/auth/NFTAuthGuard.tsx - Funcionalidade específica
```

### 5. **Estado Global Estruturado**

#### **Antes:**
```javascript
// Estado espalhado em vários locais
// Context API misturado com lógica de negócio
```

#### **Depois:**
```typescript
// store/cartStore.ts
interface CartStore {
  items: CartItem[];
  merchantAddress: string;
  
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  getTotalPrice: () => number;
}

// store/walletStore.ts  
interface WalletStore {
  address: string | null;
  isConnected: boolean;
  nfts: NFT[];
  
  connect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}
```

---

## Benefícios da Nova Arquitetura

### **1. Testabilidade**

#### **Antes:**
```javascript
// Difícil de testar - dependências hardcoded
test('should process checkout', async () => {
  // Como mockar as dependências internas?
  const result = await processCheckout(data);
  expect(result).toBeDefined();
});
```

#### **Depois:**
```typescript
// Fácil de testar - dependências injetadas
describe('CreateOrderUseCase', () => {
  it('should create order successfully', async () => {
    const mockOrderRepo = mock<IOrderRepository>();
    const mockPaymentService = mock<IPaymentService>();
    
    const useCase = new CreateOrderUseCase(mockOrderRepo, mockPaymentService);
    const result = await useCase.execute(request);
    
    expect(result.orderId).toBeDefined();
    expect(mockOrderRepo.save).toHaveBeenCalled();
  });
});
```

### **2. Manutenibilidade**

- **Separação clara**: Cada camada tem uma responsabilidade específica
- **Baixo acoplamento**: Mudanças em uma camada não afetam outras
- **Alta coesão**: Código relacionado está agrupado logicamente

### **3. Flexibilidade**

- **Troca de implementações**: Fácil trocar Privy por outra wallet, ou PIX por outro pagamento
- **Extensibilidade**: Adicionar novos use cases sem impactar código existente
- **Configurabilidade**: Diferentes configurações para diferentes ambientes

### **4. Escalabilidade**

- **Multi-tenant**: Cada lojista com seu contrato isolado
- **Performance**: Estado otimizado e hooks especializados
- **Deployment**: Estrutura preparada para micro-frontends se necessário

---

## Plano de Migração

### **Fase 1: Estrutura Base** ✅ 
- [x] Criar nova estrutura de pastas
- [x] Definir entidades de domínio
- [x] Criar interfaces de repositórios e serviços
- [x] Documentar nova arquitetura

### **Fase 2: Core Domain**
- [ ] Implementar entidades (Merchant, Product, Order, NFT, Payment, User)
- [ ] Criar use cases principais
- [ ] Implementar interfaces de repositório
- [ ] Implementar interfaces de serviço

### **Fase 3: Infrastructure**
- [ ] Migrar integrações blockchain para nova estrutura
- [ ] Implementar repositórios concretos
- [ ] Implementar serviços concretos (Privy, PIX, NFT)
- [ ] Configurar providers Web3

### **Fase 4: Presentation**
- [ ] Migrar componentes para nova organização
- [ ] Implementar hooks especializados
- [ ] Configurar estado global (Zustand)
- [ ] Migrar páginas Next.js para App Router

### **Fase 5: Testing & Quality**
- [ ] Implementar testes unitários para entidades
- [ ] Implementar testes de integração para use cases
- [ ] Implementar testes de componentes
- [ ] Configurar mocks para blockchain

### **Fase 6: Migration & Deployment**
- [ ] Migração gradual do código existente
- [ ] Testes end-to-end
- [ ] Deploy em ambiente de teste
- [ ] Deploy em produção

---

## Próximos Passos

1. **Revisar e aprovar** a nova estrutura arquitetural
2. **Começar implementação** pelas entidades de domínio
3. **Migrar use cases** mais críticos primeiro (checkout, NFT)
4. **Implementar testes** em paralelo com desenvolvimento
5. **Fazer deploy incremental** mantendo backward compatibility

---

## Conclusão

A migração para Clean Architecture com DDD trará benefícios significativos:

- **Maior qualidade de código** com separação clara de responsabilidades
- **Facilidade de teste** com dependências invertidas
- **Manutenibilidade aprimorada** com código organizado por domínio
- **Flexibilidade para evolução** da plataforma
- **Escalabilidade** para suportar múltiplos lojistas e novas funcionalidades

A estrutura mantém a **centralização nos smart contracts** como fonte única de verdade, mas organiza o código de forma mais profissional e sustentável para o crescimento da plataforma.