Feature: Product Card Component
  As a customer
  I want to view product information in a card format
  So that I can quickly understand product details and make purchase decisions

  Background:
    Given the product catalog is loaded
    And the shopping cart is available
    And the user is authenticated

  Scenario: Display product information correctly
    Given there is a product "Premium T-Shirt" with price $50.00
    And the product has a description "High quality cotton t-shirt"
    And the product has an image "https://example.com/tshirt.jpg"
    When the product card is rendered
    Then the product name should be displayed as "Premium T-Shirt"
    And the product price should be displayed as "$50.00"
    And the product image should be visible
    And the product description should be shown

  Scenario: Add product to cart from card
    Given there is a product "Premium T-Shirt" available for purchase
    And the product is in stock
    When the user clicks the "Add to Cart" button
    Then the product should be added to the cart
    And the cart count should be updated
    And a success message should be displayed

  Scenario: Product with discount
    Given there is a product "Premium T-Shirt" with original price $60.00
    And the product has a 20% discount
    When the product card is rendered
    Then the original price should be displayed as "$60.00"
    And the discounted price should be displayed as "$48.00"
    And the discount percentage should be shown as "20% OFF"
    And the original price should be crossed out

  Scenario: Product out of stock
    Given there is a product "Premium T-Shirt" that is out of stock
    When the product card is rendered
    Then the "Add to Cart" button should be disabled
    And an "Out of Stock" label should be displayed
    And the product should be visually marked as unavailable

  Scenario: Product with limited stock
    Given there is a product "Premium T-Shirt" with only 3 items in stock
    When the product card is rendered
    Then a "Limited Stock" indicator should be displayed
    And the remaining quantity should be shown as "Only 3 left"
    And the "Add to Cart" button should be enabled

  Scenario: Product with NFT badge
    Given there is a product "Premium T-Shirt" that includes an NFT
    When the product card is rendered
    Then an "NFT Included" badge should be displayed
    And the badge should have an appropriate icon
    And the badge should be prominently visible

  Scenario: Product with free shipping
    Given there is a product "Premium T-Shirt" with free shipping
    When the product card is rendered
    Then a "Free Shipping" badge should be displayed
    And the badge should be visually distinct

  Scenario: Product with rating and reviews
    Given there is a product "Premium T-Shirt" with 4.5 stars rating
    And the product has 128 reviews
    When the product card is rendered
    Then the star rating should be displayed as 4.5 stars
    And the review count should be shown as "(128 reviews)"
    And the stars should be visually represented

  Scenario: Product with multiple images
    Given there is a product "Premium T-Shirt" with multiple images
    When the product card is rendered
    Then the main product image should be displayed
    And image navigation arrows should be visible
    And the user should be able to navigate between images

  Scenario: Product with size variants
    Given there is a product "Premium T-Shirt" with size variants
    And sizes S, M, L, XL are available
    When the product card is rendered
    Then size options should be displayed
    And the user should be able to select a size
    And the selected size should be highlighted

  Scenario: Product with color variants
    Given there is a product "Premium T-Shirt" with color variants
    And colors Red, Blue, Green are available
    When the product card is rendered
    Then color options should be displayed
    And the user should be able to select a color
    And the selected color should be highlighted

  Scenario: Quick view product details
    Given there is a product "Premium T-Shirt" with detailed information
    When the user clicks the "Quick View" button
    Then a modal should open with detailed product information
    And the modal should contain full product description
    And the modal should show all available variants
    And the modal should have an "Add to Cart" button

  Scenario: Product with countdown timer
    Given there is a product "Premium T-Shirt" with a limited time offer
    And the offer expires in 2 hours
    When the product card is rendered
    Then a countdown timer should be displayed
    And the timer should show the remaining time
    And the timer should update in real-time

  Scenario: Product with wishlist functionality
    Given there is a product "Premium T-Shirt" that can be added to wishlist
    When the user clicks the heart icon
    Then the product should be added to the wishlist
    And the heart icon should be filled
    And a confirmation message should be displayed

  Scenario: Product with share functionality
    Given there is a product "Premium T-Shirt" that can be shared
    When the user clicks the share button
    Then sharing options should be displayed
    And the user should be able to share via social media
    And the user should be able to copy the product link 