Feature: Shopping Cart Management
  As a marketplace customer
  I want to manage products in my cart
  So that I can review and adjust my purchase before finalizing

  Background:
    Given the cart system is working
    And there are products available in the marketplace
    And localStorage is available for persistence

  Scenario: Add product to empty cart
    Given the cart is empty
    And there is a product "T-Shirt" with price $50.00
    When the customer adds 2 units of the product to the cart
    Then the cart should contain 1 item
    And the item should have quantity 2
    And the cart total should be $100.00
    And the cart should be saved to localStorage

  Scenario: Add existing product to cart
    Given there is a product "T-Shirt" already in the cart with quantity 1
    When the customer adds 2 more units of the same product
    Then the cart should contain 1 item
    And the item quantity should be 3
    And the total should be updated to $150.00

  Scenario: Update product quantity in cart
    Given there is a product "T-Shirt" in the cart with quantity 2
    When the customer updates the quantity to 5
    Then the product quantity should be 5
    And the total should be updated to $250.00
    And changes should be saved to localStorage

  Scenario: Remove product from cart
    Given there are 2 different products in the cart
    When the customer removes one of the products
    Then the cart should contain only 1 product
    And the total should be recalculated
    And the removed product should not appear in the list

  Scenario: Clear cart completely
    Given there are 3 products in the cart
    When the customer clears the cart
    Then the cart should be empty
    And the total should be $0.00
    And localStorage should be cleared

  Scenario: Check if product is in cart
    Given there is a product "T-Shirt" in the cart
    When the system checks if the product is in the cart
    Then it should return true
    When the system checks a product that is not in the cart
    Then it should return false

  Scenario: Get specific product quantity
    Given there is a product "T-Shirt" in the cart with quantity 3
    When the system queries the product quantity
    Then it should return 3
    When querying a product that is not in the cart
    Then it should return 0

  Scenario: Cart with discounted products
    Given there is a product "Sneakers" with price $200.00 and 10% discount
    When the customer adds 1 unit to the cart
    Then the subtotal should be $200.00
    And the total with discount should be $180.00
    And the savings should be displayed as $20.00

  Scenario: Cart persistence between sessions
    Given the customer adds products to the cart
    And closes the browser
    When they open the browser again
    And access the site
    Then the cart should maintain the added products
    And quantities should be correct
    And totals should be updated

  Scenario: Cart with zero price product
    Given there is a free product "Free Sample"
    When the customer adds 3 units to the cart
    Then the total should remain $0.00
    But the product should appear in the cart
    And the quantity should be 3

  Scenario: Cart with out of stock product
    Given there is a product "Limited Product" with stock 0
    When the customer tries to add the product to the cart
    Then they should see message "Product unavailable"
    And the product should not be added to the cart

  Scenario: Update product data in cart
    Given there is a product in the cart
    When the product data is updated (price, name, etc.)
    And the cart is reloaded
    Then it should display the updated product data
    And totals should be recalculated
    And changes should be visible immediately