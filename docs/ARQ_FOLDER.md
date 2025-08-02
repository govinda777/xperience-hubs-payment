## Xperience Hubs Payment Project Folder Structure (Clean Architecture)

The folder architecture of the Xperience Hubs Payment project follows **Clean Architecture** and **Domain-Driven Design (DDD)** principles, ensuring modularity, scalability, and maintainability while centralizing logic in smart contracts. The structure is organized in layers with clear separation of concerns:

```
XperienceHubsPayment/
├── src/
│   ├── app/                           # Next.js 15 App Router
│   │   ├── [contractAddress]/         # Dynamic routes per merchant
│   │   │   ├── page.tsx              # Merchant storefront
│   │   │   ├── checkout/             # Checkout flow pages
│   │   │   │   ├── page.tsx          # Checkout main
│   │   │   │   ├── success/          # Payment success
│   │   │   │   └── failure/          # Payment failure
│   │   │   ├── dashboard/            # Merchant dashboard
│   │   │   │   ├── page.tsx          # Dashboard main
│   │   │   │   ├── products/         # Product management
│   │   │   │   ├── orders/           # Order management
│   │   │   │   └── analytics/        # Analytics
│   │   │   ├── products/             # Product catalog
│   │   │   │   ├── page.tsx          # Products list
│   │   │   │   └── [productId]/      # Product details
│   │   │   └── restricted/           # NFT-gated content
│   │   │       ├── page.tsx          # Access validation
│   │   │       └── content/          # Protected content
│   │   ├── api/                      # API Routes
│   │   │   ├── webhooks/             # External webhooks
│   │   │   │   └── pix/              # PIX payment webhooks
│   │   │   ├── contracts/            # Smart contract interactions
│   │   │   │   ├── merchant/         # Merchant contract calls
│   │   │   │   ├── products/         # Product contract calls
│   │   │   │   └── nft/              # NFT contract calls
│   │   │   └── auth/                 # Authentication endpoints
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # Presentation Layer
│   │   ├── auth/                     # Authentication components
│   │   │   ├── WalletConnect.tsx     # Wallet connection
│   │   │   ├── AuthGuard.tsx         # Route protection
│   │   │   ├── NFTAuthGuard.tsx      # NFT-based protection
│   │   │   └── LoginButton.tsx       # Login/logout button
│   │   ├── cart/                     # Shopping cart
│   │   │   ├── CartButton.tsx        # Cart floating button
│   │   │   ├── CartModal.tsx         # Cart modal
│   │   │   └── CartItem.tsx          # Cart item component
│   │   ├── checkout/                 # Checkout flow
│   │   │   ├── CheckoutFlow.tsx      # Multi-step checkout
│   │   │   ├── PixPayment.tsx        # PIX payment component
│   │   │   └── OrderSummary.tsx      # Order summary
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── MerchantDashboard.tsx # Main dashboard
│   │   │   ├── SalesMetrics.tsx      # Sales analytics
│   │   │   ├── TransactionHistory.tsx# Transaction list
│   │   │   ├── ProductManager.tsx    # Product management
│   │   │   └── NFTManager.tsx        # NFT management
│   │   ├── layout/                   # Layout components
│   │   │   ├── Navigation.tsx        # Main navigation
│   │   │   ├── Header.tsx            # Page header
│   │   │   ├── Footer.tsx            # Page footer
│   │   │   └── Sidebar.tsx           # Dashboard sidebar
│   │   ├── nft/                      # NFT components
│   │   │   ├── NFTDisplay.tsx        # NFT display card
│   │   │   ├── NFTValidator.tsx      # NFT ownership validation
│   │   │   ├── NFTGallery.tsx        # User NFT gallery
│   │   │   └── AccessControl.tsx     # NFT-based access control
│   │   ├── products/                 # Product components
│   │   │   ├── ProductCatalog.tsx    # Product catalog
│   │   │   ├── ProductCard.tsx       # Product card
│   │   │   ├── ProductDetails.tsx    # Product details
│   │   │   └── ProductForm.tsx       # Product creation/edit
│   │   ├── providers/                # Context providers
│   │   │   ├── PrivyProvider.tsx     # Privy authentication
│   │   │   ├── Web3Provider.tsx      # Web3 provider
│   │   │   └── ToastProvider.tsx     # Toast notifications
│   │   └── ui/                       # UI components
│   │       ├── Button.tsx            # Button component
│   │       ├── Card.tsx              # Card component
│   │       ├── Modal.tsx             # Modal component
│   │       ├── Input.tsx             # Input component
│   │       └── Loading.tsx           # Loading component
│   │
│   ├── core/                         # Domain Layer (Clean Architecture)
│   │   ├── entities/                 # Domain entities
│   │   │   ├── Merchant.ts           # Merchant entity
│   │   │   ├── Product.ts            # Product entity
│   │   │   ├── Order.ts              # Order entity
│   │   │   ├── NFT.ts                # NFT entity
│   │   │   ├── Payment.ts            # Payment entity
│   │   │   └── User.ts               # User entity
│   │   ├── repositories/             # Repository interfaces
│   │   │   ├── IMerchantRepository.ts
│   │   │   ├── IProductRepository.ts
│   │   │   ├── IOrderRepository.ts
│   │   │   ├── INFTRepository.ts
│   │   │   └── IUserRepository.ts
│   │   ├── services/                 # Service interfaces
│   │   │   ├── ISmartContractService.ts
│   │   │   ├── IPaymentService.ts
│   │   │   ├── INFTService.ts
│   │   │   ├── IWalletService.ts
│   │   │   └── IAuthService.ts
│   │   └── use-cases/                # Business use cases
│   │       ├── auth/                 # Authentication use cases
│   │       │   ├── ConnectWallet.ts
│   │       │   ├── AuthenticateUser.ts
│   │       │   └── ValidateNFTOwnership.ts
│   │       ├── merchant/             # Merchant use cases
│   │       │   ├── GetMerchantData.ts
│   │       │   ├── UpdateMerchantProfile.ts
│   │       │   └── DeployMerchantContract.ts
│   │       ├── products/             # Product use cases
│   │       │   ├── GetProductCatalog.ts
│   │       │   ├── CreateProduct.ts
│   │       │   ├── UpdateProduct.ts
│   │       │   └── CheckProductAvailability.ts
│   │       ├── orders/               # Order use cases
│   │       │   ├── CreateOrder.ts
│   │       │   ├── ProcessPayment.ts
│   │       │   ├── ConfirmOrder.ts
│   │       │   └── GetOrderHistory.ts
│   │       ├── payments/             # Payment use cases
│   │       │   ├── GeneratePixQRCode.ts
│   │       │   ├── ValidatePixPayment.ts
│   │       │   └── ProcessPaymentSplit.ts
│   │       ├── nft/                  # NFT use cases
│   │       │   ├── MintNFT.ts
│   │       │   ├── ValidateNFTAccess.ts
│   │       │   ├── GetUserNFTs.ts
│   │       │   └── TransferNFT.ts
│   │       └── access/               # Access control use cases
│   │           ├── ValidateAccess.ts
│   │           ├── GrantAccess.ts
│   │           └── RevokeAccess.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useContract.ts            # Smart contract hooks
│   │   ├── useNFT.ts                 # NFT operation hooks
│   │   ├── useWallet.ts              # Wallet interaction hooks
│   │   ├── usePixPayment.ts          # PIX payment hooks
│   │   ├── useMerchant.ts            # Merchant data hooks
│   │   └── useProducts.ts            # Product data hooks
│   │
│   ├── infrastructure/               # Infrastructure Layer
│   │   ├── blockchain/               # Blockchain integrations
│   │   │   ├── contracts/            # Smart contract wrappers
│   │   │   │   ├── MerchantContract.ts
│   │   │   │   ├── NFTContract.ts
│   │   │   │   └── PaymentSplitter.ts
│   │   │   ├── providers/            # Web3 providers
│   │   │   │   ├── AlchemyProvider.ts
│   │   │   │   └── Web3Provider.ts
│   │   │   └── utils/                # Blockchain utilities
│   │   │       ├── contractUtils.ts
│   │   │       ├── gasUtils.ts
│   │   │       └── eventUtils.ts
│   │   ├── repositories/             # Repository implementations
│   │   │   ├── SmartContractMerchantRepository.ts
│   │   │   ├── SmartContractProductRepository.ts
│   │   │   ├── SmartContractOrderRepository.ts
│   │   │   ├── BlockchainNFTRepository.ts
│   │   │   └── PrivyUserRepository.ts
│   │   └── services/                 # Service implementations
│   │       ├── EthereumSmartContractService.ts
│   │       ├── PixPaymentService.ts
│   │       ├── ERC721NFTService.ts
│   │       ├── PrivyWalletService.ts
│   │       └── PrivyAuthService.ts
│   │
│   ├── lib/                          # Utilities and configurations
│   │   ├── constants.ts              # Project constants
│   │   ├── utils.ts                  # Utility functions
│   │   ├── web3.ts                   # Web3 configuration
│   │   ├── privy.ts                  # Privy configuration
│   │   └── abi/                      # Smart contract ABIs
│   │       ├── MerchantContract.json
│   │       ├── NFTContract.json
│   │       └── PaymentSplitter.json
│   │
│   ├── store/                        # Global state (Zustand)
│   │   ├── cartStore.ts              # Shopping cart state
│   │   ├── walletStore.ts            # Wallet connection state
│   │   ├── contractStore.ts          # Smart contract state
│   │   ├── userStore.ts              # User authentication state
│   │   └── notificationStore.ts      # Notification state
│   │
│   ├── styles/                       # Global styles
│   │   ├── globals.css               # Global CSS
│   │   └── components.css            # Component-specific styles
│   │
│   └── types/                        # TypeScript definitions
│       ├── blockchain.ts             # Blockchain types
│       ├── contract.ts               # Smart contract types
│       ├── nft.ts                    # NFT types
│       ├── payment.ts                # Payment types
│       ├── merchant.ts               # Merchant types
│       └── index.ts                  # Type exports
│
├── public/                           # Static assets
│   ├── images/                       # Image assets
│   ├── icons/                        # Icon assets
│   └── metadata/                     # NFT metadata templates
│
├── __tests__/                        # Test suites
│   ├── core/                         # Domain layer tests
│   │   ├── entities/                 # Entity tests
│   │   ├── use-cases/                # Use case tests
│   │   └── services/                 # Service interface tests
│   ├── infrastructure/               # Infrastructure tests
│   │   ├── repositories/             # Repository tests
│   │   ├── services/                 # Service implementation tests
│   │   └── blockchain/               # Blockchain integration tests
│   ├── components/                   # Component tests
│   │   ├── auth/                     # Auth component tests
│   │   ├── cart/                     # Cart component tests
│   │   ├── checkout/                 # Checkout component tests
│   │   └── nft/                      # NFT component tests
│   ├── hooks/                        # Hook tests
│   ├── mocks/                        # Test mocks
│   │   ├── smartContract.mock.ts     # Smart contract mocks
│   │   ├── privy.mock.ts             # Privy mocks
│   │   └── pix.mock.ts               # PIX payment mocks
│   └── test-utils.tsx                # Test utilities
│
├── contracts/                        # Smart contracts (Solidity)
│   ├── MerchantContract.sol          # Main merchant contract
│   ├── NFTTicket.sol                 # NFT ticket contract
│   ├── PaymentSplitter.sol           # Payment splitting contract
│   └── migrations/                   # Contract deployment scripts
│
├── docs/                             # Documentation
│   ├── ARCHITECTURE.md               # Architecture documentation
│   ├── API.md                        # API documentation
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── SMART_CONTRACTS.md            # Smart contract documentation
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── jest.config.js
└── README.md
```

