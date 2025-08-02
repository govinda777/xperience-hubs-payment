# NFT_ASSINING_CHECK.md

## Visão Geral

Este documento explica a estratégia de verificação por assinatura (“signing strategy”) utilizada no projeto **xperience-hubs-payment** para garantir a posse de uma NFT por um usuário autenticado via [Privy.io](https://privy.io). O objetivo é garantir que apenas o legítimo detentor da chave privada da carteira possa provar a posse de sua NFT em fluxos de autenticação seguros e auditáveis.

## Fluxo Geral

1. **Usuário autentica via Privy.io:**  
   O usuário faz login utilizando métodos oferecidos pelo Privy, podendo criar ou conectar uma wallet (EVM) vinculada à autenticação da plataforma[1][2].
2. **Desafio de assinatura (Signing Challenge):**  
   Após login, a aplicação gera uma mensagem única (challenge string) que será assinada pela carteira do usuário via os módulos de assinatura do Privy[3].
3. **Assinatura com chave privada:**  
   O usuário assina o challenge usando a wallet associada ao seu perfil Privy. O frontend utiliza a interface de assinatura do Privy (ou web3, como ethers.js), sem nunca expor a chave privada[3].
4. **Envio da assinatura ao backend:**  
   A assinatura e o endereço (public key) são enviados ao backend para validação.
5. **Verificação da assinatura:**  
   O backend valida se a assinatura corresponde à chave pública informada, e consulta o contrato inteligente para garantir que esta wallet realmente possui a NFT necessária (via `balanceOf` para ERC-721/1155).
6. **Autorização concluída:**  
   Estando tudo válido, o usuário é autenticado como legítimo detentor da NFT e recebe acesso ao recurso.

## Como Funciona a Validação Técnica

### 1. Geração do Challenge

- O servidor gera uma string única (ex: nonce, timestamp, contexto).
- Exemplo: `xperience-validate-2025-07-15T23:10Z-`

### 2. Assinatura usando Privy

- O frontend solicita ao Privy/Web3 a assinatura da mensagem pelo usuário[3].
- O componente personalizado de UI do Privy guia o usuário na assinatura.
- Nenhuma chave privada é exposta em nenhum momento.

### 3. Envio e Validação da Assinatura

- O usuário envia para o backend:
  - Endereço público (public key/wallet address)
  - Mensagem assinada (signature)
  - O challenge original
  
- O backend executa a validação:
  - Utiliza bibliotecas como ethers.js para executar `ethers.utils.verifyMessage(challenge, signature)`.
  - Confirma se a `public key` usada bate com o endereço autenticado.
  - Verifica on-chain se a carteira possui a NFT esperada.

### 4. Decisão de Autorização

- Se tudo for validado, o acesso/ação é permitido.
- Se houver qualquer falha, o acesso é negado.

## Exemplo de Fluxo (Pseudo-código)

```js
// Gerar challenge no backend
const challenge = `xperience-validate-${Date.now()}-${randomNonce()}`;

// Frontend solicita assinatura via Privy
const signature = await window.privy.signMessage(challenge);

// Backend valida assinatura
const signerAddress = ethers.utils.verifyMessage(challenge, signature);

if (signerAddress.toLowerCase() === userWalletAddress.toLowerCase()) {
    // Consulta smart contract: balanceOf(signerAddress) > 0
    // Permitir acesso se positivo
}
```

## Considerações de Segurança

- **Nunca** expor a chave privada do usuário.
- Utilizar apenas bibliotecas confiáveis de autenticação e assinatura (Ethers.js, Privy SDK).
- Gerar challenges únicos por requisição.
- Checar se o endereço realmente possui a NFT on-chain.
- Bloquear sessões após uso indevido ou tentativas inválidas repetidas.

## Integração com Privy.io

- O Privy provê UI e SDK para assinatura de mensagens/transações sem fricção para o usuário[1][3].
- Sessões podem ser temporárias e time-bound, aumentando a segurança por expiração automática de autorizações[4][2].
- O backend deve usar a public key do Privy como parte da verificação do JWT e das claims do usuário autenticado[4][2].

## Resumo Visual

| Etapa                     | Responsável | Descrição                                                                                 |
|---------------------------|-------------|------------------------------------------------------------------------------------------|
| Autenticação               | Usuário/Privy    | Login via Privy gerando wallet embutida/associada                                         |
| Geração de challenge       | Backend     | Criação da mensagem a ser assinada                                                        |
| Assinatura                 | Usuário/Privy    | Usuário assina o challenge pela UI do Privy                                               |
| Envio da assinatura        | Frontend    | Assinatura e address enviados ao backend                                                  |
| Validação backend          | Backend     | Verificação da assinatura e consulta on-chain da posse da NFT                             |
| Autorização concedida      | Backend     | Liberação do recurso se todas as etapas forem validadas                                   |

## Referências Técnicas

- [Privy Docs: UI components para assinatura e transação][3]
- [Privy Docs: user signers & Authorization Keys][4][2]
- [Privy Blog: Signers, Wallets e Embedded Wallets][1]
- [ECDSA Signature Verification com ethers.js][5]

**Qualquer dúvida adicional, consulte a documentação do Privy ou o repositório do projeto para integrações práticas e exemplos de código.**

[1] https://privy.io/blog/new-crypto-stack
[2] https://docs.privy.io/authentication/user-authentication/access-tokens
[3] https://docs.privy.io/wallets/using-wallets/ui-library
[4] https://docs.privy.io/wallets/using-wallets/user-signers/usage
[5] https://dev.to/rounakbanik/tutorial-digital-signatures-nft-allowlists-eeb
[6] https://www.privy.io
[7] https://docs.privy.io/guide/react/wallets/embedded/prompts/transact
[8] https://eips.ethereum.org/EIPS/eip-6066
[9] https://docs.privy.io/wallets/connectors/solana/sign-a-transaction
[10] https://docs.privy.io/security/authentication/authenticated-signers
[11] https://github.com/privy-io/privy-frames-demo
[12] https://github.com/privy-io/biconomy-example
[13] https://www.privy.io/gaming
[14] https://privy.io/blog
[15] https://docs.privy.io/api-reference/wallets/authenticate
[16] https://docs.privy.io/api-reference/authorization-signatures
[17] https://www.privy.io/onboarding
[18] https://docs.base.org/learn/onchain-app-development/account-abstraction/account-abstraction-on-base-using-privy-and-the-base-paymaster
[19] https://privy.io/blog/zerodev-partnership
[20] https://docs.privy.io/wallets/using-wallets/ethereum/send-a-transaction
