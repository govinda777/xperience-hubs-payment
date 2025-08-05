Feature: Gestão de Merchants
  Como um administrador da plataforma
  Eu quero gerenciar merchants e suas configurações
  Para que eu possa controlar o acesso e configurações dos lojistas

  Background:
    Given que o sistema de gestão de merchants está funcionando
    And que existem merchants cadastrados na plataforma
    And que o sistema de smart contracts está configurado

  Scenario: Cadastro bem-sucedido de novo merchant
    Given que um novo merchant solicita cadastro
    And que fornece os dados obrigatórios:
      | campo           | valor                    |
      | nome            | "Rock Concert Venue"     |
      | email           | "venue@concerts.com"     |
      | cnpj            | "12.345.678/0001-90"    |
      | pix_key         | "venue@concerts.com"     |
      | descrição       | "Local para shows"       |
    When o administrador aprova o cadastro
    And o sistema gera o smart contract do merchant
    Then o merchant deve ser criado com sucesso
    And um smart contract deve ser deployado
    And o merchant deve receber as credenciais de acesso
    And o status do merchant deve ser "ativo"

  Scenario: Atualização de dados do merchant
    Given que existe um merchant ativo na plataforma
    And que o merchant solicita atualização de dados
    When o administrador atualiza os dados:
      | campo           | valor_anterior           | valor_novo              |
      | nome            | "Rock Concert Venue"     | "Mega Concert Hall"     |
      | pix_key         | "venue@concerts.com"     | "mega@concerts.com"     |
      | descrição       | "Local para shows"       | "Arena para mega shows" |
    Then os dados devem ser atualizados no sistema
    And o smart contract deve ser atualizado
    And o merchant deve ser notificado das mudanças
    And o histórico de alterações deve ser registrado

  Scenario: Desativação de merchant
    Given que existe um merchant ativo na plataforma
    And que o merchant possui produtos ativos
    And que existem pedidos pendentes
    When o administrador desativa o merchant
    Then o status do merchant deve mudar para "inativo"
    And os produtos devem ser marcados como indisponíveis
    And os pedidos pendentes devem ser cancelados
    And o merchant deve ser notificado da desativação
    And o smart contract deve ser pausado

  Scenario: Reativação de merchant
    Given que existe um merchant inativo na plataforma
    And que o merchant solicita reativação
    When o administrador reativa o merchant
    Then o status do merchant deve mudar para "ativo"
    And os produtos devem ser reativados
    And o smart contract deve ser reativado
    And o merchant deve receber notificação de reativação

  Scenario: Configuração de split de pagamento
    Given que existe um merchant ativo na plataforma
    And que o merchant solicita alteração da taxa de split
    When o administrador configura a taxa de split em "3%"
    Then a nova taxa deve ser aplicada ao merchant
    And o smart contract deve ser atualizado
    And novos pagamentos devem usar a nova taxa
    And o merchant deve ser notificado da alteração

  Scenario: Visualização de métricas do merchant
    Given que existe um merchant ativo na plataforma
    And que o merchant possui histórico de vendas
    When o administrador acessa as métricas do merchant
    Then deve visualizar:
      | métrica                    | descrição                    |
      | total_vendas              | Valor total de vendas        |
      | total_pedidos             | Quantidade de pedidos        |
      | taxa_conversão            | Taxa de conversão            |
      | produtos_ativos           | Quantidade de produtos       |
      | nfts_emitidos             | Quantidade de NFTs emitidos  |
    And os dados devem estar atualizados em tempo real

  Scenario: Gestão de produtos do merchant
    Given que existe um merchant ativo na plataforma
    And que o merchant possui produtos cadastrados
    When o administrador acessa a gestão de produtos
    Then deve visualizar todos os produtos do merchant
    And deve poder aprovar/rejeitar novos produtos
    And deve poder editar produtos existentes
    And deve poder desativar produtos

  Scenario: Monitoramento de transações
    Given que existe um merchant ativo na plataforma
    And que o merchant possui transações recentes
    When o administrador acessa o monitoramento
    Then deve visualizar:
      | informação                | descrição                    |
      | transações_pendentes      | Pagamentos aguardando        |
      | transações_confirmadas    | Pagamentos confirmados       |
      | transações_falhadas       | Pagamentos que falharam      |
      | splits_processados        | Divisões de pagamento        |
    And deve poder investigar transações específicas

  Scenario: Configuração de notificações
    Given que existe um merchant ativo na plataforma
    When o administrador configura as notificações:
      | evento                    | canal                         |
      | novo_pedido              | email, sms                    |
      | pagamento_confirmado     | email, webhook                |
      | produto_aprovado         | email                         |
      | merchant_desativado      | email, sms                    |
    Then as notificações devem ser configuradas
    And o merchant deve receber notificações conforme configurado

  Scenario: Auditoria de ações do merchant
    Given que existe um merchant ativo na plataforma
    And que o merchant realiza ações no sistema
    When o administrador acessa o log de auditoria
    Then deve visualizar todas as ações realizadas:
      | ação                      | timestamp                     |
      | login                     | Data/hora do login           |
      | criação_produto           | Data/hora da criação          |
      | edição_produto            | Data/hora da edição           |
      | processamento_pagamento   | Data/hora do processamento   |
    And cada ação deve ter informações detalhadas

  Scenario: Backup e restauração de dados
    Given que existe um merchant ativo na plataforma
    And que o merchant possui dados importantes
    When o administrador solicita backup dos dados
    Then um backup completo deve ser gerado
    And deve incluir:
      | tipo_dado                 | descrição                    |
      | dados_merchant            | Informações do merchant      |
      | produtos                  | Catálogo de produtos         |
      | pedidos                   | Histórico de pedidos         |
      | transações                | Histórico de transações      |
      | nfts                      | NFTs emitidos                |
    And o backup deve ser armazenado de forma segura 