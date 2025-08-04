# 📋 Documentação dos Testes BDD .feature

## 🎯 Visão Geral

Este documento apresenta todos os cenários de teste BDD (Behavior-Driven Development) implementados no projeto **Xperience Hubs Payment**, organizados por domínio de negócio e funcionalidade.

## 🏗️ Estrutura dos Arquivos .feature

```
features/
├── auth/
│   └── login.feature                    # Autenticação de usuários
├── cart/
│   └── cart-management.feature          # Gerenciamento do carrinho
├── payment/
│   └── process-payment.feature          # Processamento de pagamentos
├── merchant/                            # Gestão de merchants (a implementar)
├── nft/                                 # Operações NFT (a implementar)
├── products/                            # Gestão de produtos (a implementar)
└── complete-purchase-flow.feature       # Fluxo completo de compra
```

---

## 🔐 **AUTENTICAÇÃO** - `features/auth/login.feature`

### **Objetivo**: Gerenciar login de usuários via email/senha e carteira Web3

### **Cenários Implementados**:

#### 1. **Login bem-sucedido com email e senha**
```gherkin
Given que existe um usuário com email "lojista@example.com" e senha "senha123"
And que o usuário está na página de login
When ele preenche o campo email com "lojista@example.com"
And ele preenche o campo senha com "senha123"
And ele clica no botão "Entrar"
Then ele deve ser redirecionado para o dashboard
And deve ver a mensagem "Bem-vindo de volta!"
And sua sessão deve estar ativa
```

#### 2. **Login bem-sucedido com carteira Web3**
```gherkin
Given que o usuário possui uma carteira MetaMask configurada
And que o usuário está na página de login
When ele clica no botão "Conectar Carteira"
And ele aprova a conexão na carteira
Then ele deve ser redirecionado para o dashboard
And deve ver seu endereço de carteira no header
And sua sessão deve estar ativa
```

#### 3. **Falha no login com credenciais inválidas**
```gherkin
Given que o usuário está na página de login
When ele preenche o campo email com "usuario@inexistente.com"
And ele preenche o campo senha com "senhaerrada"
And ele clica no botão "Entrar"
Then deve ver a mensagem de erro "Credenciais inválidas"
And deve permanecer na página de login
And os campos devem ser limpos
```

#### 4. **Falha no login com campos obrigatórios vazios**
```gherkin
Given que o usuário está na página de login
When ele deixa o campo email vazio
And ele deixa o campo senha vazio
And ele clica no botão "Entrar"
Then deve ver mensagens de validação nos campos obrigatórios
And o botão "Entrar" deve permanecer desabilitado
```

#### 5. **Falha na conexão da carteira Web3**
```gherkin
Given que o usuário está na página de login
And que não há carteira instalada no navegador
When ele clica no botão "Conectar Carteira"
Then deve ver a mensagem "Carteira não encontrada"
And deve ser orientado a instalar uma carteira
And deve permanecer na página de login
```

#### 6. **Toggle de visibilidade da senha**
```gherkin
Given que o usuário está na página de login
When ele preenche o campo senha com "minhasenha"
Then a senha deve estar oculta por padrão
When ele clica no ícone do olho
Then a senha deve ficar visível
When ele clica no ícone do olho novamente
Then a senha deve ficar oculta novamente
```

---

## 🛒 **CARRINHO DE COMPRAS** - `features/cart/cart-management.feature`

### **Objetivo**: Gerenciar produtos no carrinho de compras com persistência

### **Cenários Implementados**:

#### 1. **Adicionar produto ao carrinho vazio**
```gherkin
Given que o carrinho está vazio
And que existe um produto "Camiseta" com preço R$ 50,00
When o cliente adiciona 2 unidades do produto ao carrinho
Then o carrinho deve conter 1 item
And o item deve ter quantidade 2
And o total do carrinho deve ser R$ 100,00
And o carrinho deve ser salvo no localStorage
```

