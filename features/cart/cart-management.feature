Feature: Gerenciamento do Carrinho de Compras
  Como um cliente do marketplace
  Eu quero gerenciar produtos no meu carrinho
  Para que eu possa revisar e ajustar minha compra antes de finalizar

  Background:
    Given que o sistema de carrinho está funcionando
    And que existem produtos disponíveis no marketplace
    And que o localStorage está disponível para persistência

  Scenario: Adicionar produto ao carrinho vazio
    Given que o carrinho está vazio
    And que existe um produto "Camiseta" com preço R$ 50,00
    When o cliente adiciona 2 unidades do produto ao carrinho
    Then o carrinho deve conter 1 item
    And o item deve ter quantidade 2
    And o total do carrinho deve ser R$ 100,00
    And o carrinho deve ser salvo no localStorage

  Scenario: Adicionar produto já existente no carrinho
    Given que existe um produto "Camiseta" já no carrinho com quantidade 1
    When o cliente adiciona mais 2 unidades do mesmo produto
    Then o carrinho deve conter 1 item
    And a quantidade do item deve ser 3
    And o total deve ser atualizado para R$ 150,00

  Scenario: Atualizar quantidade de produto no carrinho
    Given que existe um produto "Camiseta" no carrinho com quantidade 2
    When o cliente atualiza a quantidade para 5
    Then a quantidade do produto deve ser 5
    And o total deve ser atualizado para R$ 250,00
    And as alterações devem ser salvas no localStorage

  Scenario: Remover produto do carrinho
    Given que existem 2 produtos diferentes no carrinho
    When o cliente remove um dos produtos
    Then o carrinho deve conter apenas 1 produto
    And o total deve ser recalculado
    And o produto removido não deve aparecer na lista

  Scenario: Limpar carrinho completamente
    Given que existem 3 produtos no carrinho
    When o cliente limpa o carrinho
    Then o carrinho deve estar vazio
    And o total deve ser R$ 0,00
    And o localStorage deve ser limpo

  Scenario: Verificar se produto está no carrinho
    Given que existe um produto "Camiseta" no carrinho
    When o sistema verifica se o produto está no carrinho
    Then deve retornar verdadeiro
    When o sistema verifica um produto que não está no carrinho
    Then deve retornar falso

  Scenario: Obter quantidade específica de produto
    Given que existe um produto "Camiseta" no carrinho com quantidade 3
    When o sistema consulta a quantidade do produto
    Then deve retornar 3
    When consulta um produto que não está no carrinho
    Then deve retornar 0

  Scenario: Carrinho com produtos com desconto
    Given que existe um produto "Tênis" com preço R$ 200,00 e 10% de desconto
    When o cliente adiciona 1 unidade ao carrinho
    Then o subtotal deve ser R$ 200,00
    And o total com desconto deve ser R$ 180,00
    And a economia deve ser exibida como R$ 20,00

  Scenario: Persistência do carrinho entre sessões
    Given que o cliente adiciona produtos ao carrinho
    And fecha o navegador
    When ele abre o navegador novamente
    And acessa o site
    Then o carrinho deve manter os produtos adicionados
    And as quantidades devem estar corretas
    And os totais devem estar atualizados

  Scenario: Carrinho com produto de preço zero
    Given que existe um produto gratuito "Amostra Grátis"
    When o cliente adiciona 3 unidades ao carrinho
    Then o total deve permanecer R$ 0,00
    But o produto deve aparecer no carrinho
    And a quantidade deve ser 3

  Scenario: Carrinho com produto esgotado
    Given que existe um produto "Produto Limitado" com estoque 0
    When o cliente tenta adicionar o produto ao carrinho
    Then deve ver mensagem "Produto indisponível"
    And o produto não deve ser adicionado ao carrinho

  Scenario: Atualização de dados do produto no carrinho
    Given que existe um produto no carrinho
    When os dados do produto são atualizados (preço, nome, etc.)
    And o carrinho é recarregado
    Then deve exibir os dados atualizados do produto
    And os totais devem ser recalculados
    And as alterações devem ser visíveis imediatamente