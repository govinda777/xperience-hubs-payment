## Mapeamento de Casos de Teste (.features) Essenciais

Abaixo estão os principais arquivos `.feature` que devem ser criados, com exemplos representativos de cenários Gherkin para cobrir toda a jornada do usuário e validar o funcionamento do projeto **xperience-hubs-payment**. O foco do mapeamento é garantir cobertura BDD das funcionalidades críticas: conexão de carteira, pagamentos via Pix, mint de NFTs, mensagens ao usuário e fluxos de exceção.

### 1. Conexão de Carteira - `wallet-connection.feature`

- **Cenários:**
  - Conectar MetaMask com sucesso
  - Usuário tenta conectar sem carteira instalada
  - Desconectar carteira conectada
  - Selecionar diferentes tipos de wallets via WalletConnect
  - Exibição de erros em tentativas inválidas

### 2. Pagamento PIX - `pix-payment.feature`

- **Cenários:**
  - Visualizar opção de pagamento via Pix ao selecionar NFT
  - Gerar QR Code Pix único ao iniciar compra
  - Validar expiração do QR Code Pix (tempo limite)
  - Confirmar pagamento Pix processado com sucesso
  - Exibir mensagem de pagamento recusado/falhou
  - Simular pagamento com valor incorreto e rejeição automática
  - Repetir tentativa de pagamento após falha

### 3. Mint e Propriedade de NFT - `nft-minting.feature`

- **Cenários:**
  - Mint de NFT disparado após pagamento confirmado
  - Exibir progresso/feedback do mint para usuário
  - NFT transferido corretamente para a carteira do usuário
  - Validar propriedades básicas do NFT minted (tokenID, metadata)
  - Verificar NFT listado no inventário do usuário
  - Mint negado por saldo insuficiente
  - Mint negado por falha na transação blockchain

### 4. Fluxos de Falha e Mensagens ao Usuário - `user-messages.feature`

- **Cenários:**
  - Mensagem amigável de erro se o pagamento falhar
  - Notificação de conexão de carteira perdida
  - Orientação ao usuário sobre próximos passos após erro
  - Exibição do status do pedido (em processamento, completo, cancelado)
  - Manter o histórico das tentativas de pagamento e mint

### 5. Integrações e Fluxos End-to-End - `end-to-end.feature`

- **Cenários:**
  - Usuário conecta carteira, compra NFT via Pix e realiza mint com sucesso
  - Usuário abandona processo de compra; sistema limpa estado e orienta usuário
  - Falha de pagamento no meio do fluxo e reentrada segura possível
  - Múltiplas compras e mintings em sequência
  - Teste de stress: múltiplos usuários processando operações simultaneamente

### 6. Segurança e Validações - `security.feature`

- **Cenários:**
  - Detectar tentativas de ataque/fraude em pagamentos
  - Rejeitar requisições com dados inconsistentes ou ausentes
  - Garantir tokenização e confidencialidade dos dados do usuário
  - Testar uso de same QR Code em múltiplas tentativas
  - Garantir proteção contra replay de pagamentos

### Sumário dos Arquivos .feature

| Arquivo .feature           | Área validada                                   |
|----------------------------|-------------------------------------------------|
| wallet-connection.feature  | Login e conexão de carteiras                    |
| pix-payment.feature        | Processos, fluxos e validações Pix              |
| nft-minting.feature        | Mint, propriedade e validação de NFTs           |
| user-messages.feature      | Mensagens, feedbacks e experiência do usuário   |
| end-to-end.feature         | Fluxos completos e jornadas integradas          |
| security.feature           | Testes de segurança, integridade e fraudes      |

Cada arquivo `.feature` deve conter cenários para as operações normais, de exceção e usuários maliciosos, simulando o comportamento do sistema em condições reais do mercado de pagamentos digitais e Web3, alinhando boas práticas de gateways de pagamento e blockchain[1][2][3][4].

[1] https://www.globalapptesting.com/blog/payment-gateway-test-cases
[2] https://www.globalapptesting.com/blog/what-is-payment-testing
[3] https://developers.ecommpay.com/en/pm_pix.html
[4] https://xrpl.org/docs/tutorials/javascript/nfts/mint-and-burn-nfts
[5] https://www.nomentia.com/blog/implementing-a-global-enterprise-scale-payment-hub-the-challenges-and-business-impacts
[6] https://www.infinite.com/instant-payments/case-study/payment-hub-ready-integrating-with-instant-payments-simulator/
[7] https://docs.worldpay.com/apis/ips-3130/testing/test-cases
[8] https://github.com/XDC-Community/docs/blob/main/get-details/wallet-integration/walletconnect.md
[9] https://www.immutable.com/blog/immutable-x-and-moonpay-bring-nft-checkout-to-immutable-x-partners
[10] https://www.nomentia.com/blog/payment-hub-implementation-checklist
[11] https://belvo.com/products/payment-initiation/
[12] https://docs.immutable.com/products/zkevm/checkout/commerce-widget/wallet-connect-integration/
[13] https://blog.nashtechglobal.com/payment-gateway-testing-how-to-execute-the-test-effectively/
[14] https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/payment-brick/payment-submission/pix
[15] https://walletconnect.network/blog/walletconnect-a-year-in-review-and-vision-for-2025
[16] https://www.nft.kred/help/how-to-mint-an-nft
[17] https://www.lambdatest.com/learning-hub/test-cases-for-travel-and-hospitality-app-testing
[18] https://www.pagbrasil.com/international-pix/
[19] https://walletconnect.mirror.xyz/kjKaG2qi4_CRqRwz--E-a_cpuTI657f2MfR_0gPWSC0
[20] https://ecos.am/en/blog/free-nft-minting-how-to-create-and-mint-nfts-without-spending-a-dime/
