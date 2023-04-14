Feature: Submenu interactions

  Background: Mocks
    Given Backend data is set to be mocked
    And Origin "https://dips.makerdao.com" is set to be mocked as baseUrl with alias "dips"
    And Origin "http://chat.makerdao.com" is set to be mocked as fake site with alias "chat"
    And Origin "https://forum.makerdao.com" is set to be mocked as fake site with alias "chat"

  Scenario Outline: Submenu items navigate to the expected links
    Given The user opens the main page
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    And Leaf subMenu item "<subMenuItem>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu | subMenu | subMenuItem | url |

      # Core units
      | Views | Core Units | All (DIP38c2)                          | /dips/details/DIP38#dip38c2-core-unit-state                                                                                                                                                             |
      | Views | Core Units | Active Budgets                         | /dips/list?customViewName=Active%20Budgets&_DAI%20Budgets=$AND(%23active,%23dai-budget)&_MKR%20Budgets=$AND(%23active,%23mkr-budget)                                                                    |
      | Views | Core Units | CES-001: Collateral Engineering        | /dips/list?customViewName=Collateral%20Engineering%20Services%20Core%20Unit%20(CES-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-ces-001)&_Archive=$AND(NOT(%23active),%23cu-ces-001) |
      | Views | Core Units | COM-001: Governance Communications     | /dips/list?customViewName=Governance%20Communications%20Core%20Unit%20(COM-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-com-001)&_Archive=$AND(NOT(%23active),%23cu-com-001)         |
      | Views | Core Units | DAIF-001: Dai Foundation               | /dips/list?customViewName=Dai%20Foundation%20Core%20Unit%20(DAIF-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-daif-001)&_Archive=$AND(NOT(%23active),%23cu-daif-001)                 |
      | Views | Core Units | DIN-001: Data Insights                 | /dips/list?customViewName=Data%20Insights%20Core%20Unit%20(DIN-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-din-001)&_Archive=$AND(NOT(%23active),%23cu-din-001)                     |
      | Views | Core Units | DECO-001: Deco Fixed-Rate              | /dips/list?customViewName=Deco%20Fixed%20Rate%20Core%20Unit%20(DECO-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-deco-001)&_Archive=$AND(NOT(%23active),%23cu-deco-001)              |
      | Views | Core Units | DUX-001: Development and UX            | /dips/list?customViewName=Development%20and%20UX%20Core%20Unit%20(DUX-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-dux-001)&_Archive=$AND(NOT(%23active),%23cu-dux-001)              |
      | Views | Core Units | EVENTS-001: Events                     | /dips/list?customViewName=Development%20and%20UX%20Core%20Unit%20(DUX-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-events-001)&_Archive=$AND(NOT(%23active),%23cu-events-001)        |
      | Views | Core Units | GOV-001: Governance                    | /dips/list?customViewName=GovAlpha%20Core%20Unit%20(GOV-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-gov-001)&_Archive=$AND(NOT(%23active),%23cu-gov-001)                            |
      | Views | Core Units | GRO-001: Growth                        | /dips/list?customViewName=Growth%20Core%20Unit%20(GRO-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-gro-001)&_Archive=$AND(NOT(%23active),%23cu-gro-001)                              |
      | Views | Core Units | IS-001: Immunefi Security              | /dips/list?customViewName=Immunefi%20Security%20Core%20Unit%20(IS-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-is-001)&_Archive=$AND(NOT(%23active),%23cu-is-001)                    |
