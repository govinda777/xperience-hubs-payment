# Índice da Documentação Arquitetural

## 📋 Visão Geral

Este índice organiza toda a documentação arquitetural do **Xperience Hubs Payment** após a migração para **Clean Architecture** com **Domain-Driven Design (DDD)**.

---

## 📁 Documentos Arquiteturais

### **1. Arquitetura Principal**
- **[ARQUITETURA_CLEAN.md](./ARQUITETURA_CLEAN.md)** 📖
  - Documentação completa da nova arquitetura Clean Architecture
  - Estrutura de diretórios detalhada
  - Definição de camadas (Domain, Application, Infrastructure, Presentation)
  - Fluxos de dados centralizados no smart contract
  - Padrões arquiteturais e integrações externas
  - Configurações, testes, deployment e segurança

### **2. Estrutura de Pastas**
- **[ARQ_FOLDER.md](./ARQ_FOLDER.md)** 📂
  - Estrutura completa de diretórios da nova arquitetura
  - Organização por camadas do Clean Architecture
  - Highlights das principais funcionalidades
  - Separação clara entre domain, infrastructure e presentation

### **3. Migração Arquitetural**
- **[MIGRACAO_ARQUITETURA.md](./MIGRACAO_ARQUITETURA.md)** 🔄
  - Comparação entre arquitetura antiga (use cases) e nova (Clean Architecture)
  - Transformações principais implementadas
  - Benefícios alcançados com a migração
  - Plano de implementação por fases
  - Próximos passos da migração

### **4. Documentos de Contexto**
- **[ARQ.md](./ARQ.md)** 🏗️
  - Princípios fundamentais da centralização em smart contracts
  - Fonte única de verdade no endereço do contrato
  - Fluxo de usuário baseado no smart contract

---

## 🎯 Por Onde Começar

### **Para Desenvolvedores Novos no Projeto:**
1. **Leia primeiro**: [ARQUITETURA_CLEAN.md](./ARQUITETURA_CLEAN.md) - Visão geral completa
2. **Explore a estrutura**: [ARQ_FOLDER.md](./ARQ_FOLDER.md) - Entenda a organização
3. **Contexto histórico**: [MIGRACAO_ARQUITETURA.md](./MIGRACAO_ARQUITETURA.md) - Entenda as mudanças

### **Para Arquitetos e Tech Leads:**
1. **Revisão arquitetural**: [ARQUITETURA_CLEAN.md](./ARQUITETURA_CLEAN.md) - Valide os padrões
2. **Plano de migração**: [MIGRACAO_ARQUITETURA.md](./MIGRACAO_ARQUITETURA.md) - Avalie o roadmap
3. **Princípios base**: [ARQ.md](./ARQ.md) - Confirme os fundamentos

### **Para Product Managers:**
1. **Benefícios da migração**: [MIGRACAO_ARQUITETURA.md](./MIGRACAO_ARQUITETURA.md) - Seção "Benefícios"
2. **Visão geral**: [ARQUITETURA_CLEAN.md](./ARQUITETURA_CLEAN.md) - Entenda as capacidades
3. **Timeline**: [MIGRACAO_ARQUITETURA.md](./MIGRACAO_ARQUITETURA.md) - Seção "Plano de Migração"

---

## 🏗️ Princípios Arquiteturais

### **Clean Architecture**
- **Separação de Responsabilidades**: Cada camada tem uma função específica
- **Inversão de Dependências**: Interfaces abstraem implementações
- **Independência de Frameworks**: Domain independente de tecnologias externas
- **Testabilidade**: Cada camada pode ser testada isoladamente

### **Domain-Driven Design (DDD)**
- **Entidades Ricas**: Objetos de domínio com comportamento
- **Linguagem Ubíqua**: Terminologia consistente entre negócio e código
- **Bounded Contexts**: Separação clara de contextos de negócio
- **Aggregates**: Agrupamento consistente de entidades relacionadas

