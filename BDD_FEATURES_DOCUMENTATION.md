# Documentação dos Testes BDD - Xperience Hubs Payment

## Visão Geral

Este documento descreve a implementação completa de testes **Behavior-Driven Development (BDD)** no projeto Xperience Hubs Payment, seguindo os princípios de Clean Architecture e Domain-Driven Design.

## Estrutura dos Testes BDD

### 1. Arquivos de Feature (.feature)

Os arquivos de feature definem os cenários de negócio em linguagem natural:

#### **Features Implementadas:**

- **`features/complete-purchase-flow.feature`** - Fluxo completo de compra com NFT
- **`features/auth/login.feature`** - Autenticação de usuário
- **`features/cart/cart-management.feature`** - Gerenciamento do carrinho
- **`features/payment/process-payment.feature`** - Processamento de pagamentos
- **`features/nft/nft-validation.feature`** - Validação de NFTs para acesso
- **`features/merchant/merchant-management.feature`** - Gestão de merchants
- **`features/products/product-catalog.feature`** - Catálogo de produtos

### 2. Testes BDD por Camada

#### **Domain Layer (Use Cases)**

- **`src/core/use-cases/__tests__/CreateOrderUseCase.test.ts`** - Criação de pedidos
- **`src/core/use-cases/__tests__/MintNFTUseCase.test.ts`** - Emissão de NFTs
- **`src/core/use-cases/__tests__/ProcessPaymentUseCase.test.ts`** - Processamento de pagamentos
- **`src/core/use-cases/__tests__/CreateProductUseCase.test.ts`** - Criação de produtos
- **`src/core/use-cases/__tests__/ValidateNFTAccessUseCase.feature.test.ts`** - Validação de acesso NFT
- **`src/core/use-cases/__tests__/CreateMerchantUseCase.feature.test.ts`** - Criação de merchants

#### **Infrastructure Layer (Services)**

- **`src/infrastructure/services/__tests__/PixPaymentService.feature.test.ts`** - Serviço PIX
- **`src/infrastructure/services/__tests__/ERC721NFTService.feature.test.ts`** - Serviço NFT
- **`src/infrastructure/services/__tests__/EthereumBlockchainService.feature.test.ts`** - Serviço Blockchain

#### **Presentation Layer (Components & Hooks)**

- **`src/components/auth/__tests__/LoginForm.feature.test.tsx`** - Formulário de login
- **`src/components/products/__tests__/ProductCatalog.feature.test.tsx`** - Catálogo de produtos
- **`src/hooks/__tests__/useCart.feature.test.ts`** - Hook do carrinho
- **`src/hooks/__tests__/useWallet.feature.test.ts`** - Hook da wallet

#### **Integration Tests**

- **`src/__tests__/integration/complete-purchase-flow.feature.test.ts`** - Fluxo completo end-to-end

## Cenários de Negócio Cobertos

### 1. **Fluxo Completo de Compra**

```gherkin
Feature: Complete Purchase Flow with NFT Minting
  As a customer
  I want to purchase a product and receive an NFT
  So that I can prove my purchase and access exclusive content

  Scenario: Successful product purchase with PIX payment and NFT minting
    Given a merchant has deployed their smart contract
    And there is a product "VIP Concert Ticket" priced at "R$ 150,00"
    When I add the product to my cart
    And I proceed to checkout with PIX payment
    Then an NFT should be automatically minted to my wallet
    And the merchant should receive their portion of the payment
```

### 2. **Validação de NFT para Acesso**

```gherkin
Feature: Validação de NFT para Controle de Acesso
  As a user who owns NFTs
  I want to access exclusive content based on NFT ownership
  So that I can enjoy exclusive benefits from my tokens

  Scenario: Validação bem-sucedida de posse de NFT
    Given que eu possuo um NFT do produto "VIP Concert Ticket"
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    Then o sistema deve verificar a posse do NFT on-chain
    And eu devo ter acesso concedido ao conteúdo exclusivo
```

### 3. **Gestão de Merchants**

```gherkin
Feature: Gestão de Merchants
  As a platform administrator
  I want to manage merchants and their configurations
  So that I can control access and settings of store owners

  Scenario: Cadastro bem-sucedido de novo merchant
    Given que um novo merchant solicita cadastro
    When o administrador aprova o cadastro
    Then o merchant deve ser criado com sucesso
    And um smart contract deve ser deployado
```

### 4. **Catálogo de Produtos**

```gherkin
Feature: Catálogo de Produtos
  As a marketplace customer
  I want to view and interact with the product catalog
  So that I can find and purchase products of interest

  Scenario: Visualização do catálogo de produtos
    Given que existem produtos disponíveis no marketplace
    When eu acesso a página do catálogo
    Then devo visualizar uma lista de produtos
    And cada produto deve exibir imagem, nome, preço e descrição
```

