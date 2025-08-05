Feature: Catálogo de Produtos
  Como um cliente do marketplace
  Eu quero visualizar e interagir com o catálogo de produtos
  Para que eu possa encontrar e comprar produtos de interesse

  Background:
    Given que o sistema de catálogo está funcionando
    And que existem produtos cadastrados no marketplace
    And que o sistema de filtros e busca está configurado

  Scenario: Visualização do catálogo de produtos
    Given que existem produtos disponíveis no marketplace
    When eu acesso a página do catálogo
    Then devo visualizar uma lista de produtos
    And cada produto deve exibir:
      | informação              | descrição                    |
      | imagem                  | Imagem do produto            |
      | nome                    | Nome do produto              |
      | preço                   | Preço formatado              |
      | descrição               | Descrição resumida           |
      | disponibilidade         | Status de estoque            |
      | badge_nft               | Indicador se gera NFT        |
    And devo poder navegar entre as páginas do catálogo

  Scenario: Busca de produtos por nome
    Given que existem produtos com nomes variados
    When eu digito "concert" no campo de busca
    And eu clico no botão de buscar
    Then devo visualizar apenas produtos que contenham "concert" no nome
    And a busca deve ser case-insensitive
    And devo ver a quantidade de resultados encontrados
    And devo poder limpar a busca para ver todos os produtos

  Scenario: Filtro por categoria de produto
    Given que existem produtos de diferentes categorias
    When eu seleciono a categoria "Eventos"
    Then devo visualizar apenas produtos da categoria "Eventos"
    And o filtro deve ser aplicado corretamente
    And devo poder combinar com outros filtros
    And devo poder remover o filtro aplicado

  Scenario: Filtro por faixa de preço
    Given que existem produtos com preços variados
    When eu defino a faixa de preço entre R$ 50,00 e R$ 200,00
    Then devo visualizar apenas produtos dentro da faixa de preço
    And os produtos devem estar ordenados por preço
    And devo ver a quantidade de produtos encontrados
    And devo poder ajustar a faixa de preço

  Scenario: Filtro por disponibilidade de NFT
    Given que existem produtos com e sem NFT
    When eu ativo o filtro "Apenas produtos com NFT"
    Then devo visualizar apenas produtos que geram NFT
    And cada produto deve exibir o badge de NFT
    And devo poder desativar o filtro

  Scenario: Ordenação de produtos
    Given que existem produtos com preços variados
    When eu seleciono ordenação por "Menor preço"
    Then os produtos devem ser exibidos do mais barato ao mais caro
    When eu seleciono ordenação por "Maior preço"
    Then os produtos devem ser exibidos do mais caro ao mais barato
    When eu seleciono ordenação por "Mais recentes"
    Then os produtos devem ser exibidos por data de criação

  Scenario: Visualização de detalhes do produto
    Given que existe um produto no catálogo
    When eu clico no produto para ver detalhes
    Then devo ser direcionado para a página de detalhes
    And devo visualizar informações completas:
      | informação              | descrição                    |
      | imagens                 | Galeria de imagens           |
      | nome                    | Nome completo do produto     |
      | descrição_detalhada     | Descrição completa           |
      | preço                   | Preço atual                  |
      | estoque                 | Quantidade disponível        |
      | categoria               | Categoria do produto         |
      | merchant                | Nome do merchant             |
      | configurações_nft       | Detalhes do NFT se aplicável |
    And devo poder adicionar o produto ao carrinho

  Scenario: Produto com estoque limitado
    Given que existe um produto com estoque baixo
    When eu visualizo o produto no catálogo
    Then devo ver um indicador de "Estoque limitado"
    And devo ver a quantidade exata disponível
    And devo ser alertado sobre a escassez

  Scenario: Produto esgotado
    Given que existe um produto sem estoque
    When eu visualizo o produto no catálogo
    Then devo ver o status "Esgotado"
    And o botão de adicionar ao carrinho deve estar desabilitado
    And devo poder ativar notificação de reabastecimento

  Scenario: Produto com desconto
    Given que existe um produto com desconto ativo
    When eu visualizo o produto no catálogo
    Then devo ver o preço original riscado
    And devo ver o preço com desconto destacado
    And devo ver a porcentagem de desconto
    And devo ver a economia em valor absoluto

  Scenario: Produto com múltiplas variações
    Given que existe um produto com variações (tamanho, cor, etc.)
    When eu visualizo o produto no catálogo
    Then devo ver as opções de variação disponíveis
    And devo poder selecionar diferentes variações
    And o preço deve ser atualizado conforme a variação
    And devo ver o estoque específico de cada variação

  Scenario: Produto com avaliações
    Given que existe um produto com avaliações de clientes
    When eu visualizo o produto no catálogo
    Then devo ver a média das avaliações (estrelas)
    And devo ver a quantidade de avaliações
    And devo poder clicar para ver todas as avaliações
    And devo ver as avaliações mais recentes

  Scenario: Produto com prazo de validade
    Given que existe um produto com prazo de validade
    When eu visualizo o produto no catálogo
    Then devo ver a data de validade
    And devo ser alertado se estiver próximo do vencimento
    And devo ver se o produto ainda é válido

  Scenario: Produto com restrições de acesso
    Given que existe um produto com restrições de acesso
    When eu visualizo o produto no catálogo
    Then devo ver as restrições aplicáveis
    And devo ver se preciso de NFT específico para comprar
    And devo ver se há limite de compra por usuário

  Scenario: Produto com informações de entrega
    Given que existe um produto físico
    When eu visualizo o produto no catálogo
    Then devo ver informações de entrega
    And devo ver o prazo estimado de entrega
    And devo ver as opções de frete disponíveis
    And devo ver se há frete grátis

  Scenario: Produto com informações de evento
    Given que existe um produto de evento
    When eu visualizo o produto no catálogo
    Then devo ver a data e horário do evento
    And devo ver o local do evento
    And devo ver informações sobre o evento
    And devo ver se o evento é presencial ou online 