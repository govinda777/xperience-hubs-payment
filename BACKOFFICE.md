# BACKOFFICE.md

## Visão Geral

O backoffice do projeto **xperience hotsite payment** é o principal painel operacional para gerenciamento e monitoramento das transações, clientes, pedidos e integrações do pagamento dos lojistas. Esse documento detalha as funcionalidades, fluxo de uso e pontos importantes que orientam times de produto, operações, suporte e desenvolvimento sobre o funcionamento da ferramenta.

## Jornada do Lojista no Backoffice

A seguir, o passo a passo da experiência do lojista ao acessar e utilizar o backoffice:

### 1. Acesso ao Sistema

- O lojista realiza login com as credenciais fornecidas pela equipe de cadastro.
- O painel inicial exibe um dashboard com as principais métricas: volume de vendas, status de pagamentos, indicadores de performance e alertas de eventos críticos.

### 2. Consulta de Transações e Pedidos

- Menu “Transações” lista todas as vendas realizadas, podendo filtrar por:
  - Data
  - Status do pagamento (aprovado, pendente, recusado, estornado)
  - Valor
  - Forma de pagamento (Pix, cartão, boleto, etc.)
- É possível consultar detalhes de cada pedido, visualizar comprovantes, extrair relatórios em CSV/Excel e acionar suporte para casos específicos.

### 3. Gestão de Pagamentos

- O lojista pode acompanhar liquidações e extratos financeiros diretamente no módulo “Pagamentos”:
  - Visualizar histórico de repasses
  - Solicitar antecipação (se aplicável)
  - Conferir taxas e descontos aplicados por transação
- Detalhes bancários para recebimento podem ser atualizados conforme regras de segurança.

### 4. Integração e Configurações

- O painel permite configurar integrações com ERPs/sistemas próprios via API ou webhooks.
- Regras de notificação (e-mail, SMS) de sucessos/falhas em transações podem ser personalizadas pelo usuário.

### 5. Suporte e Disputas

- Canal direto para abertura de chamados técnicos ou operacionais.
- Gestão de contestações e chargebacks seguindo fluxos claros, com acompanhamento do status e prazo de resolução.

## Funcionalidades Essenciais

| Funcionalidade              | Descrição                                                                                               |
|-----------------------------|---------------------------------------------------------------------------------------------------------|
| Dashboard                   | KPIs principais, alertas, histórico de faturamento                                                     |
| Consulta de vendas          | Filtros avançados, exportação de relatórios, visualização detalhada de cada venda                       |
| Extrato financeiro          | Acompanhamento de repasses, taxas, e saldo                                                             |
| Configuração de integrações | API keys, webhooks, permissões e credenciais                                                           |
| Gerenciamento de usuários   | Inclusão/remoção de operadores, definição de níveis de acesso                                          |
| Suporte e disputas          | Registro, acompanhamento e resolução de solicitações técnicas/comerciais e contestações de pagamentos   |

## Boas Práticas

- Priorize clareza nas informações apresentadas ao lojista.
- Use dashboards interativos e relatórios visuais para simplificar decisões.
- Automação para notificações de eventos relevantes (pagamento aprovado, falha, disputa, etc.).
- Implemente trilha de auditoria para todas as ações realizadas no painel, garantindo transparência e segurança[1][2].

## Fluxos Técnicos (resumo)

1. **Entrada de nova transação**
   - Captura automática da venda pela API/webhook.
2. **Processamento financeiro**
   - Validação, repasse e conciliação automatizada.
3. **Controle de status**
   - Atualização em tempo real de pagamentos e alertas para pendências.
4. **Geração de relatórios**
   - Exportação e agendamento de relatórios conforme necessidade do lojista.

## Considerações Finais

O backoffice deve garantir autonomia, visibilidade e segurança ao lojista em todo o fluxo financeiro do hotsite, facilitando a jornada desde a venda até o recebimento dos valores, reduzindo dependência de contato com suporte operacional e promovendo agilidade no dia a dia.

Para a implementação detalhada, siga os padrões e exemplos práticos disponíveis no repositório de referência apontado pelo projeto.

[1] https://docs.mia-platform.eu/docs/runtime_suite_applications/payment-integration-hub/backoffice_payment
[2] https://www.linkedin.com/posts/cross-border-hub_payment-experience-inove-e-reduza-o-abandono-activity-7209525453873688577-slhK
[3] https://www.xperience-group.com/solutions/erp/contracts365-erp-construction-software/xperience-timesheet-portal/
[4] https://www.bankinghub.eu/innovation-digital/payments-back-office-automation
[5] https://www.prestashop.com/forums/topic/336601-back-office-not-creating-orders-after-successful-payment/
[6] https://docs.direct.worldline-solutions.com/en/design-and-test-tools/applications/back-office
[7] https://gist.github.com/geowulf/66cb4d882659d7fe219dafa92b9fd986
[8] https://payzer.com/solutions/back-office/
[9] https://journeytok.com/en/online-payments/
[10] https://github.com/hotspotty/documentation/blob/main/docs/features/payment-management/index.md
[11] https://www.pay.sibs.com/en/solutions/management-backoffice/
[12] https://transfeera.com/blog/payment-experience/
[13] https://test.ibanke-commerce.nbg.gr/api/documentation/integrationGuidelines/hostedCheckout/customizingPaymentExperience.html?locale=en_US
[14] https://www.blue3investimentos.com.br
[15] https://www.xperiencepoland.com/xp-faq/
[16] https://desenvolvedores.cielo.com.br/api-portal/en/content/online-payment
[17] https://praxis.tech
[18] https://tiinside.com.br/en/23/11/2016/o-que-fazer-para-garantir-que-tudo-de-certo-para-o-lojista-na-black-friday/
[19] https://developer.globalpay.com/ecommerce/hosted-solution/HPP-Guide
[20] https://openpos.tech
