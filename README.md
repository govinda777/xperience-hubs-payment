# Xperience Hotsite Payment

## 1. Visão Geral do Projeto

O **Xperience Hotsite Paymente** é uma solução digital inovadora que permite a qualquer empresa ou empreendedor criar rapidamente uma loja online personalizada para divulgação e venda de produtos ou eventos. O sistema integra pagamentos via Pix, utiliza tecnologia de smart contracts para automação e segurança das transações, e oferece funcionalidades modernas como emissão de NFTs para ingressos digitais e validação automatizada.

### 1.1. Objetivos

- **Facilitar a criação de lojas online** para venda de produtos ou eventos, sem necessidade de conhecimento técnico avançado.
- **Simplificar a gestão de vendas** e recebimentos com integração nativa ao Pix.
- **Oferecer recursos inovadores**, como emissão de ingressos digitais em NFT, validação automática e conteúdos exclusivos para compradores.
- **Fornecer um template flexível** que pode ser facilmente customizado por diferentes empresas e segmentos.

### 1.2. Público-Alvo

- Pequenas e médias empresas
- Organizadores de eventos
- Artistas, produtores culturais e criadores de conteúdo
- Empreendedores digitais

---

## 2. Arquitetura

### 2.1. Arquitetura Centralizada no Smart Contract do Lojista

Toda a lógica do projeto deve ser **centralizada no endereço do smart contract**, que representa o lojista e armazena os dados essenciais para o funcionamento do hotsite, checkout, emissão de NFT e validação de acesso.

#### Implicações Práticas

- **Fonte Única de Verdade:** Todas as operações consultam o smart contract do lojista.
- **Estrutura de Dados no Smart Contract:**
  - Dados do lojista (nome, CNPJ, PIX).
  - Catálogo de produtos/planos.
  - Histórico de vendas.
  - NFTs emitidas.
  - Permissões de acesso.
- **Fluxo de Usuário Baseado no Smart Contract:** Do acesso ao hotsite à validação do acesso restrito.

### 2.2. Estrutura de Pastas (Next.js)

```
/xperience-hubs-payment
│
├── public/
├── pages/
│   ├── [contractAddress]/
│   │   ├── index.js
│   │   ├── checkout.js
│   │   └── ...
│   └── api/
├── use_cases/
│   ├── checkout/
│   ├── onboarding/
│   └── ...
├── components/
├── hooks/
├── services/
├── abi/
├── tests/
└── ...
```

### 2.3. Stack Tecnológica e Diretrizes

| Camada         | Tecnologia                               |
|----------------|------------------------------------------|
| Frontend       | **Next.js**                              |
| Autenticação   | **Auth0 + Privy**                        |
| Wallet & Web3  | **Privy SDK**                            |
| RPC Blockchain | **Alchemy RPC**                          |
| Backend        | **Vtex Lambda (Serverless Function)**     |

---

## 3. Jornadas de Usuário

### 3.1. Jornada do Lojista (Merchant Journey)

1.  **Descoberta e Interesse:** Acessa a plataforma e explora os benefícios.
2.  **Início do Cadastro:** Cria uma conta.
3.  **Preenchimento de Dados da Loja:** Informa dados da loja, documentação e personalização.
4.  **Configuração de Pagamentos:** Integra gateways e valida dados bancários.
5.  **Revisão e Confirmação:** Revisa os dados e aceita os termos.
6.  **Aprovação e Ativação:** Recebe a confirmação e a loja é ativada.
7.  **Onboarding Pós-Cadastro:** Faz um tour guiado pela plataforma.

### 3.2. Jornada do Cliente Final

1.  **Acesso à loja:** Acessa o hotsite personalizado.
2.  **Escolha do produto/evento:** Seleciona o item desejado.
3.  **Pagamento via Pix:** Realiza o pagamento.
4.  **Confirmação e emissão de NFT:** Recebe o NFT como comprovante.
5.  **Validação e acesso:** Valida o NFT para acessar conteúdos ou eventos.

---

## 4. Funcionalidades Detalhadas

### 4.1. Pagamento PIX

- **QR Code Único com Split:** O pagamento é dividido automaticamente entre o lojista e a plataforma.
- **Validação:** O backend valida o QR Code e o split antes e depois do pagamento.
- **Confirmação:** A NFT só é emitida após a confirmação de ambos os repasses.

### 4.2. Geração e Autenticação de NFT

- **Geração Automática:** A NFT é gerada e enviada para a carteira do comprador após a confirmação do pagamento.
- **Autenticação com Assinatura:** O usuário assina uma mensagem com sua chave privada para provar a posse da NFT, sem expor a chave.
- **Integração com Privy:** A gestão de wallets e assinaturas é feita através do Privy.io.

### 4.3. Backoffice do Lojista

- **Dashboard:** Métricas de vendas, status de pagamentos e alertas.
- **Consulta de Transações:** Filtros por data, status, valor, etc.
- **Gestão de Pagamentos:** Acompanhamento de repasses e extratos.
- **Configuração de Integrações:** API, webhooks, etc.
- **Suporte e Disputas:** Canal para abrir chamados e gerenciar contestações.

### 4.4. Wallet (Carteira Digital)

- **Privy como Infraestrutura:** Utiliza Privy para criar e gerenciar wallets embutidas e auto-custodiais.
- **Autenticação e Assinatura:** A wallet é usada para assinar mensagens e provar a posse de ativos digitais.
- **Fluxo Simplificado:** O usuário interage com a blockchain sem a complexidade de gerenciar seed phrases.

---

## 5. Casos de Teste (BDD)

| Arquivo .feature           | Área validada                                   |
|----------------------------|-------------------------------------------------|
| `wallet-connection.feature`  | Conexão de carteiras (MetaMask, WalletConnect)  |
| `pix-payment.feature`        | Geração, pagamento e validação de QR Code Pix   |
| `nft-minting.feature`        | Emissão, transferência e validação de NFTs      |
| `user-messages.feature`      | Mensagens de erro e notificações ao usuário     |
| `end-to-end.feature`         | Fluxos completos da jornada do usuário          |
| `security.feature`           | Testes de segurança e prevenção de fraudes      |
