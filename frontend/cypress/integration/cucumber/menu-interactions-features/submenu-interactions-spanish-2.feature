Feature: Submenu interactions

  Background: Mocks
    Given Backend data is set to be mocked
    And Vars data is set to be mocked in spanish
    And Origin "https://dips.makerdao.com" is set to be mocked as baseUrl with alias "dips"
    And Origin "http://chat.makerdao.com" is set to be mocked as fake site with alias "chat"
    And Origin "https://forum.makerdao.com" is set to be mocked as fake site with alias "chat"

  #Spanish
  Scenario Outline: Submenu items navigate to the expected links
    Given The user opens the main page
    And The user selects "Spanish" language
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    And Leaf subMenu item "<subMenuItem>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu | subMenu | subMenuItem | url |

      # Estado
      | Vistas | Estado | RFC               | /dips/list?customViewName=RFC%20Status:%20Proposals%20Requesting%20Comments&search=$@RFC                                               |
      | Vistas | Estado | Formal Submission | /dips/list?customViewName=Formal%20Submission%20Status:%20Proposals%20formally%20submitted%20for%20voting&search=$@Formal%20Submission |
      | Vistas | Estado | Aceptada          | /dips/list?customViewName=Accepted%20Proposals&search=$@Accepted                                                                       |
      | Vistas | Estado | Obsoleta          | /dips/list?customViewName=Obsolete%20Proposals&search=$@Obsolete                                                                       |
      | Vistas | Estado | Rechazada         | /dips/list?customViewName=Rejected%20Proposals&search=$@Rejected                                                                       |
      | Vistas | Estado | Retirada          | /dips/list?customViewName=Withdrawn%20Proposals&search=$@Withdrawn                                                                     |

      # Técnicas
      | Vistas | Técnicas | Implementadas                | /dips/list?search=$AND(%23technical,%20NOT(%23pending-implementation))&subproposalsMode=false |
      | Vistas | Técnicas | Pendientes de Implementación | /dips/list?search=$AND(@accepted,%20%23pending-implementation)&subproposalsMode=false         |