#### 2. **Adicionar produto já existente no carrinho**
```gherkin
Given que existe um produto "Camiseta" já no carrinho com quantidade 1
When o cliente adiciona mais 2 unidades do mesmo produto
Then o carrinho deve conter 1 item
And a quantidade do item deve ser 3
And o total deve ser atualizado para R$ 150,00
```

#### 3. **Atualizar quantidade de produto no carrinho**
```gherkin
Given que existe um produto "Camiseta" no carrinho com quantidade 2
When o cliente atualiza a quantidade para 5
Then a quantidade do produto deve ser 5
And o total deve ser atualizado para R$ 250,00
And as alterações devem ser salvas no localStorage
```

#### 4. **Remover produto do carrinho**
```gherkin
Given que existem 2 produtos diferentes no carrinho
When o cliente remove um dos produtos
Then o carrinho deve conter apenas 1 produto
And o total deve ser recalculado
And o produto removido não deve aparecer na lista
```

#### 5. **Limpar carrinho completamente**
```gherkin
Given que existem 3 produtos no carrinho
When o cliente limpa o carrinho
Then o carrinho deve estar vazio
And o total deve ser R$ 0,00
And o localStorage deve ser limpo
```

#### 6. **Carrinho com produtos com desconto**
```gherkin
Given que existe um produto "Tênis" com preço R$ 200,00 e 10% de desconto
When o cliente adiciona 1 unidade ao carrinho
Then o subtotal deve ser R$ 200,00
And o total com desconto deve ser R$ 180,00
And a economia deve ser exibida como R$ 20,00
```

#### 7. **Persistência do carrinho entre sessões**
```gherkin
Given que o cliente adiciona produtos ao carrinho
And fecha o navegador
When ele abre o navegador novamente
And acessa o site
Then o carrinho deve manter os produtos adicionados
And as quantidades devem estar corretas
And os totais devem estar atualizados
```

#### 8. **Carrinho com produto esgotado**
```gherkin
Given que existe um produto "Produto Limitado" com estoque 0
When o cliente tenta adicionar o produto ao carrinho
Then deve ver mensagem "Produto indisponível"
And o produto não deve ser adicionado ao carrinho
```

---

## 💳 **PAGAMENTOS** - `features/payment/process-payment.feature`

### **Objetivo**: Processar pagamentos via PIX e Crypto com split automático

### **Cenários Implementados**:

#### 1. **Processamento bem-sucedido de pagamento PIX**
```gherkin
Given que existe um pedido com valor de R$ 100,00
And que o merchant tem taxa de split de 5%
When o cliente escolhe pagamento via PIX
And o sistema processa o pagamento
Then deve ser gerado um QR Code PIX válido
And o valor deve ser dividido corretamente (R$ 95,00 para merchant, R$ 5,00 para plataforma)
And o status do pedido deve mudar para "aguardando_pagamento"
And o cliente deve ver as instruções de pagamento
And deve ter um prazo de 30 minutos para pagamento
```

#### 2. **Processamento bem-sucedido de pagamento Crypto**
```gherkin
Given que existe um pedido com valor equivalente a 0.05 ETH
And que o cliente tem uma carteira conectada
When o cliente escolhe pagamento via Crypto
And fornece o endereço da carteira "0x742d35Cc6634C0532925a3b8D0C"
And confirma o valor de "0.05" ETH
And o sistema processa o pagamento
Then a transação deve ser registrada
And o status do pedido deve mudar para "pago"
And NFTs devem ser mintados se aplicável
And o cliente deve receber confirmação da transação
```

#### 3. **Falha no processamento - Pedido não encontrado**
```gherkin
Given que não existe pedido com ID "pedido-inexistente"
When o sistema tenta processar o pagamento
Then deve retornar erro "Pedido não encontrado"
And não deve processar nenhuma transação
And deve logar o erro para auditoria
```

#### 4. **Falha no processamento - Merchant não encontrado**
```gherkin
Given que existe um pedido válido
But o merchant foi desativado ou removido
When o sistema tenta processar o pagamento
Then deve retornar erro "Merchant não encontrado"
And o status do pedido não deve ser alterado
And o cliente deve ser notificado sobre o problema
```

