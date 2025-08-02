# Xperience Hubs Payment

Uma plataforma completa de pagamentos com integração blockchain e NFTs, construída com Next.js 15, TypeScript e Clean Architecture.

## 🚀 Funcionalidades

- **Loja Online Instantânea**: Crie sua loja personalizada em minutos
- **Pagamento PIX com Split**: QR Code único com divisão automática
- **NFTs como Ingressos**: Emissão automática de NFTs como comprovantes
- **Autenticação Web3**: Login com carteiras digitais e social
- **Dashboard Analítico**: Métricas e relatórios em tempo real
- **API Completa**: Integração via REST API e webhooks

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: Zustand
- **Autenticação**: Privy
- **Blockchain**: Ethereum, Web3.js, Ethers.js
- **Pagamentos**: PIX com split automático
- **NFTs**: ERC-721/1155
- **Testes**: Jest, React Testing Library

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── [contractAddress]/  # Rotas dinâmicas por merchant
│   ├── api/               # API Routes
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── auth/             # Autenticação e wallet
│   ├── cart/             # Carrinho de compras
│   ├── checkout/         # Fluxo de checkout
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── nft/              # NFT displays
│   ├── products/         # Catálogo de produtos
│   ├── providers/        # Context providers
│   └── ui/               # Componentes de UI
├── core/                 # Domain Layer (Clean Architecture)
│   ├── entities/         # Entidades de domínio
│   ├── repositories/     # Interfaces de repositórios
│   ├── services/         # Interfaces de serviços
│   └── use-cases/        # Casos de uso
├── infrastructure/       # Infrastructure Layer
│   ├── blockchain/       # Integrações blockchain
│   ├── repositories/     # Implementações de repositórios
│   └── services/         # Implementações de serviços
├── lib/                  # Utilities e configurações
├── store/                # Estado global (Zustand)
├── styles/               # Estilos globais
└── types/                # Definições de tipos
```

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

- **Presentation Layer**: Componentes React e páginas Next.js
- **Application Layer**: Casos de uso que orquestram a lógica de negócio
- **Domain Layer**: Entidades e regras de negócio centrais
- **Infrastructure Layer**: Implementações concretas (blockchain, APIs, etc.)

### Smart Contract como Fonte Única de Verdade

Toda a lógica crítica é centralizada nos smart contracts dos lojistas:
- Dados do lojista
- Catálogo de produtos
- Histórico de vendas
- NFTs emitidas
- Permissões de acesso

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Yarn ou npm
- Conta no Privy (para autenticação)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/govinda777/xperience-hubs-payment.git
cd xperience-hubs-payment
```

2. Instale as dependências:
```bash
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
# Blockchain
NEXT_PUBLIC_NETWORK=sepolia
ALCHEMY_RPC_URL=your_alchemy_rpc_url
ALCHEMY_SEPOLIA_RPC_URL=your_alchemy_sepolia_rpc_url

# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# PIX
PIX_API_URL=your_pix_api_url
PIX_API_KEY=your_pix_api_key
PIX_WEBHOOK_SECRET=your_pix_webhook_secret

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Execute o projeto:
```bash
yarn dev
```

5. Acesse http://localhost:3000

## 📋 Scripts Disponíveis

- `yarn dev` - Executa o servidor de desenvolvimento
- `yarn build` - Gera a build de produção
- `yarn start` - Executa o servidor de produção
- `yarn lint` - Executa o linter
- `yarn test` - Executa os testes
- `yarn test:watch` - Executa os testes em modo watch
- `yarn test:coverage` - Executa os testes com cobertura

## 🔧 Configuração

### Tailwind CSS

O projeto usa Tailwind CSS com configuração customizada em `tailwind.config.js`.

### TypeScript

Configuração TypeScript com paths aliases para melhor organização:
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`

### Jest

Configuração de testes com:
- React Testing Library
- Jest DOM
- Mocks para Web3 e Privy

## 🧪 Testes

```bash
# Executar todos os testes
yarn test

# Executar testes em modo watch
yarn test:watch

# Executar testes com cobertura
yarn test:coverage
```

## 📦 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: [docs.xperiencehubs.com](https://docs.xperiencehubs.com)
- **Issues**: [GitHub Issues](https://github.com/govinda777/xperience-hubs-payment/issues)
- **Discord**: [Comunidade Discord](https://discord.gg/xperiencehubs)
- **Email**: suporte@xperiencehubs.com

## 🗺️ Roadmap

- [ ] Marketplace de lojistas
- [ ] Staking de tokens da plataforma
- [ ] DAO para governança
- [ ] Suporte a Layer 2 (Polygon, Arbitrum)
- [ ] Integração com IPFS
- [ ] Cross-chain bridges
- [ ] Mobile app nativo

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Privy](https://privy.io/) - Autenticação Web3
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Ethers.js](https://ethers.org/) - Biblioteca Ethereum
- [Zustand](https://zustand-demo.pmnd.rs/) - Gerenciamento de estado

---

Desenvolvido com ❤️ pela equipe Xperience Hubs
