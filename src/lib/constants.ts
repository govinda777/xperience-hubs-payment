import { Network } from '@/types/blockchain';

export const NETWORKS: Record<string, Network> = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: process.env.ALCHEMY_RPC_URL || '',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  ETHEREUM_SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: process.env.ALCHEMY_SEPOLIA_RPC_URL || '',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  POLYGON_MAINNET: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: process.env.ALCHEMY_POLYGON_RPC_URL || '',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    name: 'Mumbai',
    rpcUrl: process.env.ALCHEMY_MUMBAI_RPC_URL || '',
    explorerUrl: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

export const CONTRACTS = {
  MERCHANT_FACTORY: process.env.NEXT_PUBLIC_MERCHANT_FACTORY_ADDRESS || '',
  NFT_FACTORY: process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS || '',
  PAYMENT_SPLITTER: process.env.NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS || '',
};

export const PIX_CONFIG = {
  SPLIT_PERCENTAGE: 0.05, // 5% para plataforma
  WEBHOOK_URL: '/api/webhooks/pix',
  EXPIRATION_MINUTES: 30,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 5000,
};

export const NFT_CONFIG = {
  BASE_URI: process.env.NEXT_PUBLIC_NFT_BASE_URI || 'https://ipfs.io/ipfs/',
  METADATA_URI: process.env.NEXT_PUBLIC_NFT_METADATA_URI || 'https://ipfs.io/ipfs/',
  MAX_SUPPLY: 10000,
  ROYALTY_PERCENTAGE: 2.5, // 2.5% royalty
};

export const APP_CONFIG = {
  NAME: 'Xperience Hubs Payment',
  DESCRIPTION: 'Plataforma de pagamentos com integração blockchain e NFTs',
  VERSION: '1.0.0',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  SUPPORT_EMAIL: 'suporte@xperiencehubs.com',
  SUPPORT_PHONE: '+55 11 99999-9999',
};

export const API_ENDPOINTS = {
  PIX: {
    CREATE: '/api/pix/create',
    VALIDATE: '/api/pix/validate',
    WEBHOOK: '/api/webhooks/pix',
  },
  CONTRACTS: {
    MERCHANT: '/api/contracts/merchant',
    NFT: '/api/contracts/nft',
    PAYMENT: '/api/contracts/payment',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    WALLET: '/api/users/wallet',
    NFTS: '/api/users/nfts',
  },
  ORDERS: {
    CREATE: '/api/orders/create',
    UPDATE: '/api/orders/update',
    LIST: '/api/orders/list',
  },
};

export const ERROR_MESSAGES = {
  WALLET_CONNECTION_FAILED: 'Falha ao conectar carteira',
  PAYMENT_FAILED: 'Falha no pagamento',
  NFT_MINT_FAILED: 'Falha ao criar NFT',
  CONTRACT_ERROR: 'Erro no contrato',
  NETWORK_ERROR: 'Erro de rede',
  INSUFFICIENT_FUNDS: 'Saldo insuficiente',
  TRANSACTION_FAILED: 'Transação falhou',
  USER_NOT_FOUND: 'Usuário não encontrado',
  ORDER_NOT_FOUND: 'Pedido não encontrado',
  PRODUCT_NOT_FOUND: 'Produto não encontrado',
  MERCHANT_NOT_FOUND: 'Lojista não encontrado',
  INVALID_ADDRESS: 'Endereço inválido',
  INVALID_AMOUNT: 'Valor inválido',
  INVALID_SIGNATURE: 'Assinatura inválida',
  ACCESS_DENIED: 'Acesso negado',
  RATE_LIMIT_EXCEEDED: 'Limite de tentativas excedido',
};

export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Carteira conectada com sucesso',
  PAYMENT_SUCCESSFUL: 'Pagamento realizado com sucesso',
  NFT_MINTED: 'NFT criado com sucesso',
  ORDER_CREATED: 'Pedido criado com sucesso',
  ORDER_UPDATED: 'Pedido atualizado com sucesso',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso',
  SETTINGS_SAVED: 'Configurações salvas com sucesso',
  TRANSACTION_CONFIRMED: 'Transação confirmada',
};

export const VALIDATION_RULES = {
  PIX_KEY: {
    MIN_LENGTH: 11,
    MAX_LENGTH: 140,
    PATTERN: /^[a-zA-Z0-9@.-]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^\+?[1-9]\d{1,14}$/,
  },
  CNPJ: {
    PATTERN: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  },
  WALLET_ADDRESS: {
    PATTERN: /^0x[a-fA-F0-9]{40}$/,
  },
  PRODUCT_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PRODUCT_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  PRICE: {
    MIN: 0.01,
    MAX: 999999.99,
  },
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
};

export const CACHE = {
  TTL: {
    MERCHANT_DATA: 5 * 60 * 1000, // 5 minutes
    PRODUCT_DATA: 10 * 60 * 1000, // 10 minutes
    USER_DATA: 15 * 60 * 1000, // 15 minutes
    NFT_DATA: 30 * 60 * 1000, // 30 minutes
    CONTRACT_DATA: 60 * 60 * 1000, // 1 hour
  },
  KEYS: {
    MERCHANT: 'merchant',
    PRODUCTS: 'products',
    USER: 'user',
    NFTS: 'nfts',
    CONTRACTS: 'contracts',
  },
};

export const THEMES = {
  DEFAULT: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
  },
  DARK: {
    primaryColor: '#60a5fa',
    secondaryColor: '#94a3b8',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    fontFamily: 'Inter',
  },
  CUSTOM: {
    primaryColor: '#8b5cf6',
    secondaryColor: '#a855f7',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
  },
};

export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/xperiencehubs',
  INSTAGRAM: 'https://instagram.com/xperiencehubs',
  LINKEDIN: 'https://linkedin.com/company/xperiencehubs',
  GITHUB: 'https://github.com/xperiencehubs',
  DISCORD: 'https://discord.gg/xperiencehubs',
  TELEGRAM: 'https://t.me/xperiencehubs',
};

export const LEGAL = {
  TERMS_URL: '/terms',
  PRIVACY_URL: '/privacy',
  COOKIES_URL: '/cookies',
  SUPPORT_URL: '/support',
  FAQ_URL: '/faq',
}; 