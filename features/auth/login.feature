Feature: Autenticação de Usuário
  Como um usuário do sistema
  Eu quero fazer login na plataforma
  Para que eu possa acessar minha conta e gerenciar minha loja

  Background:
    Given que o sistema de autenticação está funcionando
    And que existem usuários cadastrados no sistema

  Scenario: Login bem-sucedido com email e senha
    Given que existe um usuário com email "lojista@example.com" e senha "senha123"
    And que o usuário está na página de login
    When ele preenche o campo email com "lojista@example.com"
    And ele preenche o campo senha com "senha123"
    And ele clica no botão "Entrar"
    Then ele deve ser redirecionado para o dashboard
    And deve ver a mensagem "Bem-vindo de volta!"
    And sua sessão deve estar ativa

  Scenario: Login bem-sucedido com carteira Web3
    Given que o usuário possui uma carteira MetaMask configurada
    And que o usuário está na página de login
    When ele clica no botão "Conectar Carteira"
    And ele aprova a conexão na carteira
    Then ele deve ser redirecionado para o dashboard
    And deve ver seu endereço de carteira no header
    And sua sessão deve estar ativa

  Scenario: Falha no login com credenciais inválidas
    Given que o usuário está na página de login
    When ele preenche o campo email com "usuario@inexistente.com"
    And ele preenche o campo senha com "senhaerrada"
    And ele clica no botão "Entrar"
    Then deve ver a mensagem de erro "Credenciais inválidas"
    And deve permanecer na página de login
    And os campos devem ser limpos

  Scenario: Falha no login com campos obrigatórios vazios
    Given que o usuário está na página de login
    When ele deixa o campo email vazio
    And ele deixa o campo senha vazio
    And ele clica no botão "Entrar"
    Then deve ver mensagens de validação nos campos obrigatórios
    And o botão "Entrar" deve permanecer desabilitado

  Scenario: Falha na conexão da carteira Web3
    Given que o usuário está na página de login
    And que não há carteira instalada no navegador
    When ele clica no botão "Conectar Carteira"
    Then deve ver a mensagem "Carteira não encontrada"
    And deve ser orientado a instalar uma carteira
    And deve permanecer na página de login

  Scenario: Toggle de visibilidade da senha
    Given que o usuário está na página de login
    When ele preenche o campo senha com "minhasenha"
    Then a senha deve estar oculta por padrão
    When ele clica no ícone do olho
    Then a senha deve ficar visível
    When ele clica no ícone do olho novamente
    Then a senha deve ficar oculta novamente