### Structure Highlights

#### **Clean Architecture Layers**

- **Domain Layer (core/)**: Contains pure business logic, entities, and interfaces, completely independent of external frameworks
- **Application Layer (core/use-cases/)**: Orchestrates business flows and coordinates between domain and infrastructure
- **Infrastructure Layer (infrastructure/)**: Implements external integrations (blockchain, Privy, PIX, etc.)
- **Presentation Layer (components/)**: React components for user interface, organized by feature

#### **Key Architectural Features**

- **app/[contractAddress]/**: Dynamic Next.js 15 App Router structure for multi-tenant merchant storefronts
- **core/entities/**: Rich domain models representing Merchant, Product, Order, NFT, Payment, and User
- **core/use-cases/**: Business logic encapsulation for auth, merchant management, products, orders, payments, NFT operations, and access control
- **infrastructure/blockchain/**: Smart contract wrappers, Web3 providers, and blockchain utilities for Ethereum integration
- **infrastructure/services/**: Concrete implementations for Privy authentication, PIX payments, and NFT operations
- **hooks/**: Custom React hooks for blockchain interactions, wallet management, and smart contract data
- **store/**: Zustand state management for cart, wallet, contracts, user, and notifications
- **types/**: Comprehensive TypeScript definitions for blockchain, contracts, NFTs, payments, and merchants

#### **Blockchain-Centric Features**

- **Smart Contract Centralization**: All merchant data and business logic stored on-chain
- **NFT-Gated Access**: Authentication and authorization based on NFT ownership
- **Multi-tenant Architecture**: Each merchant operates through their own smart contract
- **Decentralized Data**: Product catalogs, orders, and payments managed via blockchain
- **Wallet Integration**: Privy-powered embedded wallets for seamless user experience

#### **Testing & Quality Assurance**

- **Comprehensive Test Coverage**: Unit tests for entities, integration tests for use cases, component tests for UI
- **Blockchain Mocking**: Smart contract and Web3 mocks for reliable testing
- **Clean Architecture Testing**: Each layer tested independently with proper dependency injection

This architecture enables **scalable multi-tenant operations**, **blockchain-native functionality**, and **maintainable clean code**, perfectly aligning with the decentralized and smart contract-centric vision of Xperience Hubs Payment.
