
## Como a NFT é Gerada no Xperience Hotsite Paymente

No projeto **xperience-hubs-payment**, a geração da NFT ocorre de forma automatizada no momento em que um cliente realiza uma compra de produto ou ingresso utilizando o Pix. Funciona assim:

- **Ação de Compra:** O cliente escolhe um produto/evento e faz o pagamento via Pix diretamente pela plataforma.
- **Confirmação de Pagamento:** O backend do sistema, integrado ao Pix, identifica a confirmação instantânea do pagamento.
- **Deploy Automático de Smart Contract:** Um smart contract específico da loja é disparado automaticamente, responsável por registrar a transação e gerar a NFT.
- **Emissão da NFT:** Utilizando padrões compatíveis (ERC-721/1155), a NFT é criada e associada diretamente à carteira (address) do comprador, servindo como comprovante ou ingresso digital.
- **Entrega da NFT:** A NFT é enviada para o endereço público informado/cadastrado pelo cliente. Se for um evento, por exemplo, essa NFT será o ingresso digital único, registrado de maneira imutável na blockchain.

**Resumo do fluxo:**
1. Usuário paga via Pix;
2. Pagamento confirmado;
3. Smart contract faz a emissão da NFT na blockchain;
4. Comprador recebe a NFT como comprovante/ingresso.

## Autenticação com Chave Pública (public key) e Estratégia de Assinatura

A autenticação baseada em NFT no sistema utiliza o endereço público (public key) associado à carteira do usuário—usando uma estratégia de assinatura (“signing strategy”). Esse mecanismo garante que apenas o verdadeiro dono daquela carteira possa validar posse da NFT/ingresso.

### Como funciona:

- **Autenticação Wallet-Based:** Para acessar áreas restritas, validar o ingresso ou obter conteúdos exclusivos, o usuário precisa autenticar-se utilizando sua carteira digital.
- **Assinatura Criptográfica:** O sistema desafia o usuário a assinar uma mensagem (challenge string) usando a chave privada de sua wallet. Isso não expõe a chave privada, apenas prova a posse da carteira.
- **Verificação:** O backend valida a assinatura com base na chave pública (public key) fornecida, garantindo que ela pertence de fato ao mesmo endereço que possui a NFT registrada no smart contract.
- **Consulta On-chain:** O sistema consulta o contrato inteligente para verificar (via função como `balanceOf` para ERC-721) se o endereço autenticado realmente detém a NFT em questão.
- **Acesso:** Caso o resultado seja positivo, o sistema libera o acesso, valida ingresso, ou permite consumo de conteúdos restritos[1].

### Pontos Técnicos Fundamentais

- O sistema utiliza bibliotecas de autenticação web3 (como Web3.js/Ethers.js) para o fluxo de assinatura e verificação.
- O padrão ERC-721/1155 garante unicidade e auditabilidade pública do ingresso/comprovante.
- A estratégia é “non-custodial”—o usuário nunca compartilha sua chave privada, apenas assina desafios pontuais[1].

## Exemplo Prático da Autenticação

1. Usuário acessa a área de validação e conecta sua wallet.
2. O backend gera um texto aleatório (challenge) para o usuário assinar.
3. O usuário assina o challenge via wallet (ex: Metamask, TrustWallet).
4. A plataforma valida a assinatura e checa se o endereço contém a NFT esperada.
5. Acesso/autorização concedida caso positivo.

## Vantagens do Modelo

- **Segurança:** Ninguém pode falsificar a posse do ingresso/NFT.
- **Usabilidade:** Autenticação ágil via carteira, sem senhas.
- **Privacidade:** Chave privada nunca transita pela internet.
- **Imutabilidade:** A comprovação fica registrada na blockchain.

Esse fluxo traz ao Xperience Hotsite Paymente uma camada extra de confiança e automação, dispensando validações manuais e permitindo experiências digitais exclusivas e seguras para lojistas e compradores[1].

[1] https://github.com/yuuko-eth/passport-nft
[2] https://github.com/govinda777/xperience-hubs-payment
[3] https://thehub.io/funding/nft-ventures
[4] https://github.com/yllvar/Mint-Generative-Ai-Nft
[5] https://digital-client-solutions.hoganlovells.com/resources/blockchain/consumer-nft-guide/jurisdiction/italy
[6] https://www.avax.network/about/nfts
[7] https://www.gdf.io/gdf-hubs/
[8] https://github.com/Loxe-Inc/F7-NFT-based-authentication
[9] https://peiko.space/blog/article/how-to-create-nft-marketplace
[10] https://forum.polkadot.network/t/decentralized-futures-asset-hub-nft-development/5142
[11] https://rocknblock.io/blog/nft-development-from-idea-to-launch-in-8-steps
[12] https://missioncontrol.pitchmyspace.com/3d-virtual-nft-hubs-and-metaverses
[13] https://navigate.visa.com/europe/future-of-money/how-nfts-can-revolutionise-social-commerce/
[14] https://docs.chaingpt.org/ai-tools-and-applications/ai-nft-generator
[15] https://github.com/aptos-labs/aptos-core/issues/566
[16] https://digitalagencynetwork.com/tools/nft-generator/
[17] https://www.rapidinnovation.io/post/how-non-fungible-tokens-nft-marketplaces-are-built
[18] https://www.youtube.com/watch?v=32l6ntdBWTs
[19] https://portal.productboard.com/chia-network/8-chia-product-roadmap/c/76-verifiable-credentials-experience-gui
[20] https://cointelegraph.com/news/web3-travel-app-turns-regional-experiences-into-mintable-nfts
[21] https://docs.polkadot.com/tutorials/polkadot-sdk/parachains/zero-to-hero/deploy-to-testnet/
