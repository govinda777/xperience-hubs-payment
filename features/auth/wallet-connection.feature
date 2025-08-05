Feature: Wallet Connection
  As a user
  I want to connect my Web3 wallet
  So that I can access blockchain features and sign transactions

  Background:
    Given the wallet system is available
    And MetaMask is installed in the browser
    And the user is on the wallet connection page

  Scenario: Successful wallet connection
    Given the user clicks the "Connect Wallet" button
    When MetaMask prompts for connection
    And the user approves the connection
    Then the wallet should be connected
    And the wallet address should be displayed
    And the wallet balance should be shown
    And the connection status should be "Connected"

  Scenario: Failed wallet connection
    Given the user clicks the "Connect Wallet" button
    When MetaMask prompts for connection
    And the user rejects the connection
    Then the wallet should remain disconnected
    And an error message should be displayed
    And the connection status should be "Disconnected"

  Scenario: Wallet disconnection
    Given the wallet is connected
    When the user clicks the "Disconnect" button
    Then the wallet should be disconnected
    And the wallet address should be cleared
    And the connection status should be "Disconnected"

  Scenario: Message signing
    Given the wallet is connected
    When the user is prompted to sign a message
    And the user approves the signature
    Then the message should be signed successfully
    And the signature should be returned

  Scenario: Failed message signing
    Given the wallet is connected
    When the user is prompted to sign a message
    And the user rejects the signature
    Then the signature should fail
    And an error message should be displayed

  Scenario: Network switching
    Given the wallet is connected to Ethereum mainnet
    When the user switches to Sepolia testnet
    Then the network should be switched successfully
    And the chain ID should be updated
    And the balance should be refreshed

  Scenario: Account change detection
    Given the wallet is connected
    When the user switches accounts in MetaMask
    Then the wallet address should be updated
    And the balance should be refreshed
    And the connection should remain active

  Scenario: Network change detection
    Given the wallet is connected
    When the user switches networks in MetaMask
    Then the chain ID should be updated
    And the balance should be refreshed
    And the connection should remain active

  Scenario: Wallet not installed
    Given MetaMask is not installed
    When the user tries to connect a wallet
    Then an error message should be displayed
    And the user should be prompted to install MetaMask

  Scenario: Connection timeout
    Given the user clicks the "Connect Wallet" button
    When MetaMask takes too long to respond
    Then the connection should timeout
    And an error message should be displayed
    And the connection status should be "Failed" 