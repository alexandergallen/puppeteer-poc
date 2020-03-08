Feature: Filtering
    Validation of filtering functionality
    Background:
        Given I have opened "http://localhost"
    Scenario Outline: Filter items by size
        Given I have filtered the items by size "<size>"
        When I add the items to cart
        Then The items have the correct size "<size>"

    Examples:
        | size      |
        | XS        |
        | S         |
        | M         |
        | ML        |
        | L         |
        | XL        |
        | XXL       |