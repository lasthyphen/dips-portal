Feature: Menu interactions

  Background: Mocks
    Given Backend data is set to be mocked
    And Origin "https://dips.makerdao.com" is set to be mocked as baseUrl with alias "dips"
    And Origin "http://chat.makerdao.com" is set to be mocked as fake site with alias "chat"
    And Origin "https://forum.makerdao.com" is set to be mocked as fake site with alias "chat"


  Scenario Outline: Navigates to corresponding view wen clicking non-dropdown menu items
    Given The user opens the main page
    When Menu "<menu>" is open
    And Leaf menu item "<subMenu>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu         | subMenu                  | url                                                                                                                                        |
      | Learn        | Primer for Authors       | /dips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fdips%2Fmaster%2Fmeta%2Fprimer_for_authors%2Fprimer_for_authors.md |
      | Learn        | The DIPs Framework       | /dips/details/DIP0                                                                                                                         |
      | Learn        | Monthly Governance Cycle | /dips/details/DIP51                                                                                                                        |
      | Views        | DIP Sets                 | /dips/list?dipsetMode=true                                                                                                                 |
      | Views        | Living DIPs              | /dips/list?search=$AND(@Accepted,%23living)                                                                                                |
      | Views        | Processes                | /dips/list?search=$AND(%23process,@ACCEPTED)&orderDirection=ASC&hideParents=false                                                          |
      | Get in Touch | Forum                    | forum.makerdao.com/c/dips/                                                                                                                 |
      | Get in Touch | Chat                     | chat.makerdao.com                                                                                                                          |
