Feature: Normal view

  Background: Mock
    Given Backend data is set to be mocked

  Scenario:Main view should have all columns (english)
    Given The user opens the main page
    And The user selects "English" language
    Then The MIps list should have the given columns in English

  Scenario:Main view should have all columns (spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    Then The MIps list should have the given columns in Spanish

  Scenario: Main view should be initially be sorted by #
    Given The user opens the main page
    Then The DIPs list should be sorted by #

  Scenario: Sorting by title
    Given The user opens the main page
    When The user clicks the title column header
    Then The MIps list should be sorted by "title" "ascending"
    When The user clicks the title column header again
    Then The MIps list should be sorted by "title" "descending"

  Scenario: Sorting by status
    Given The user opens the main page
    When The user clicks the status column header
    Then The MIps list should be sorted by "status" "ascending"
    When The user clicks the status column header again
    Then The MIps list should be sorted by "status" "descending"

  Scenario: Loading more DIPs when scrolling
    And DIPs list is set to be mocked as a large list
    Given The user opens the main page
    Then The DIPs list should have length "10"
    And Loading plus component should not exist
    When The user scrolls to the bottom
    Then Loading plus component should appear for a moment
    And The DIPs list should have length "20"
    When The user scrolls to the bottom
    Then Loading plus component should appear for a moment
    And The DIPs list should have length "30"
