# Documentação: Split de Pagamento PIX com QR Code Único

## Visão Geral

No **xperience-hubs-payment**, o pagamento via **PIX com Split** garante uma experiência simples para o usuário e automação financeira total para lojistas e a plataforma. Com apenas **um QR Code**, o pagamento efetuado pelo usuário é automaticamente dividido, distribuindo parte para o lojista e parte para a plataforma (taxa), sem a necessidade de duas operações distintas.

## Como Funciona o Split de Pagamento PIX

- **Pagamento Único:** O comprador realiza o pagamento utilizando apenas um QR Code, que já contém as regras de divisão (split).
- **Divisão Automática:** O valor é automaticamente dividido entre os recebedores definidos (ex: lojista e plataforma) na mesma liquidação.
- **Mint Condicional:** A NFT só é mintada após a confirmação do split bem-sucedido.

## Benefícios

- **Experiência fluida:** Apenas um pagamento para o cliente.
- **Conciliação automática:** Plataforma e lojista recebem seus valores diretamente.
- **Segurança:** Reduz fraudes e falhas operacionais.
- **Compliance:** Respeita regras fiscais e automatiza repasses.

## Plataformas e Gateways que Oferecem Split PIX

Para implementar o split, é necessário utilizar um gateway ou intermediário financeiro que suporte split nativo no PIX, como:

- Efí Bank[1][2]
- OpenPix[3]
- Pagar.me[4]
- Celcoin[5][6]

> Certifique-se de que cada recebedor (lojista e plataforma) tenha uma conta cadastrada no gateway escolhido.

## Resumo do Fluxo de Split de Pagamento PIX

1. **Usuário seleciona o produto/ingresso.**
2. **Sistema gera o QR Code com split configurado.**
3. **Usuário efetua o pagamento.**
4. **Gateway divide automaticamente os valores conforme a regra definida.**
5. **Confirmação de ambos os repasses (lojista + plataforma).**
6. **Mint da NFT é realizado.**

## Como Configurar o Split de Pagamento

O processo exato pode variar de acordo com o gateway, mas a lógica geral é similar.

### 1. Cadastro dos Recebedores

- Cada recebedor deve ter uma conta criada na plataforma/gateway intermediário.
- Uma conta será a do lojista, outra da plataforma para receber a taxa.

### 2. Definição das Regras de Split

- A regra pode ser em percentual, valor fixo, ou uma combinação.
- Exemplo: 10% para a plataforma, 90% para o lojista; ou R$ 10 fixos para a plataforma e o restante para o lojista[7][2].

### 3. Geração do QR Code com Split

A geração do QR Code é feita por integração via API do gateway. Um exemplo de corpo de requisição para criar uma cobrança com split pode ser:

```json
{
  "valor": "110.00",
  "recebedores": [
    {
      "id": "lojista_id",
      "valor": "100.00"
    },
    {
      "id": "plataforma_id",
      "valor": "10.00"
    }
  ],
  "descricao": "Compra de ingresso",
  "tipo_pagamento": "pix"
}
```

O gateway irá:

- Criar a cobrança PIX única com regras de split aplicadas.
- Retornar o QR Code (ou código copia-e-cola).

### 4. Processamento do Pagamento

- O usuário escaneia e paga o QR Code.
- O gateway processa e divide automaticamente conforme as regras.
- O backend do projeto consulta o status da cobrança até ambos os repasses estarem confirmados.

### 5. Validação e Mint da NFT

- Após ambos os repasses estarem OK, o mint da NFT é realizado e associada ao comprador.

## Exemplo de Integração Técnica

Cada gateway tem sua documentação (links recomendados ao final). Um exemplo padrão para integração via API pode seguir estes passos:

1. **Criar Recebedores**: cadastrar lojista e plataforma.
2. **Configurar Split**: definir regra por conta ou por transação[5][2].
3. **Criar Cobrança com Split**: enviar valor total e a configuração de repasse.
4. **Gerar QR Code**: o gateway retorna o QR Code para exibir ao usuário.
5. **Monitorar status**: via webhook ou consulta ativa, verificar se o split foi concluído.
6. **Mint NFT**: disparar o mint quando ambos os repasses estiverem 100% liquidados.

## Observações Fiscais

- Cada recebedor deve emitir nota fiscal de acordo com o valor recebido.
- O split não transfere obrigações tributárias entre as partes – cada um é responsável pelos seus tributos[1].

## Restrições Importantes

- Apenas gateways com suporte ao split PIX podem ser usados.
- O split só pode ser feito entre contas cadastradas na mesma plataforma/gateway.
- A divisão deve estar bem definida antes da transação.

## Referências Técnicas e Manuais

- [Efí Bank API Split Pix](https://dev.efipay.com.br/docs/api-pix/split-de-pagamento-pix/)[2]
- [OpenPix Split Pix](https://openpix.com.br/pix/split/)[3]
- [Transfeera Split Pagamentos Pix](https://transfeera.com/solucoes/split-de-pagamentos/)[7]
- [Celcoin Gateway com Split](https://www.celcoin.com.br/news/gateway-de-pagamento-com-split/)[6]
- Informações fiscais: [Efí Bank Split Pagamentos](https://sejaefi.com.br/blog/o-que-e-split-de-pagamento)[1]

## Checklist para Configuração

- [ ] Ter cadastro de lojista e plataforma no gateway.
- [ ] Configurar regra de split (percentual/valor).
- [ ] Integrar geração de cobrança PIX com split via API.
- [ ] Validar status de ambos os repasses.
- [ ] Só mintar NFT após split validado.
- [ ] Monitorar taxas e atualizar regras conforme necessário.

Essa abordagem garante a melhor experiência ao usuário e uma rotina financeira automatizada, transparente e segura para todos os envolvidos.

[1] https://sejaefi.com.br/blog/o-que-e-split-de-pagamento
[2] https://dev.efipay.com.br/docs/api-pix/split-de-pagamento-pix/
[3] https://openpix.com.br/pix/split/
[4] https://www.celcoin.com.br/news/gateway-de-pagamento-com-split/
[5] https://ajuda-celpayments.celcoin.com.br/post/219
[6] https://github.com/bacen/pix-api/discussions/243
[7] https://transfeera.com/solucoes/split-de-pagamentos/
[8] https://help.vtex.com/pt/tutorial/configurar-pix-como-meio-de-pagamento--5sbNavMSJY4jyLmLKRHiOf
[9] https://ajuda.vnda.com.br/pt-BR/articles/5992633-split-de-pagamento
[10] https://help.vtex.com/pt/tutorial/split-de-pagamento--6k5JidhYRUxileNolY2VLx
[11] https://vindi.com.br/formas-de-pagamentos/split-de-pagamento/
[12] https://docs.cielo.com.br/split/reference/criar-qr-code-pix-2
[13] https://tksgo.com.br/gateway-de-pagamento-integracao.php
[14] https://www.youtube.com/watch?v=6tufDyFGbaQ
[15] https://www.gerarpix.com.br
[16] https://www.cielo.com.br/split-de-pagamento/
[17] https://dev.efipay.com.br/docs/api-cobrancas/split-de-pagamento/
[18] https://docs.asaas.com/reference/obter-qr-code-para-pagamentos-via-pix
[19] https://www.pagbrasil.com/pt-br/servicos/split-de-pagamento/
[20] https://www.mercadopago.com.br/developers/pt/docs/split-payments/landing