#### 5. **Falha no processamento - Pedido já pago**
```gherkin
Given que existe um pedido com status "pago"
When o sistema tenta processar o pagamento novamente
Then deve retornar erro "Pedido já foi pago"
And não deve gerar nova transação
And deve manter o status atual do pedido
```

#### 6. **Processamento com NFT habilitado**
```gherkin
Given que existe um pedido com produto NFT
And que o merchant tem NFT habilitado
When o pagamento é processado com sucesso via Crypto
Then NFTs devem ser mintados automaticamente
And tokens devem ser associados ao pedido
And o cliente deve receber os NFTs em sua carteira
And metadados devem incluir informações do pedido
```

---

## 🚀 **FLUXO COMPLETO DE COMPRA** - `features/complete-purchase-flow.feature`

### **Objetivo**: Testar o fluxo end-to-end de compra com PIX e NFT minting

### **Cenários Implementados**:

#### 1. **Successful product purchase with PIX payment and NFT minting**
```gherkin
Given I am browsing the merchant's online store
And there is a product "VIP Concert Ticket" priced at "R$ 150,00"
And the product has NFT access enabled
When I add the product to my cart
And I proceed to checkout
And I provide my wallet address "0x123...abc"
And I choose PIX as payment method
Then I should see a PIX QR Code for payment
And the QR Code should include split payment configuration
When I pay the PIX amount
And the payment is confirmed by the PIX provider
Then an NFT should be automatically minted to my wallet
And the NFT should contain my purchase details
And I should receive confirmation of successful purchase
And the merchant should receive their portion of the payment
And the platform should receive the platform fee
```

#### 2. **Multiple products purchase with batch NFT minting**
```gherkin
Given I am browsing the merchant's online store
And there are products:
  | name                  | price    | nft_enabled |
  | Concert Ticket        | R$ 100,00| true        |
  | VIP Parking Pass      | R$ 50,00 | true        |
  | Merchandise Package   | R$ 75,00 | false       |
When I add all products to my cart
And I proceed to checkout with PIX payment
And the total amount is "R$ 225,00"
And I complete the PIX payment
Then 2 NFTs should be minted (for Concert Ticket and VIP Parking Pass)
And 1 traditional receipt should be issued (for Merchandise Package)
And all NFTs should be sent to my wallet address
And each NFT should have unique metadata for its respective product
```

#### 3. **Payment failure and order cancellation**
```gherkin
Given I have items in my cart worth "R$ 200,00"
And I have generated a PIX QR Code
When the PIX payment fails or is declined
Then the order should be marked as "failed"
And no NFT should be minted
And I should be notified of the payment failure
And I should be able to retry the payment
```

#### 4. **PIX payment timeout handling**
```gherkin
Given I have generated a PIX QR Code with 15-minute expiration
When 15 minutes pass without payment
Then the PIX QR Code should expire
And the order should be marked as "expired"
And no NFT should be minted
And I should be able to generate a new QR Code if desired
```

#### 5. **NFT minting failure with successful payment**
```gherkin
Given I have successfully paid via PIX
And the payment has been confirmed and split
When the NFT minting process fails due to blockchain issues
Then I should still have proof of purchase via traditional receipt
And the system should queue the NFT minting for retry
And I should be notified that my NFT will be delivered once the blockchain is available
And my payment should not be refunded
```

#### 6. **Merchant receives correct payment split**
```gherkin
Given a product costs "R$ 100,00"
And the platform fee is configured at "5%"
When a customer completes a PIX payment
Then the merchant should receive "R$ 95,00"
And the platform should receive "R$ 5,00"
And both payments should be processed automatically
And the split should be transparent in transaction records
```

#### 7. **Customer accesses NFT-gated content**
```gherkin
Given I have purchased a product with NFT access
And the NFT has been minted to my wallet "0x123...abc"
When I connect my wallet to the merchant's exclusive area
And I sign a message to prove ownership
Then the system should verify I own the required NFT
And I should be granted access to exclusive content
And my access should be logged for audit purposes
```