## Padrões BDD Implementados

### 1. **Estrutura Given-When-Then**

Todos os testes seguem a estrutura clara de:
- **Given**: Contexto e pré-condições
- **When**: Ações do usuário ou sistema
- **Then**: Resultados esperados

### 2. **Test Data Builders**

```typescript
// Exemplo de uso do TestDataBuilder
const product = TestDataBuilder.createProduct({
  id: 'product-1',
  name: 'VIP Concert Ticket',
  price: TestDataBuilder.createMoney(15000),
  nftEnabled: true
});
```

### 3. **Mock Services**

```typescript
// Exemplo de mock de serviços
const mockNFTService = MockServiceHelper.mockNFTService();
const mockPaymentService = MockServiceHelper.setupSuccessfulPayment();
```

### 4. **BDD Helpers**

```typescript
// Helpers para asserções BDD
Then.expectVisible(element);
Then.expectPaymentStatus('confirmed', actualStatus);
Then.expectOrderItems(order, 2);
```

## Cobertura de Testes

### **Cenários de Sucesso (Happy Path)**
- ✅ Compra bem-sucedida com PIX
- ✅ Emissão automática de NFT
- ✅ Validação de acesso com NFT
- ✅ Cadastro de merchant
- ✅ Gestão de produtos
- ✅ Autenticação de usuário

### **Cenários de Erro**
- ✅ Falha no pagamento PIX
- ✅ Timeout de pagamento
- ✅ Falha na mintagem de NFT
- ✅ Validação de NFT inválida
- ✅ Problemas de conectividade blockchain
- ✅ Assinatura inválida

### **Cenários de Edge Cases**
- ✅ Múltiplos NFTs do mesmo produto
- ✅ NFT transferida para outra wallet
- ✅ NFT queimada (burned)
- ✅ Produtos com estoque limitado
- ✅ Produtos esgotados
- ✅ Concorrência em compras

## Configuração e Execução

### **Dependências**

```json
{
  "jest-cucumber": "^3.0.1",
  "@testing-library/react": "^13.0.0",
  "@testing-library/jest-dom": "^5.16.4"
}
```

### **Configuração Jest**

```javascript
// jest.bdd.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.bdd.setup.js'],
  testMatch: ['**/*.feature.test.ts', '**/*.feature.test.tsx'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### **Execução dos Testes**

```bash
# Executar todos os testes BDD
npm run test:bdd

# Executar testes de uma feature específica
npm run test:bdd -- --testNamePattern="NFT Validation"

# Executar testes com coverage
npm run test:bdd -- --coverage
```

## Benefícios Alcançados

### 1. **Comunicação com Stakeholders**
- Cenários escritos em linguagem natural
- Compreensão clara dos requisitos de negócio
- Documentação viva dos comportamentos esperados

### 2. **Qualidade do Código**
- Testes focados em comportamento
- Cobertura abrangente de cenários
- Detecção precoce de regressões

### 3. **Manutenibilidade**
- Testes independentes e isolados
- Reutilização de helpers e builders
- Fácil extensão para novos cenários

### 4. **Integração Contínua**
- Testes automatizados no pipeline CI/CD
- Validação de qualidade antes do merge
- Feedback rápido para desenvolvedores

## Próximos Passos

### **Melhorias Planejadas**

1. **Performance Tests**
   - Testes de carga para operações blockchain
   - Validação de performance em diferentes redes

2. **Security Tests**
   - Testes de vulnerabilidades de smart contracts
   - Validação de segurança de autenticação

3. **Accessibility Tests**
   - Testes de acessibilidade para componentes
   - Validação de conformidade WCAG

4. **Mobile Tests**
   - Testes para dispositivos móveis
   - Validação de responsividade

### **Expansão de Cobertura**

1. **Novos Cenários de Negócio**
   - Marketplace de NFTs
   - Sistema de recompensas
   - Integração com redes sociais

2. **Testes de Regressão**
   - Suítes de regressão automatizadas
   - Validação de compatibilidade

3. **Testes de Usabilidade**
   - Testes de experiência do usuário
   - Validação de fluxos de onboarding

## Conclusão

A implementação de testes BDD no projeto Xperience Hubs Payment estabeleceu uma base sólida para:

- **Qualidade**: Garantia de que o software funciona conforme especificado
- **Confiança**: Testes automatizados que validam comportamentos críticos
- **Colaboração**: Linguagem comum entre desenvolvedores e stakeholders
- **Evolução**: Base testável para futuras funcionalidades

Os testes BDD não apenas validam a funcionalidade atual, mas também servem como documentação viva e guia para o desenvolvimento futuro da plataforma. 