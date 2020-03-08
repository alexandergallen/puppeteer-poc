Feature: Cart
    Validation of cart functionality
    Background:
        Given I have opened "http://localhost"
    @only
    Scenario: Delete item from cart
        Given I have added an item to the cart
        When I open the cart
        And I delete the item
        Then The cart is empty
    Scenario: Cart contains correct items
        Given I have added an item to the cart
        When I open the cart
        Then The cart contains the correct item
    Scenario: Modify quantity of item in cart
        Given I have added an item to the cart
        When I open the cart
        And I add one more of the item
        Then There is "2" of the item
        And I remove one piece of the item
        Then There is "1" of the item
    @only
    Scenario: Checkout cart
        Given I have added an item to the cart
        When I open the cart
        And Click on Checkout
        Then Checkout works