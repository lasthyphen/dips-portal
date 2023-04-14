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

      # Core units
      | Vistas | Core Units | ORA-001: Oracles                       | /dips/list?customViewName=Oracles%20Core%20Unit%20(ORA-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-ora-001)&_Archive=$AND(NOT(%23active),%23cu-ora-001)                           |
      | Vistas | Core Units | PE-001: Protocol Engineering           | /dips/list?customViewName=Protocol%20Engineering%20Core%20Unit%20(PE-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-pe-001)&_Archive=$AND(NOT(%23active),%23cu-pe-001)               |
      | Vistas | Core Units | RISK-001: Risk                         | dips/list?customViewName=Risk%20Core%20Unit%20(RISK-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-risk-001)&_Archive=$AND(NOT(%23active),%23cu-risk-001)                            |
      | Vistas | Core Units | RWF-001: Real-World Finance            | /dips/list?customViewName=Real%20World%20Finance%20Core%20Unit%20(RWF-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-rwf-001)&_Archive=$AND(NOT(%23active),%23cu-rwf-001)            |
      # TODO define if the redirect on cors navigation (from localhost to site url) is an spected behavior
      # | Vistas | Core Units | SAS-001: Sidestream Auction Services   | /dips/list?customViewName=Sidestream%20Auction%20Services%20Core%20Unit%20(SAS-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sas-001)&_Archive=$AND(NOT(%23active),%23cu-sas-001)     |
      | Vistas | Core Units | SES-001: Sustainable Ecosystem Scaling | /dips/list?customViewName=Sustainable%20Ecosystem%20Scaling%20Core%20Unit%20(SES-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-ses-001)&_Archive=$AND(NOT(%23active),%23cu-ses-001) |
      | Vistas | Core Units | SF-001: Strategic Finance              | /dips/list?customViewName=TechOps%20Core%20Unit%20(SF-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sf-001)&_Archive=$AND(NOT(%23active),%23cu-sf-001)                              |
      | Vistas | Core Units | SNE-001: StarkNet Engineering          | /dips/list?customViewName=StarkNet%20Engineering%20Core%20Unit%20(SNE-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sne-001)&_Archive=$AND(NOT(%23active),%23cu-sne-001)            |
      | Vistas | Core Units | SH-001: Strategic Happiness            | /dips/list?customViewName=Strategic%20Happiness%20Core%20Unit%20(SH-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sh-001)&_Archive=$AND(NOT(%23active),%23cu-sh-001)                |
      | Vistas | Core Units | TECH-001: TechOps                      | /dips/list?customViewName=TechOps%20Core%20Unit%20(TECH-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-tech-001)&_Archive=$AND(NOT(%23active),%23cu-tech-001)                        |
