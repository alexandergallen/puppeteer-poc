Feature: Sorting
    Validation of all sorting methods
    Background:
        Given I have opened "http://localhost"
    Scenario Outline: Order by sorting methods
        Given I have ordered the items by "<sortingMethod>"
        Then The items are properly ordered by "<sortingMethod>"

    Examples:
    | sortingMethod |
    | lowestprice   |
    | highestprice  |