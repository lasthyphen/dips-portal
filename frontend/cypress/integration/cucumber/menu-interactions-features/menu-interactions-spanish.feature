Feature: Menu interactions

  Background: Mocks
    Given Backend data is set to be mocked
    And Vars data is set to be mocked in spanish
    And Origin "https://dips.makerdao.com" is set to be mocked as baseUrl with alias "dips"
    And Origin "http://chat.makerdao.com" is set to be mocked as fake site with alias "chat"
    And Origin "https://forum.makerdao.com" is set to be mocked as fake site with alias "chat"

  #Spanish

  Scenario Outline: Navigates to corresponding view wen clicking non-dropdown menu items (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When Menu "<menu>" is open
    And Leaf menu item "<subMenu>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu              | subMenu                     | url                                                                                                                                        |
      | Aprende           | Intro para Autores          | /dips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fdips%2Fmaster%2Fmeta%2Fprimer_for_authors%2Fprimer_for_authors.md |
      | Aprende           | El Framework de DIP         | /dips/details/DIP0                                                                                                                         |
      | Aprende           | Ciclo de Gobernanza Mensual | /dips/details/DIP51                                                                                                                        |
      | Vistas            | DIP Sets                    | /dips/list?dipsetMode=true                                                                                                                 |
      | Vistas            | Propuestas Registrales      | /dips/list?search=$AND(@Accepted,%23living)                                                                                                |
      | Vistas            | Procesos                    | /dips/list?search=$AND(%23process,@ACCEPTED)&orderDirection=ASC&hideParents=false                                                          |
      | Ponte en Contacto | Foro                        | forum.makerdao.com/c/dips/                                                                                                                 |
      | Ponte en Contacto | Chat                        | chat.makerdao.com                                                                                                                          |
