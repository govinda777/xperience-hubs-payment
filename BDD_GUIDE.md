# Guia de Testes BDD (Behavior-Driven Development)

## Visão Geral

Este projeto agora suporta testes orientados a comportamento (BDD) usando jest-cucumber. Os testes BDD focam no comportamento esperado do sistema do ponto de vista do usuário e das regras de negócio.

## Estrutura dos Arquivos

```
features/                    # Arquivos .feature com cenários em Gherkin
├── auth/
│   └── login.feature
├── payment/
│   └── process-payment.feature
├── cart/
│   └── cart-management.feature
└── ...

src/lib/bdd/
├── helpers.ts              # Helpers para Given, When, Then
└── templates.ts            # Templates para novos testes

src/**/__tests__/
└── *.feature.test.tsx      # Implementação dos testes BDD
```

## Scripts Disponíveis

```bash
# Executar todos os testes BDD
yarn test:bdd

# Executar testes BDD em modo watch
yarn test:bdd:watch

# Executar testes BDD com cobertura
yarn test:bdd:coverage
```

## Como Escrever Testes BDD

### 1. Criar o arquivo .feature

```gherkin
Feature: Nome da Funcionalidade
  Como um [tipo de usuário]
  Eu quero [objetivo]
  Para que [benefício]

  Scenario: Cenário de sucesso
    Given que existe um contexto inicial
    When o usuário executa uma ação
    Then o sistema deve responder adequadamente
```

### 2. Implementar o teste

```typescript
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Given, When, Then } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/minha-feature.feature');

defineFeature(feature, test => {
  test('Cenário de sucesso', ({ given, when, then }) => {
    given('que existe um contexto inicial', () => {
      // Setup
    });

    when('o usuário executa uma ação', () => {
      // Ação
    });

    then('o sistema deve responder adequadamente', () => {
      // Verificação
    });
  });
});
```

## Helpers Disponíveis

### TestDataBuilder
```typescript
const product = TestDataBuilder.createProduct({
  name: 'Produto Teste',
  price: TestDataBuilder.createMoney(10000) // R$ 100,00
});

const merchant = TestDataBuilder.createMerchant();
const order = TestDataBuilder.createOrder();
```

### Given, When, Then
```typescript
// Setup de dados
const product = Given.aProduct({ name: 'Camiseta' });
const paymentService = Given.aSuccessfulPaymentService();

// Ações do usuário
await When.userFillsForm({ email: 'test@test.com' });
await When.userClicksButton('Entrar');

// Verificações
Then.expectVisible(element);
Then.expectPaymentStatus('paid', actualStatus);
```

## Padrões e Convenções

### Nomeação
- Arquivos .feature: kebab-case (ex: `login-flow.feature`)
- Testes: `*.feature.test.tsx`
- Cenários: Descrever o comportamento do usuário

### Estrutura de Cenários
1. **Given**: Estado inicial do sistema
2. **When**: Ação do usuário ou evento
3. **Then**: Resultado esperado
4. **And/But**: Passos adicionais

### Foco no Comportamento
- ✅ "Quando o usuário clica em 'Comprar'"
- ❌ "Quando a função addToCart() é chamada"

## Exemplos Práticos

Veja os arquivos em `features/` e `src/**/__tests__/*.feature.test.tsx` para exemplos completos de:
- Autenticação de usuários
- Processamento de pagamentos
- Gerenciamento de carrinho
- E mais...

## Troubleshooting

### Erro de Tipo Money
Se você receber erro "Type 'number' is not assignable to type 'Money'":

```typescript
// ❌ Incorreto
price: 100

// ✅ Correto
price: TestDataBuilder.createMoney(10000) // R$ 100,00
// ou
price: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' }
```

### Mock de Dependências
Use os helpers em `MockServiceHelper` para criar mocks consistentes:

```typescript
const paymentService = MockServiceHelper.setupSuccessfulPayment();
const authService = MockServiceHelper.mockAuthService();
```