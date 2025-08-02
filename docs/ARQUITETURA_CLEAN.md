# Arquitetura do Xperience Hubs Payment

## Visão Geral

O **Xperience Hubs Payment** é uma aplicação web full-stack desenvolvida em **Next.js 15** que permite a criação de lojas online personalizadas com integração blockchain. A aplicação utiliza uma arquitetura em camadas baseada em **Clean Architecture** e **Domain-Driven Design (DDD)**, centralizando toda a lógica nos smart contracts dos lojistas.

### Tecnologias Principais

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: Zustand
- **Autenticação**: Privy (Wallet + Social)
- **Blockchain**: Ethereum (EVM Compatible)
- **Pagamentos**: PIX + Smart Contracts
- **NFTs**: ERC-721/1155
- **RPC**: Alchemy
- **Testes**: Jest + React Testing Library
- **Deployment**: Vercel

---

## Estrutura de Diretórios

```
XperienceHubsPayment/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── [contractAddress]/         # Dynamic routes per merchant
│   │   │   ├── page.tsx              # Merchant storefront
│   │   │   ├── checkout/             # Checkout pages
│   │   │   ├── dashboard/            # Merchant dashboard
│   │   │   ├── products/             # Product pages
│   │   │   └── restricted/           # NFT-gated content
│   │   ├── api/                      # API Routes
│   │   │   ├── webhooks/             # PIX webhooks
│   │   │   ├── contracts/            # Smart contract interactions
│   │   │   └── nft/                  # NFT operations
│   │   ├── layout.tsx                # Layout raiz
│   │   └── page.tsx                  # Landing page
│   ├── components/                   # Componentes React
│   │   ├── auth/                     # Autenticação e wallet
│   │   ├── cart/                     # Carrinho de compras
│   │   ├── checkout/                 # Fluxo de checkout
│   │   ├── dashboard/                # Dashboard components
│   │   ├── layout/                   # Layout components
│   │   ├── nft/                      # NFT displays e validação
│   │   ├── products/                 # Catálogo de produtos
│   │   ├── providers/                # Context providers
│   │   └── ui/                       # Componentes de UI
│   ├── core/                         # Domain Layer (Clean Architecture)
│   │   ├── entities/                 # Entidades de domínio
│   │   │   ├── Merchant.ts           # Lojista
│   │   │   ├── Product.ts            # Produto
│   │   │   ├── Order.ts              # Pedido
│   │   │   ├── NFT.ts                # NFT
│   │   │   ├── Payment.ts            # Pagamento
│   │   │   └── User.ts               # Usuário
│   │   ├── repositories/             # Interfaces de repositórios
│   │   │   ├── IMerchantRepository.ts
│   │   │   ├── IProductRepository.ts
│   │   │   ├── IOrderRepository.ts
│   │   │   ├── INFTRepository.ts
│   │   │   └── IUserRepository.ts
│   │   ├── services/                 # Interfaces de serviços
│   │   │   ├── ISmartContractService.ts
│   │   │   ├── IPaymentService.ts
│   │   │   ├── INFTService.ts
│   │   │   ├── IWalletService.ts
│   │   │   └── IAuthService.ts
│   │   └── use-cases/                # Casos de uso
│   │       ├── auth/                 # Autenticação
│   │       ├── merchant/             # Gestão lojista
│   │       ├── products/             # Gestão produtos
│   │       ├── orders/               # Gestão pedidos
│   │       ├── payments/             # Processamento pagamentos
│   │       ├── nft/                  # Operações NFT
│   │       └── access/               # Validação acesso
│   ├── hooks/                        # Custom hooks
│   │   ├── useContract.ts            # Hooks para smart contracts
│   │   ├── useNFT.ts                 # Hooks para NFTs
│   │   ├── useWallet.ts              # Hooks para wallet
│   │   └── usePixPayment.ts          # Hooks para PIX
│   ├── infrastructure/               # Infrastructure Layer
│   │   ├── blockchain/               # Blockchain integrations
│   │   │   ├── contracts/            # Smart contract wrappers
│   │   │   ├── providers/            # Web3 providers
│   │   │   └── utils/                # Blockchain utilities
│   │   ├── repositories/             # Implementações de repositórios
│   │   │   ├── SmartContractMerchantRepository.ts
│   │   │   ├── SmartContractProductRepository.ts
│   │   │   ├── SmartContractOrderRepository.ts
│   │   │   ├── BlockchainNFTRepository.ts
│   │   │   └── PrivyUserRepository.ts
│   │   └── services/                 # Implementações de serviços
│   │       ├── EthereumSmartContractService.ts
│   │       ├── PixPaymentService.ts
│   │       ├── ERC721NFTService.ts
│   │       ├── PrivyWalletService.ts
│   │       └── PrivyAuthService.ts
│   ├── lib/                          # Utilities e configurações
│   │   ├── constants.ts              # Constantes do projeto
│   │   ├── utils.ts                  # Funções utilitárias
│   │   ├── web3.ts                   # Configuração Web3
│   │   ├── privy.ts                  # Configuração Privy
│   │   └── abi/                      # Smart contract ABIs
│   ├── store/                        # Estado global (Zustand)
│   │   ├── cartStore.ts              # Carrinho de compras
│   │   ├── walletStore.ts            # Estado da wallet
│   │   ├── contractStore.ts          # Estado dos contratos
│   │   └── userStore.ts              # Estado do usuário
│   ├── styles/                       # Estilos globais
│   └── types/                        # Definições de tipos
│       ├── blockchain.ts             # Tipos blockchain
│       ├── contract.ts               # Tipos smart contract
│       ├── nft.ts                    # Tipos NFT
│       └── payment.ts                # Tipos pagamento
├── public/                           # Assets estáticos
├── __tests__/                        # Testes de unidade e integração
│   ├── core/                         # Testes do domínio
│   ├── infrastructure/               # Testes da infraestrutura
│   └── components/                   # Testes dos componentes
├── contracts/                        # Smart contracts (Solidity)
│   ├── MerchantContract.sol          # Contrato do lojista
│   ├── NFTTicket.sol                 # Contrato de NFT
│   └── PaymentSplitter.sol           # Divisão de pagamentos
└── jest.config.js                    # Configuração Jest
```