### **Blockchain-Centric**
- **Smart Contract como Fonte Única**: Toda lógica centralizada on-chain
- **Multi-tenant**: Cada lojista com seu próprio contrato
- **NFT-Gated Access**: Autenticação baseada em posse de NFT
- **Descentralização**: Independência de backends tradicionais

---

## 🔧 Stack Tecnológica

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: Zustand
- **UI Components**: Componentes customizados

### **Blockchain**
- **Network**: Ethereum (EVM Compatible)
- **RPC**: Alchemy
- **Wallet**: Privy (Embedded Wallets)
- **Contracts**: Solidity
- **Standards**: ERC-721/1155 para NFTs

### **Pagamentos**
- **PIX**: Integração nativa brasileira
- **Split**: Divisão automática de pagamentos
- **Webhooks**: Confirmação em tempo real

### **Autenticação**
- **Privy**: Wallet + Social Auth
- **Web3 Auth**: Assinatura de mensagens
- **NFT Validation**: Validação de posse on-chain

---

## 📊 Fluxos Principais

### **1. Onboarding do Lojista**
```
Cadastro → Deploy Smart Contract → Configuração PIX → Ativação Loja
```

### **2. Compra do Cliente**
```
Acesso Loja → Seleção Produto → Checkout → PIX → Confirmação → Mint NFT
```

### **3. Validação de Acesso**
```
Conectar Wallet → Assinar Mensagem → Validar NFT → Liberar Acesso
```

### **4. Gestão do Lojista**
```
Dashboard → Métricas → Gestão Produtos → Histórico Vendas
```

---

## 🧪 Estratégia de Testes

### **Testes por Camada**
- **Domain Layer**: Testes unitários de entidades e use cases
- **Infrastructure Layer**: Testes de integração com mocks
- **Presentation Layer**: Testes de componentes React
- **End-to-End**: Fluxos completos com testnet

### **Cobertura de Testes**
- **Entidades**: 100% - Lógica de negócio crítica
- **Use Cases**: 95% - Orquestração de regras
- **Services**: 90% - Integrações externas
- **Components**: 80% - Interface do usuário

---

## 🚀 Deployment

### **Ambientes**
- **Development**: Local com mocks e testnets
- **Staging**: Vercel Preview com Sepolia testnet
- **Production**: Vercel Production com Ethereum mainnet

### **Pipeline CI/CD**
```
Commit → Lint → Test → Build → Deploy → E2E Tests
```

---

## 📈 Futuro da Arquitetura

### **Próximas Melhorias**
- **Microservices**: Separação por bounded contexts
- **Event Sourcing**: Auditoria completa de eventos
- **CQRS**: Separação Command/Query
- **Layer 2**: Migração para soluções L2 (Polygon, Arbitrum)

### **Expansões Planejadas**
- **Marketplace**: Marketplace de lojistas
- **DAO**: Governança descentralizada
- **Cross-chain**: Suporte multi-blockchain
- **Mobile**: Aplicativo React Native

---

## 📞 Contato e Suporte

Para dúvidas sobre a arquitetura, consulte:

1. **Documentação Técnica**: Arquivos listados acima
2. **Code Review**: Pull requests com padrões definidos
3. **Discussões**: Issues no repositório com label `architecture`
4. **Suporte**: Time de arquitetura via canal específico

---

## 📚 Referências Externas

### **Clean Architecture**
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture in TypeScript](https://github.com/dev-mastery/comments-api)

### **Domain-Driven Design**
- [DDD Reference by Eric Evans](https://www.domainlanguage.com/ddd/reference/)
- [DDD in Practice](https://enterprisecraftsmanship.com/posts/domain-driven-design-in-practice/)

### **Blockchain Development**
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Privy Documentation](https://docs.privy.io/)

### **Next.js & React**
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Última atualização**: Dezembro 2024  
**Versão da Arquitetura**: v2.0 (Clean Architecture)  
**Status**: ✅ Documentação Completa