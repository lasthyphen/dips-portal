Feature: Normal view snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked

  ##-----------------DESKTOP-----------------------------

  Scenario: Global Snapshot
    And The viewport is fixed to 1536x600
    And The user opens the main page
    Then Global snapshot matches with image "normal-view/entire-view"

  Scenario Outline: Specific Snapshot
    And The viewport is fixed to 1536x600
    And The user opens the main page
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name   | selector                           | image                      |
      | Table  | [data-cy=table-list-dips]          | normal-view/dips-table     |
      | Header | [data-cy=table-list-dips] thead tr | normal-view/dip-row-header |
      | Row    | [data-cy=table-list-dips] tbody tr | normal-view/dip-row        |

  Scenario: DIP description
    And The viewport is fixed to 1536x600
    And The user opens the main page
    Then DIP description component matches snapshot with image "normal-view/dip-row-with-expanded-description"

  Scenario: DIP components
    And The viewport is fixed to 1536x600
    And The user opens the main page
    Then DIP component matches snapshot with image "normal-view/dip-row-with-expanded-components"

  #Dark Mode
  Scenario: Global Snapshot (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Dark mode is toggled
    Then Global snapshot matches with image "normal-view/entire-view-dark"

  Scenario Outline: Specific Snapshot (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name   | selector                           | image                           |
      | Table  | [data-cy=table-list-dips]          | normal-view/dips-table-dark     |
      | Header | [data-cy=table-list-dips] thead tr | normal-view/dip-row-header-dark |
      | Row    | [data-cy=table-list-dips] tbody tr | normal-view/dip-row-dark        |

  Scenario: DIP description (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Dark mode is toggled
    Then DIP description component matches snapshot with image "normal-view/dip-row-with-expanded-description-dark"

  Scenario: DIP components (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Dark mode is toggled
    Then DIP component matches snapshot with image "normal-view/dip-row-with-expanded-components-dark"

  #Spanish
  Scenario: Global Snapshot (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then Global snapshot matches with image "normal-view/entire-view-spanish"

  Scenario Outline: Specific Snapshot (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name   | selector                           | image                              |
      | Table  | [data-cy=table-list-dips]          | normal-view/dips-table-spanish     |
      | Header | [data-cy=table-list-dips] thead tr | normal-view/dip-row-header-spanish |
      | Row    | [data-cy=table-list-dips] tbody tr | normal-view/dip-row-spanish        |

  Scenario: DIP description (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then DIP description component matches snapshot with image "normal-view/dip-row-with-expanded-description-spanish"

  Scenario: DIP components (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then DIP component matches snapshot with image "normal-view/dip-row-with-expanded-components-spanish"

  ##-----------------MOBILE-----------------------------

  Scenario: Global Snapshot (Mobile)
    And The viewport is fixed to 375x667
    And The user opens the main page
    Then Global snapshot matches with image "normal-view/entire-view-mobile"

  Scenario Outline: Specific Snapshot (Mobile)
    And The viewport is fixed to 375x667
    And The user opens the main page
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name | selector          | image                      |
      | Row  | .mobile-container | normal-view/dip-row-mobile |

  Scenario: DIP description (Mobile)
    And The viewport is fixed to 375x667
    And The user opens the main page
    Then DIP description component matches snapshot with image "normal-view/dip-row-with-expanded-description-mobile" in mobile mode

  Scenario: DIP components (Mobile)
    And The viewport is fixed to 375x667
    And The user opens the main page
    Then DIP component matches snapshot with image "normal-view/dip-row-with-expanded-components-mobile" in mobile mode

  #Dark Mode
  Scenario: Global Snapshot (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Dark mode is toggled
    Then Global snapshot matches with image "normal-view/entire-view-dark-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name | selector          | image                           |
      | Row  | .mobile-container | normal-view/dip-row-dark-mobile |

  Scenario: DIP description (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Dark mode is toggled
    Then DIP description component matches snapshot with image "normal-view/dip-row-with-expanded-description-dark-mobile" in mobile mode

  Scenario: DIP components (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Dark mode is toggled
    Then DIP component matches snapshot with image "normal-view/dip-row-with-expanded-components-dark-mobile" in mobile mode

  #Spanish
  Scenario: Global Snapshot (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then Global snapshot matches with image "normal-view/entire-view-spanish-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name | selector          | image                              |
      | Row  | .mobile-container | normal-view/dip-row-spanish-mobile |

  Scenario: DIP description (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then DIP description component matches snapshot with image "normal-view/dip-row-with-expanded-description-spanish-mobile" in mobile mode

  Scenario: DIP components (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens the main page
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then DIP component matches snapshot with image "normal-view/dip-row-with-expanded-components-spanish-mobile" in mobile mode
