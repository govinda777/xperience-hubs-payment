# Stack e Diretrizes do Projeto

## 1. Stack Tecnológica

| Camada         | Tecnologia                               | Observações                                                                 |
|----------------|------------------------------------------|-----------------------------------------------------------------------------|
| Frontend       | **Next.js**                              | Framework React para SSR e SSG.                                             |
| Autenticação   | **Auth0 + Privy**                        | Auth0 para autenticação centralizada. Privy para wallet e autenticação web3[1]. |
| Wallet & Web3  | **Privy SDK**                            | Integração fácil com wallets e usuários descentralizados via https://dashboard.privy.io/   |
| RPC Blockchain | **Alchemy RPC**                          | Comunicação com blockchain (ex: Ethereum) via endpoints da Alchemy.         |
| Backend        | **Vtex Lambda (Serverless Function)**     | APIs simples, integrações e lógica backend. Pode ser mockada/local.         |

## 2. Diretrizes de Arquitetura

### Organização do Projeto

- **Mono-repo (opcional):** Facilita gerenciar frontend, backend e utilitários juntos.
- **Componentização:** Utilizar componentes React reaproveitáveis e tipados.
- **Ambientes:** `.env.local` para variáveis de desenvolvimento locais; templates para staging/production.
- **Autenticação desacoplada:** Modulo dedicado para Auth0 + Privy, podendo trocar facilmente provedores.
- **Chaves/Secrets:** Nunca comitar em repositório; usar .env apenas local ou Vault seguro em prod.

### Local First

- **Execução local:** Todo o stack (Next.js, mock da Vtex Lambda, integração Auth0/Privy e Alchemy em modo sandbox/testnet) deve rodar localmente — garantir scripts para instalação/setup rápido.
- **Mocks/Fixtures:** Mockar integrações externas (ex: APIs Vtex, endpoints Auth0 & Privy) com fixtures ou ferramentas como MSW ou similar.
- **Testes:** Utilizar Jest/Testing Library para frontend e backend; scripts automáticos para rodar testes localmente.

### Integração com Blockchain

- **Privy SDK:** Seguir [documentação oficial](https://dashboard.privy.io/) [1] para wallet connect e autenticação.
- **Alchemy:** Usar endpoints e APIKEYs testnet; facilitar troca para mainnet apenas com variável de ambiente.

### Backend Vtex Lambda

- **Função única:** Centralizar lógica backend em uma função serverless simples.
- **Facilidade de mock:** Possibilidade de rodar local em dev, simulando todos fluxos necessários.
- **Escalabilidade:** Fácil deploy para produção se necessário, mas mantendo simplicidade local.

## 3. Recomendações

- **Documentação clara:** README completo com instruções de setup local, variáveis e fluxos principais.
- **Scripts de automação:** Scripts npm (ou yarn/pnpm) para `dev`, `build`, `test`, `mock` e `deploy`.
- **Padronização:** Eslint + Prettier integrados.
- **Facilidade de validação:** Ambiente local simula todas integrações elegíveis para developer experience fluida.

## 4. Exemplo de Estrutura de Pastas

```
/app            # código Next.js
/backend        # função(s) lambda mock/local
/utils
/public
.env.local.example
README.md
```

Essas práticas garantem que o projeto seja moderno, seguro, escalável e fácil de validar 100% localmente durante o desenvolvimento[1].

[1] https://dashboard.privy.io
