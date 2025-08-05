Feature: Validação de NFT para Controle de Acesso
  Como um usuário que possui NFTs
  Eu quero acessar conteúdo exclusivo baseado na posse de NFTs
  Para que eu possa desfrutar de benefícios exclusivos dos meus tokens

  Background:
    Given que o sistema de validação NFT está funcionando
    And que existem NFTs emitidas para diferentes produtos
    And que o sistema de autenticação por wallet está configurado

  Scenario: Validação bem-sucedida de posse de NFT
    Given que eu possuo um NFT do produto "VIP Concert Ticket"
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve verificar a posse do NFT on-chain
    And eu devo ter acesso concedido ao conteúdo exclusivo
    And minha sessão deve ser marcada como autenticada

  Scenario: Tentativa de acesso sem NFT
    Given que eu não possuo NFTs do produto "VIP Concert Ticket"
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve verificar a posse do NFT on-chain
    And o acesso deve ser negado
    And eu devo ver a mensagem "NFT necessário para acesso"

  Scenario: Validação com múltiplos NFTs do mesmo produto
    Given que eu possuo 3 NFTs do produto "VIP Concert Ticket"
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve verificar a posse dos NFTs on-chain
    And eu devo ter acesso concedido ao conteúdo exclusivo
    And o sistema deve registrar que eu possuo 3 tokens

  Scenario: Validação com NFT transferida para outra wallet
    Given que eu transferi meu NFT para outra wallet
    And que estou conectado com minha wallet original "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve verificar a posse do NFT on-chain
    And o acesso deve ser negado
    And eu devo ver a mensagem "NFT não encontrado nesta wallet"

  Scenario: Validação com NFT queimada (burned)
    Given que meu NFT foi queimado (burned)
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve verificar a posse do NFT on-chain
    And o acesso deve ser negado
    And eu devo ver a mensagem "NFT não está mais ativo"

  Scenario: Validação com problemas de conectividade blockchain
    Given que eu possuo um NFT válido
    And que estou conectado com minha wallet "0x123...abc"
    And que há problemas de conectividade com a blockchain
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve tentar verificar a posse do NFT on-chain
    And deve retornar erro de conectividade
    And eu devo ver a mensagem "Erro de conectividade. Tente novamente"

  Scenario: Validação com assinatura inválida
    Given que eu possuo um NFT válido
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu forneço uma assinatura inválida
    Then o sistema deve rejeitar a assinatura
    And o acesso deve ser negado
    And eu devo ver a mensagem "Assinatura inválida"

  Scenario: Validação de acesso a múltiplas áreas com diferentes NFTs
    Given que eu possuo NFTs de diferentes produtos:
      | produto           | quantidade |
      | VIP Concert       | 1          |
      | Backstage Pass    | 2          |
      | Merchandise Pack  | 0          |
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área "VIP Concert"
    And eu assino a mensagem de validação
    Then eu devo ter acesso concedido
    When eu tento acessar a área "Backstage Pass"
    And eu assino a mensagem de validação
    Then eu devo ter acesso concedido
    When eu tento acessar a área "Merchandise Pack"
    And eu assino a mensagem de validação
    Then o acesso deve ser negado

  Scenario: Validação com NFT expirada
    Given que eu possuo um NFT com data de expiração vencida
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve verificar a validade do NFT
    And o acesso deve ser negado
    And eu devo ver a mensagem "NFT expirado"

  Scenario: Validação com NFT de produto cancelado
    Given que eu possuo um NFT de um produto que foi cancelado
    And que estou conectado com minha wallet "0x123...abc"
    When eu tento acessar a área exclusiva do evento
    And eu assino a mensagem de validação
    Then o sistema deve verificar o status do produto
    And o acesso deve ser negado
    And eu devo ver a mensagem "Evento cancelado" 