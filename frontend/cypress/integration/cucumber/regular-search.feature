Feature: Regular Search

  Background: Mock
    Given Backend data is set to be mocked

  Scenario: Performing regular search (proposal)
    Given The user opens the main page
    And English language is selected
    When The user types 'proposal' in the search box
    And Hits Enter
    Then The list of DIPs should be visible
    And The dips should be requested with the search criteria "proposal"

  Scenario: Performing regular search (reference)
    Given The user opens the main page
    And English language is selected
    When The user types 'reference' in the search box
    And Hits Enter
    Then The list of DIPs should be visible
    And The dips should be requested with the search criteria "reference"

  Scenario: Performing DIPs search (DIP1)
    Given The user opens the main page
    When The user types DIP'1' in the search box
    And Hits Enter
    Then The list of DIPs should be visible
    And The dips should be requested with filter field "dipName" with value "DIP1"

  Scenario: Performing DIPs search (DIP2)
    Given The user opens the main page
    When The user types DIP'2' in the search box
    And Hits Enter
    Then The list of DIPs should be visible
    And The dips should be requested with filter field "dipName" with value "DIP2"

  Scenario: Performing DIPs search (DIP5)
    Given The user opens the main page
    When The user types DIP'5' in the search box
    And Hits Enter
    Then The list of DIPs should be visible
    And The dips should be requested with filter field "dipName" with value "DIP5"

