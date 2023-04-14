describe('Test Regular Search', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('should find MIps containing giving keywords', () => {
    const keywords = ["proposal"];

    keywords.forEach($word => {
      cy.visit('')

      cy.get('[data-cy=search-input]').type($word)
      cy.get('[data-cy=search-input]').type('{enter}')
      cy.get('[data-cy=table-list-dips]').should('be.visible')

      const rows = []

      cy.get('[data-cy=table-list-dips] tr.maker-element-row').each(($row) => {

        cy.wrap($row).find("a").then($link => {
          if (Cypress.$($link).hasClass('dipTitleList')) {
            const $href = Cypress.$($link).attr("href");
            rows.push($href);
          }
        });
      });

      cy.wrap(rows).each($row => {
        cy.visit($row);
        cy.get(".row.row-tree-column").contains($word,{matchCase:false});
      });
    })
  });

  it('should find MIps with the pattern DIP#', () => {
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    values.forEach(value => {
      cy.visit('')
      cy.get('[data-cy=search-input]').clear()
      cy.get('[data-cy=search-input]').type('DIP' + value)
      cy.get('[data-cy=search-input]').type('{enter}')

      cy.get('[data-cy=table-list-dips] tr.maker-element-row td.mat-column-pos').each(($col) => {
        cy.wrap($col).invoke('text').invoke('trim').should($text => {
          if ($text !== '' && $text !== '-1') {
            expect($text).to.contain(value);
          }
        })
      })
    })
  })
})
