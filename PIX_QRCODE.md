## Validação de QR Code com Split PIX na Plataforma

A segurança e automação do split PIX dependem não só da geração correta do QR Code, mas também da validação eficiente por parte do backend para garantir que:

- O QR Code exibe o valor exato e contem as regras de split configuradas corretamente.
- Os beneficiários (lojista e plataforma) e suas porcentagens/valores estão corretos.
- A cobrança só avança para mintar a NFT se todos os critérios acima forem validados e liquidados.

### Como Validar o QR Code e o Split de Pagamento

#### 1. Validação Antes da Geração do QR Code

- Na etapa de geração do QR Code via API do gateway (Efí, OpenPix, Pagar.me etc.), a plataforma compõe cuidadosamente o payload:
  - **Recebedores:** IDs e contas dos beneficiários (ex: `lojista_id` e `plataforma_id`).
  - **Valores/Percentuais:** Quanto cada um irá receber.
  - **Valor Total:** Soma de produto/ingresso + fee da plataforma.
- Antes de exibir ao usuário, o backend pode:
  - Simular uma cobrança (“dry run”) ou validar a resposta do gateway.
  - Confirmar que os dados retornados (json do QR Code) batem com os valores e regras do split.

#### 2. Verificação da Cobrança Junto ao Gateway

- Ao criar a cobrança, o gateway normalmente retorna:
  - Dados do split (quem recebe quanto)
  - Status da cobrança (“awaiting”, “processing”, “paid” etc.)
  - Um “external_id” ou hash único para consulta e reconciliação posterior.
- A plataforma registra esses dados no seu banco para checagem.

#### 3. Auditando o QR Code

- Toda vez que precisar mostrar o QR Code (seja na tela, e-mail ou APP), a plataforma:
  - Busca o status e os dados do split diretamente na API do gateway usando o id da cobrança.
  - Valida:
    - Se o QR ainda está válido (não expirado ou cancelado)
    - Se os dados do split ainda são os configurados (usando endpoint como `/charges/:id/split` dependendo do gateway)
    - Se o valor total e recebedores correspondem ao esperado

#### 4. Validação Pós-Pagamento

- O backend consulta o gateway (via webhook ou polling periódico) até que ambas as liquidações do split estejam confirmadas:
  - “Recebedor 1: confirmado” e “Recebedor 2: confirmado”
- Só após essa dupla confirmação o mint da NFT é disparado.

#### 5. Detalhes Técnicos (Exemplo de Fluxo Simplificado)

```js
// Criar cobrança com split
const response = await gatewayApi.createCharge({
  valor: 110.00,
  recebedores: [
    { id: 'lojista_id', valor: 100.00 },
    { id: 'plataforma_id', valor: 10.00 }
  ],
  tipo_pagamento: 'pix'
});

// Validar cobrança retornada
assert(response.split[0].id === 'lojista_id');
assert(response.split[0].valor === 100.00);
assert(response.split[1].id === 'plataforma_id');
assert(response.split[1].valor === 10.00);
assert(response.valor === 110.00);

// Na tela: apresentar somente response.pix.qrcode
```

- Sempre que houver dúvida ou reconciliação, a plataforma pode revalidar a cobrança:
  - Chamando um endpoint de consulta (`GET /charges/:id`) e conferindo novamente os dados do split.

### Checklist de Segurança e Compliance

- [ ] Conferir dados de split em toda cobrança criada (antes de exibir QR Code).
- [ ] Registrar todos os IDs/recebedores e valores nos logs internos.
- [ ] Validar dados do QR Code e split antes e depois do pagamento.
- [ ] Mintar NFT só após confirmação real via status dos dois repasses no gateway.
- [ ] Rejeitar cobranças ou invalidar fluxos caso algum parâmetro do split seja alterado externamente.

### Observação Final

A validação contínua – do momento da criação do QR até a liquidação total do split PIX – garante a integridade financeira e a segurança da experiência para todos os envolvidos. A escolha de gateways confiáveis e a automação desse fluxo são cruciais para o sucesso do split no projeto xperience-hubs-payment.