---

## Arquitetura em Camadas

### 1. **Presentation Layer** (Interface do Usuário)

#### **App Router (src/app/)**

##### **Dynamic Routes por Merchant**

- **[contractAddress]/page.tsx**: Hotsite personalizado do lojista
- **[contractAddress]/checkout/**: Páginas de checkout (carrinho, pagamento, confirmação)
- **[contractAddress]/dashboard/**: Dashboard administrativo do lojista
- **[contractAddress]/products/[productId]**: Páginas de produtos específicos
- **[contractAddress]/restricted/**: Conteúdo restrito (validação NFT)

##### **API Routes**

- **api/webhooks/pix**: Webhook para confirmação de pagamentos PIX
- **api/contracts/**: Interações com smart contracts
- **api/nft/**: Operações de mint e validação de NFTs

#### **Components (src/components/)**

##### **Auth Components**

- `WalletConnect`: Conexão com carteiras
- `AuthGuard`: Proteção de rotas
- `NFTAuthGuard`: Proteção baseada em posse de NFT
- `LoginButton`: Botão de login/logout

##### **Cart Components**

- `CartButton`: Botão flutuante do carrinho
- `CartModal`: Modal com itens do carrinho
- `CheckoutFlow`: Fluxo completo de checkout (multi-step)
- `PixPayment`: Componente de pagamento PIX

##### **Dashboard Components**

- `MerchantDashboard`: Dashboard principal do lojista
- `SalesMetrics`: Métricas de vendas
- `TransactionHistory`: Histórico de transações
- `ProductManager`: Gestão de produtos
- `NFTManager`: Gestão de NFTs emitidas

##### **NFT Components**

- `NFTDisplay`: Exibição de NFTs
- `NFTValidator`: Validação de posse de NFT
- `NFTGallery`: Galeria de NFTs do usuário
- `AccessControl`: Controle de acesso baseado em NFT

##### **Product Components**

- `ProductCatalog`: Catálogo de produtos (leitura do contrato)
- `ProductCard`: Card individual de produto
- `ProductDetails`: Detalhes do produto

### 2. **Application Layer** (Casos de Uso)

#### **Use Cases (src/core/use-cases/)**

##### **Auth**

- `ConnectWallet`: Conectar carteira do usuário
- `AuthenticateUser`: Autenticar usuário via Privy
- `ValidateNFTOwnership`: Validar posse de NFT para acesso

##### **Merchant**

- `GetMerchantData`: Buscar dados do lojista do smart contract
- `UpdateMerchantProfile`: Atualizar perfil do lojista
- `DeployMerchantContract`: Deploy inicial do contrato

##### **Products**

- `GetProductCatalog`: Buscar catálogo de produtos do contrato
- `CreateProduct`: Criar novo produto no contrato
- `UpdateProduct`: Atualizar produto existente
- `CheckProductAvailability`: Verificar disponibilidade

##### **Orders**

- `CreateOrder`: Criar pedido com PIX
- `ProcessPayment`: Processar pagamento PIX
- `ConfirmOrder`: Confirmar pedido após pagamento
- `GetOrderHistory`: Histórico de pedidos

##### **Payments**

- `GeneratePixQRCode`: Gerar QR Code PIX com split
- `ValidatePixPayment`: Validar pagamento PIX
- `ProcessPaymentSplit`: Processar divisão de pagamento

##### **NFT**

- `MintNFT`: Emitir NFT após pagamento confirmado
- `ValidateNFTAccess`: Validar acesso baseado em NFT
- `GetUserNFTs`: Buscar NFTs do usuário
- `TransferNFT`: Transferir NFT

### 3. **Domain Layer** (Regras de Negócio)

#### **Entities (src/core/entities/)**

##### **Merchant**

```typescript
interface Merchant {
  id: string;
  contractAddress: string;
  name: string;
  cnpj: string;
  pixKey: string;
  description: string;
  logo?: string;
  theme: MerchantTheme;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

##### **Product**

```typescript
interface Product {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  price: Money;
  category: ProductCategory;
  images: string[];
  attributes: ProductAttribute[];
  availability: ProductAvailability;
  nftConfig: NFTConfiguration;
  isActive: boolean;
}
```

##### **Order**

```typescript
interface Order {
  id: string;
  merchantId: string;
  userId: string;
  items: OrderItem[];
  total: Money;
  status: OrderStatus;
  paymentData: PaymentData;
  nftTokens: string[];
  pixTransaction?: PixTransaction;
  createdAt: Date;
  confirmedAt?: Date;
}
```

##### **NFT**

```typescript
interface NFT {
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  orderId: string;
  productId: string;
  mintedAt: Date;
  accessRules: AccessRule[];
}
```

##### **User**

```typescript
interface User {
  id: string;
  privyId: string;
  walletAddress: string;
  email?: string;
  name?: string;
  avatar?: string;
  nfts: NFT[];
  orders: Order[];
  createdAt: Date;
}
```

#### **Repository Interfaces (src/core/repositories/)**

- `IMerchantRepository`: Interface para operações de lojista
- `IProductRepository`: Interface para operações de produtos
- `IOrderRepository`: Interface para operações de pedidos
- `INFTRepository`: Interface para operações de NFT
- `IUserRepository`: Interface para operações de usuário

#### **Service Interfaces (src/core/services/)**

- `ISmartContractService`: Interface para interação com smart contracts
- `IPaymentService`: Interface para pagamentos PIX
- `INFTService`: Interface para operações NFT
- `IWalletService`: Interface para operações de carteira
- `IAuthService`: Interface para autenticação

### 4. **Infrastructure Layer** (Implementações)

#### **Blockchain (src/infrastructure/blockchain/)**

##### **Contracts**

- `MerchantContract`: Wrapper para contrato do lojista
- `NFTContract`: Wrapper para contrato de NFT
- `PaymentSplitter`: Wrapper para divisão de pagamentos

##### **Providers**

- `AlchemyProvider`: Provider Alchemy para Ethereum
- `Web3Provider`: Provider Web3 genérico

#### **Repositories (src/infrastructure/repositories/)**

- `SmartContractMerchantRepository`: Leitura de dados do contrato
- `SmartContractProductRepository`: Produtos do contrato
- `SmartContractOrderRepository`: Pedidos on-chain
- `BlockchainNFTRepository`: NFTs na blockchain
- `PrivyUserRepository`: Usuários via Privy

#### **Services (src/infrastructure/services/)**

- `EthereumSmartContractService`: Implementação Ethereum
- `PixPaymentService`: Integração PIX
- `ERC721NFTService`: Implementação NFT ERC-721
- `PrivyWalletService`: Implementação Privy
- `PrivyAuthService`: Autenticação Privy

---

## Estado da Aplicação

### **Zustand Store (src/store/)**

#### **CartStore (useCartStore)**

```typescript
interface CartStore {
  items: CartItem[];
  merchantAddress: string;
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setMerchant: (address: string) => void;
  
  // Computed
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
```

#### **WalletStore (useWalletStore)**

```typescript
interface WalletStore {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: any;
  nfts: NFT[];

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshNFTs: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}
```

#### **ContractStore (useContractStore)**

```typescript
interface ContractStore {
  currentMerchant: Merchant | null;
  products: Product[];
  isLoading: boolean;

  // Actions
  loadMerchant: (contractAddress: string) => Promise<void>;
  loadProducts: (contractAddress: string) => Promise<void>;
  refreshData: () => Promise<void>;
}
```

---

## Fluxo de Dados Centralizado no Smart Contract

### **1. Carregamento do Hotsite**

```
URL /[contractAddress]
  → ContractStore.loadMerchant()
  → SmartContractMerchantRepository
  → Merchant Smart Contract
  → UI Rendering
```

### **2. Catálogo de Produtos**

```
ProductCatalog Component
  → ContractStore.loadProducts()
  → SmartContractProductRepository
  → Merchant Smart Contract
  → Product List Rendering
```

### **3. Fluxo de Compra**

```
Add to Cart
  → CartStore.addItem()
  → CheckoutFlow
  → CreateOrder Use Case
  → PixPaymentService
  → PIX QR Code Generation
  → Payment Confirmation (Webhook)
  → MintNFT Use Case
  → Smart Contract NFT Mint
  → NFT Transfer to User
```

### **4. Validação de Acesso NFT**

```
Restricted Area Access
  → NFTAuthGuard
  → ValidateNFTOwnership Use Case
  → WalletStore.signMessage()
  → Smart Contract NFT Query
  → Access Granted/Denied
```

---

## Integrações Externas

### **1. Privy (Autenticação + Wallet)**

- **Configuração**: `src/lib/privy.ts`
- **Service**: `src/infrastructure/services/PrivyAuthService.ts`
- **Features**: Wallet embutida, autenticação social, assinatura

### **2. PIX (Pagamentos)**

- **Service**: `src/infrastructure/services/PixPaymentService.ts`
- **Webhook**: `src/app/api/webhooks/pix/route.ts`
- **Features**: QR Code, split de pagamento, confirmação

### **3. Alchemy (Blockchain RPC)**

- **Provider**: `src/infrastructure/blockchain/providers/AlchemyProvider.ts`
- **Configuração**: `src/lib/web3.ts`
- **Features**: RPC calls, event listening, gas estimation

### **4. Smart Contracts (Ethereum)**

- **Contratos**: `contracts/`
- **ABIs**: `src/lib/abi/`
- **Wrappers**: `src/infrastructure/blockchain/contracts/`

---

## Configuração e Constantes

### **Constants (src/lib/constants.ts)**

```typescript
export const NETWORKS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: process.env.ALCHEMY_RPC_URL,
  },
  ETHEREUM_SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: process.env.ALCHEMY_SEPOLIA_RPC_URL,
  },
};

export const CONTRACTS = {
  MERCHANT_FACTORY: '0x...',
  NFT_FACTORY: '0x...',
};

export const PIX_CONFIG = {
  SPLIT_PERCENTAGE: 0.05, // 5% para plataforma
  WEBHOOK_URL: '/api/webhooks/pix',
};
```

---

## Padrões Arquiteturais

### **1. Smart Contract como Fonte Única de Verdade**

- **Centralização**: Todos os dados críticos no smart contract
- **Imutabilidade**: Histórico de transações auditável
- **Descentralização**: Independência de backend tradicional

### **2. Clean Architecture Adaptada para Blockchain**

- **Domain Layer**: Entidades representam conceitos blockchain
- **Use Cases**: Orquestram interações on-chain e off-chain
- **Infrastructure**: Implementações específicas de blockchain

### **3. Multi-tenant por Smart Contract**

- **Isolamento**: Cada lojista tem seu contrato
- **Escalabilidade**: Suporte ilimitado de lojistas
- **Customização**: Configurações por contrato

### **4. NFT-Gated Access Control**

- **Autenticação**: Baseada em posse de NFT
- **Autorização**: Regras definidas no smart contract
- **Validação**: Assinatura criptográfica

---

## Performance e Otimizações

### **1. Blockchain Optimizations**

- **Batch Calls**: Múltiplas leituras em uma chamada
- **Event Listening**: Atualizações em tempo real
- **Caching**: Cache de dados do contrato
- **Gas Optimization**: Contratos otimizados

### **2. Frontend Optimizations**

- **SSR**: Server-side rendering para SEO
- **Code Splitting**: Bundle splitting por rota
- **Image Optimization**: next/image para NFTs
- **Progressive Loading**: Carregamento progressivo

### **3. State Management**

- **Zustand**: Estado mínimo e performático
- **Persistence**: LocalStorage para carrinho
- **Sync**: Sincronização com blockchain

---

## Testes

### **Estrutura de Testes**

```
src/
├── __tests__/
│   ├── test-utils.tsx              # Utilities de teste
│   ├── mocks/                      # Mocks de serviços
│   │   ├── smartContract.mock.ts   # Mock smart contract
│   │   ├── privy.mock.ts           # Mock Privy
│   │   └── pix.mock.ts             # Mock PIX
│   ├── core/                       # Testes do domínio
│   │   ├── entities/               # Testes de entidades
│   │   └── use-cases/              # Testes de casos de uso
│   ├── infrastructure/             # Testes da infraestrutura
│   │   ├── services/               # Testes de serviços
│   │   └── repositories/           # Testes de repositórios
│   └── components/                 # Testes de componentes
│       ├── auth/                   # Testes de autenticação
│       ├── cart/                   # Testes de carrinho
│       ├── checkout/               # Testes de checkout
│       └── nft/                    # Testes de NFT
```

### **Estratégias de Teste**

- **Unit Tests**: Entidades e casos de uso isolados
- **Integration Tests**: Fluxos completos com mocks
- **E2E Tests**: Testes end-to-end com testnet
- **Contract Tests**: Testes de smart contracts

---

## Deployment e DevOps

### **Environment Variables**

```bash
# Blockchain
NEXT_PUBLIC_NETWORK=sepolia
ALCHEMY_RPC_URL=
ALCHEMY_SEPOLIA_RPC_URL=
PRIVATE_KEY= # Para deploy de contratos

# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# PIX
PIX_API_URL=
PIX_API_KEY=
PIX_WEBHOOK_SECRET=

# App URLs
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUCCESS_URL=
NEXT_PUBLIC_FAILURE_URL=
```

### **Build Process**

1. **Contract Compilation**: Solidity → ABI + Bytecode
2. **Type Generation**: ABI → TypeScript types
3. **Type Checking**: TypeScript compilation
4. **Testing**: Jest test execution
5. **Build**: Next.js production build
6. **Deploy**: Vercel deployment

---

## Segurança

### **1. Smart Contract Security**

- **Auditing**: Contratos auditados
- **Access Control**: Roles e permissions
- **Reentrancy Protection**: Guards contra ataques
- **Gas Limit Protection**: Limitação de gas

### **2. Authentication Security**

- **Wallet-based Auth**: Autenticação criptográfica
- **Message Signing**: Challenges únicos
- **Session Management**: Tokens seguros
- **CSRF Protection**: Proteção automática

### **3. Payment Security**

- **PIX Validation**: Validação de webhooks
- **Split Verification**: Verificação de divisão
- **Amount Validation**: Validação de valores
- **Replay Protection**: Prevenção de replay

---

## Futuras Melhorias

### **1. Features Planejadas**

- **Marketplace**: Marketplace de lojistas
- **Staking**: Staking de tokens da plataforma
- **DAO**: Governança descentralizada
- **Layer 2**: Migração para L2 (Polygon, Arbitrum)

### **2. Otimizações Técnicas**

- **IPFS**: Armazenamento descentralizado
- **The Graph**: Indexação de eventos
- **Gasless Transactions**: Meta-transactions
- **Cross-chain**: Suporte multi-chain

### **3. Escalabilidade**

- **Microservices**: Separação de domínios
- **Event Sourcing**: Auditoria de eventos
- **CQRS**: Separação Command/Query
- **Sharding**: Sharding de dados

---

## Conclusão

A arquitetura do Xperience Hubs Payment foi redesenhada para seguir os princípios de **Clean Architecture** e **DDD**, mantendo a **centralização nos smart contracts** como fonte única de verdade. 

Esta estrutura oferece:

- **Modularidade**: Camadas bem definidas e independentes
- **Testabilidade**: Testes abrangentes em todas as camadas  
- **Escalabilidade**: Suporte ilimitado de lojistas via contratos
- **Segurança**: Autenticação blockchain e validação NFT
- **Flexibilidade**: Fácil extensão e manutenção

A combinação de tecnologias Web3 (smart contracts, NFTs, wallets) com arquitetura moderna (Clean Architecture, DDD, Next.js) cria uma base sólida para o crescimento e evolução da plataforma.