Feature: Processamento de Pagamento
  Como um cliente do marketplace
  Eu quero processar o pagamento do meu pedido
  Para que eu possa finalizar minha compra e receber os produtos/NFTs

  Background:
    Given que o sistema de pagamento está funcionando
    And que existe um merchant ativo com PIX configurado
    And que existe um pedido pendente de pagamento

  Scenario: Processamento bem-sucedido de pagamento PIX
    Given que existe um pedido com valor de R$ 100,00
    And que o merchant tem taxa de split de 5%
    When o cliente escolhe pagamento via PIX
    And o sistema processa o pagamento
    Then deve ser gerado um QR Code PIX válido
    And o valor deve ser dividido corretamente (R$ 95,00 para merchant, R$ 5,00 para plataforma)
    And o status do pedido deve mudar para "aguardando_pagamento"
    And o cliente deve ver as instruções de pagamento
    And deve ter um prazo de 30 minutos para pagamento

  Scenario: Processamento bem-sucedido de pagamento Crypto
    Given que existe um pedido com valor equivalente a 0.05 ETH
    And que o cliente tem uma carteira conectada
    When o cliente escolhe pagamento via Crypto
    And fornece o endereço da carteira "0x742d35Cc6634C0532925a3b8D0C"
    And confirma o valor de "0.05" ETH
    And o sistema processa o pagamento
    Then a transação deve ser registrada
    And o status do pedido deve mudar para "pago"
    And NFTs devem ser mintados se aplicável
    And o cliente deve receber confirmação da transação

  Scenario: Falha no processamento - Pedido não encontrado
    Given que não existe pedido com ID "pedido-inexistente"
    When o sistema tenta processar o pagamento
    Then deve retornar erro "Pedido não encontrado"
    And não deve processar nenhuma transação
    And deve logar o erro para auditoria

  Scenario: Falha no processamento - Merchant não encontrado
    Given que existe um pedido válido
    But o merchant foi desativado ou removido
    When o sistema tenta processar o pagamento
    Then deve retornar erro "Merchant não encontrado"
    And o status do pedido não deve ser alterado
    And o cliente deve ser notificado sobre o problema

  Scenario: Falha no processamento - Pedido já pago
    Given que existe um pedido com status "pago"
    When o sistema tenta processar o pagamento novamente
    Then deve retornar erro "Pedido já foi pago"
    And não deve gerar nova transação
    And deve manter o status atual do pedido

  Scenario: Falha no processamento - Dados crypto inválidos
    Given que existe um pedido válido
    When o cliente escolhe pagamento via Crypto
    But fornece endereço de carteira inválido "endereço-inválido"
    And o sistema tenta processar o pagamento
    Then deve retornar erro "Dados de pagamento crypto inválidos"
    And deve validar o formato do endereço
    And deve orientar o cliente sobre o formato correto

  Scenario: Falha no processamento - Valor crypto insuficiente
    Given que existe um pedido com valor equivalente a 0.05 ETH
    When o cliente escolhe pagamento via Crypto
    And fornece valor de apenas "0.01" ETH
    And o sistema tenta processar o pagamento
    Then deve retornar erro "Valor insuficiente para pagamento"
    And deve mostrar o valor mínimo necessário
    And deve permitir correção do valor

  Scenario: Processamento com NFT habilitado
    Given que existe um pedido com produto NFT
    And que o merchant tem NFT habilitado
    When o pagamento é processado com sucesso via Crypto
    Then NFTs devem ser mintados automaticamente
    And tokens devem ser associados ao pedido
    And o cliente deve receber os NFTs em sua carteira
    And metadados devem incluir informações do pedido