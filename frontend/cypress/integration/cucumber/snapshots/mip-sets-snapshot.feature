Feature: DIP sets snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked


  ##---------------------DESKTOP-----------------------

  Scenario: Global Snapshot
    And The viewport is fixed to 1536x600
    And The user opens DIP Sets view
    And The go-to-top button is removed from the view
    And DIP Set number "1" is open
    Then Global snapshot matches with image "dip-sets/entire-view"
    And DIP Set number "1" should match snapshot with image suffix "content"


  Scenario: Global Snapshot (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens DIP Sets view
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    And DIP Set number "1" is open
    Then Global snapshot matches with image "dip-sets/entire-view-dark"
    And DIP Set number "1" should match snapshot with image suffix "content-dark"

  Scenario: Global Snapshot (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens DIP Sets view
    And The go-to-top button is removed from the view
    And The user selects "Spanish" language
    And DIP Set number "1" is open
    Then Global snapshot matches with image "dip-sets/entire-view-spanish"
    And DIP Set number "1" should match snapshot with image suffix "content-spanish"

  ##---------------------MOBILE-----------------------

  Scenario: Global Snapshot (Mobile)
    And The viewport is fixed to 375x667
    And The user opens DIP Sets view
    And The go-to-top button is removed from the view
    And DIP Set number "1" is open in mobile mode
    Then Global snapshot matches with image "dip-sets/entire-view-mobile"
    And DIP Set number "1" should match snapshot with image suffix "content-mobile" in mobile mode


  Scenario: Global Snapshot (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens DIP Sets view
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    And DIP Set number "1" is open in mobile mode
    Then Global snapshot matches with image "dip-sets/entire-view-dark-mobile"
    And DIP Set number "1" should match snapshot with image suffix "content-dark-mobile" in mobile mode

  Scenario: Global Snapshot (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens DIP Sets view
    And The go-to-top button is removed from the view
    And The user selects "Spanish" language
    And DIP Set number "1" is open in mobile mode
    Then Global snapshot matches with image "dip-sets/entire-view-spanish-mobile"
    And DIP Set number "1" should match snapshot with image suffix "content-spanish-mobile" in mobile mode
