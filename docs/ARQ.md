# Arquitetura Centralizada no Smart Contract do Lojista

## Princípio Fundamental

Toda a lógica do projeto deve ser **centralizada no endereço do smart contract**, que representa o lojista e armazena os dados essenciais para o funcionamento do hotsite, checkout, emissão de NFT e validação de acesso.

## Implicações Práticas na Arquitetura

### 1. Endereço do Smart Contract como Fonte Única de Verdade

- **Todas as operações** (cadastro de produtos, planos, pagamentos, emissão de NFT, permissões de acesso) devem consultar ou interagir com o smart contract do lojista.
- **Dados dinâmicos** do lojista (nome, planos, preços, metadados das NFTs, configurações de recebimento PIX) são lidos diretamente do contrato.
- **Frontend**: Ao carregar o site, o endereço do contrato é carregado via configuração, query string, subdomínio ou seleção do usuário.
- **Backend/API**: Todas as chamadas que envolvem lógica de negócio (checkout, mint, validação) usam o endereço do smart contract como parâmetro obrigatório.

### 2. Estrutura Recomendada de Dados no Smart Contract

- **Dados do lojista**: nome, CNPJ, endereço PIX, descrição, imagem/logo.
- **Catálogo de produtos/planos**: lista de IDs, nomes, preços, atributos e status.
- **Histórico de vendas**: eventos de compra, endereço do comprador, valor, timestamp.
- **NFTs emitidas**: mapeamento entre endereço do comprador e tokenId/plano adquirido.
- **Permissões**: regras de acesso à área restrita vinculadas à posse da NFT.

### 3. Fluxo de Usuário Baseado no Smart Contract

1. **Acesso ao hotsite**: O endereço do contrato define qual lojista está sendo exibido.
2. **Visualização de planos/produtos**: Dados lidos on-chain diretamente do contrato.
3. **Checkout**: Geração do QR Code PIX e registro da intenção de compra no contrato.
4. **Confirmação de pagamento**: Mint automático da NFT para o comprador, vinculado ao contrato do lojista.
5. **Acesso restrito**: Validação da posse da NFT emitida pelo contrato do lojista.

### 4. Vantagens do Modelo

- **Descentralização real**: Nenhum dado crítico fica dependente de backend tradicional.
- **Escalabilidade**: Suporte a múltiplos lojistas, cada um com seu contrato.
- **Transparência**: Todas as transações e emissões de NFT ficam públicas e auditáveis.
- **Facilidade de integração**: Qualquer frontend pode consumir os dados e fluxos a partir do endereço do contrato.

### 5. Recomendações Técnicas

- **Parametrize o endereço do contrato** em toda a aplicação (frontend, backend, APIs, hooks).
- **Utilize eventos do contrato** para atualizar dados em tempo real (ex: compras, mint de NFT).
- **Implemente fallback de leitura**: se o contrato não estiver disponível, exiba mensagem de erro clara.
- **Documente o ABI** do contrato para facilitar integrações futuras.

Esse modelo garante que toda a operação do hotsite, checkout, NFT e área restrita seja **100% dependente do endereço do smart contract do lojista**, promovendo segurança, transparência e escalabilidade para múltiplos lojistas e segmentos.