#### 8. **Invalid wallet address during checkout**
```gherkin
Given I have items in my cart
When I provide an invalid wallet address "invalid-address-123"
And I attempt to proceed to checkout
Then I should see a validation error
And I should be prompted to enter a valid wallet address
And the checkout process should not continue until a valid address is provided
```

#### 9. **Product stock validation during purchase**
```gherkin
Given a product has limited stock of "2 units"
And another customer is simultaneously purchasing the same product
When I attempt to purchase "3 units" of the product
Then I should see an "insufficient stock" error
And my cart should be updated to show available quantity
And I should be able to adjust my purchase to available stock
```

#### 10. **Concurrent purchases of limited edition NFTs**
```gherkin
Given a product has a maximum NFT supply of "100 tokens"
And "99 NFTs" have already been minted
When multiple customers simultaneously attempt to purchase
Then only the first customer should successfully receive the NFT
And subsequent customers should receive appropriate error messages
And no more than "100 NFTs" should ever be minted for this product
```

#### 11. **Customer views their NFT collection**
```gherkin
Given I have made multiple purchases over time
And I have accumulated several NFTs in my wallet
When I visit my profile page
And I connect my wallet
Then I should see all NFTs I own from this merchant
And each NFT should display its associated purchase details
And I should be able to view the metadata and transaction history
```

---

## 📊 **Resumo dos Cenários por Domínio**

| Domínio | Arquivo .feature | Cenários | Status |
|---------|------------------|----------|--------|
| **Autenticação** | `auth/login.feature` | 6 cenários | ✅ Implementado |
| **Carrinho** | `cart/cart-management.feature` | 8 cenários | ✅ Implementado |
| **Pagamentos** | `payment/process-payment.feature` | 6 cenários | ✅ Implementado |
| **Fluxo Completo** | `complete-purchase-flow.feature` | 11 cenários | ✅ Implementado |
| **Merchant** | `merchant/` | - | 🔄 Pendente |
| **NFT** | `nft/` | - | 🔄 Pendente |
| **Produtos** | `products/` | - | 🔄 Pendente |

**Total**: 31 cenários BDD implementados

---

## 🎯 **Padrões BDD Utilizados**

### **1. Linguagem de Negócio**
- Uso de linguagem natural e compreensível
- Foco no comportamento do usuário
- Descrição clara dos benefícios

### **2. Estrutura Given/When/Then**
- **Given**: Contexto e pré-condições
- **When**: Ações do usuário ou sistema
- **Then**: Resultados esperados

### **3. Background**
- Configurações comuns a todos os cenários
- Setup do ambiente de teste
- Dados de contexto compartilhados

### **4. Data Tables**
- Uso de tabelas para dados estruturados
- Cenários parametrizados
- Exemplos múltiplos em um cenário

---

## 🚀 **Como Executar os Testes BDD**

```bash
# Executar todos os testes BDD
yarn test:bdd

# Executar testes BDD em modo watch
yarn test:bdd:watch

# Executar testes BDD com cobertura
yarn test:bdd:coverage

# Executar testes BDD específicos
yarn test:bdd --testPathPattern=auth
yarn test:bdd --testPathPattern=payment
yarn test:bdd --testPathPattern=cart
```

---

## 📝 **Próximos Passos**

1. **Implementar cenários para domínios pendentes**:
   - Merchant management
   - NFT operations
   - Product catalog

2. **Criar cenários de integração**:
   - Entre use cases e serviços
   - Entre componentes frontend
   - Entre sistemas externos

3. **Adicionar cenários de edge cases**:
   - Tratamento de erros de rede
   - Timeouts e retry logic
   - Validações de segurança

4. **Implementar cenários de performance**:
   - Carga de usuários simultâneos
   - Processamento de grandes volumes
   - Otimizações de blockchain

---

## ✅ **Benefícios dos Testes BDD Implementados**

- **Comunicação clara** entre stakeholders
- **Documentação viva** do comportamento do sistema
- **Cobertura completa** dos fluxos críticos
- **Facilidade de manutenção** e evolução
- **Testes executáveis** que validam requisitos
- **Orientação a testes** desde o design 