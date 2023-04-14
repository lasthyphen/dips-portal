Feature: Submenu interactions                                                                                                          |

  Background: Mocks
    Given Backend data is set to be mocked
    And Origin "https://dips.makerdao.com" is set to be mocked as baseUrl with alias "dips"
    And Origin "http://chat.makerdao.com" is set to be mocked as fake site with alias "chat"
    And Origin "https://forum.makerdao.com" is set to be mocked as fake site with alias "chat"

  #Dark Mode
  Scenario Outline: Submenu items navigate to the expected links
    Given The user opens the main page
    And Dark mode is toggled
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    And Leaf subMenu item "<subMenuItem>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu | subMenu | subMenuItem | url |

      # Status
      | Views | Status | RFC               | /dips/list?customViewName=RFC%20Status:%20Proposals%20Requesting%20Comments&search=$@RFC                                               |
      | Views | Status | Formal Submission | /dips/list?customViewName=Formal%20Submission%20Status:%20Proposals%20formally%20submitted%20for%20voting&search=$@Formal%20Submission |
      | Views | Status | Accepted          | /dips/list?customViewName=Accepted%20Proposals&search=$@Accepted                                                                       |
      | Views | Status | Obsolete          | /dips/list?customViewName=Obsolete%20Proposals&search=$@Obsolete                                                                       |
      | Views | Status | Rejected          | /dips/list?customViewName=Rejected%20Proposals&search=$@Rejected                                                                       |
      | Views | Status | Withdrawn         | /dips/list?customViewName=Withdrawn%20Proposals&search=$@Withdrawn                                                                     |

      # Technical
      | Views | Technical | Implemented            | /dips/list?search=$AND(%23technical,%20NOT(%23pending-implementation))&subproposalsMode=false |
      | Views | Technical | Pending Implementation | /dips/list?search=$AND(@accepted,%20%23pending-implementation)&subproposalsMode=false         |
