Feature: Sorting
    Validation of all sorting methods
    Background:
        Given I have opened "http://localhost:3000"
    Scenario: Order by price ascending
        Given I have ordered the items by "ascending"
        When The items are ordered
        Then The items are properly ordered

    Scenario: Order by price descending
        Given I have ordered the items by "descending"
        When The items are ordered
        Then The items are properly ordered