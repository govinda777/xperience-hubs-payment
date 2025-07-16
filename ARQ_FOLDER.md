## Xperience Hubs Payment Project Folder Structure

The folder architecture of the Xperience Hubs Payment project is designed to reflect modularity, scalability, and the centralization of logic in smart contracts. Below is an example of how the structure is typically organized, following best practices for modern Next.js projects and a use-case driven approach:

```
/xperience-hubs-payment
│
├── public/                  # Static files (images, favicon, etc.)
├── pages/                   # Dynamic routes for Next.js
│   ├── [contractAddress]/   # Dynamic hotsite for each merchant
│   │   ├── index.js         # Merchant's main page
│   │   ├── checkout.js      # Dynamic checkout
│   │   ├── products/
│   │   │   └── [productId].js # Product details
│   │   ├── conference/
│   │   │   └── [conferenceId].js # Evento presencial ou online.
│   │   ├── dashboard.js     # Admin dashboard
│   │   └── [...slug].js     # Catch-all for custom routes
│   └── api/                 # Custom APIs (if needed)
│
├── use_cases/               # Feature modules (use cases)
│   ├── checkout/
│   │   └── index.js
│   ├── onboarding/
│   │   └── index.js
│   ├── mintNFT/
│   │   └── index.js
│   └── accessValidation/
│       └── index.js
│
├── components/              # Reusable UI components
│   ├── Layout/
│   ├── ProductCard/
│   ├── NFTDisplay/
│   └── ...
│
├── hooks/                   # Custom hooks (e.g., on-chain reading)
│   ├── useContractData.js
│   ├── useNFTStatus.js
│   └── ...
│
├── services/                # Helper services (e.g., PIX, web3 integration)
│   ├── pixService.js
│   ├── web3Service.js
│   └── ...
│
├── abi/                     # Smart contract ABIs
│   ├── LojistaContract.json
│   └── ...
│
├── tests/                   # Automated tests
│   ├── use_cases/
│   ├── components/
│   └── ...
│
├── package.json
├── README.md
└── ...                      # Other configuration files
```

### Structure Highlights

- **pages/[contractAddress]/**: Dynamic routes for multiple merchants, each with their own hotsite, checkout, dashboard, and products.
- **use_cases/**: Each business flow (onboarding, checkout, NFT minting, access validation) is encapsulated in an independent module, facilitating maintenance and expansion.
- **components/**: Modular, reusable UI to ensure visual consistency and rapid development.
- **hooks/**: Custom hooks for on-chain data reading, NFT status, and smart contract integration.
- **services/**: Services for integrating with external systems, such as PIX and web3.
- **abi/**: Stores the smart contract ABIs to streamline integration and maintenance.
- **tests/**: Ready-to-use structure for automated testing, ensuring robustness and reliability.

This architecture enables rapid evolution, per-merchant customization, and seamless blockchain integration, aligning with the dynamic and elastic model proposed for Xperience Hubs Payment.
