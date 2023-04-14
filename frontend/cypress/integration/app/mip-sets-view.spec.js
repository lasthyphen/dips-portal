/// <reference types="cypress" />

const dipsets = [
  'collateral-onboarding-dipset',
  'core-governance-dipset',
  'core-unit-framework-dipset'
];

const columns = ['pos', 'title', 'summary', 'status', 'link'];
const columnsHeadersSpanish = ['#', 'título', 'resumen', 'estado', 'enlaces'];
const columnsHeadersEnglish = ['#', 'title', 'summary', 'status', 'links']


function beforeAllTests(cb) {
  beforeEach(() => {
    cy.visit('');

    cy.get('[data-cy=menu-views]')
      .click()
      .get('[data-cy=menu-dipsets]')
      .click();

    cy.wait(2000);
    cy.window().then(win => {
      const url = `${win.location.pathname}${win.location.search}${win.location.hash}`;
      cy.visit(url);
    });

    cb && cb();
  });
}

function runTests(language) {
  it('All three rows of mispets are shown', () => {
    cy.wait(400)
    dipsets.forEach(dipset => {
      cy.get(`[data-cy=dipset-row-${dipset}]`)
        .should('exist')
        .invoke('hasClass', 'maker-expanded-row')
        .should('be.false');

      cy.wait(700);


      cy.get(`[data-cy=dipset-row-${dipset}]`).click();

      cy.wait(700);

      cy.get(`[data-cy=dipset-row-${dipset}]`)
        .invoke('hasClass', 'maker-expanded-row')
        .should('be.true');

      cy.get(`[data-cy=dipset-row-${dipset}]`).then($row => {
        cy.wrap($row.next()).find('tbody > tr.maker-element-row').then($tr => {
          columns.forEach(col => {
            cy.wrap($tr.children(`.mat-column-${col}`)).should('exist');
          })
        })
      });

      cy.get('.mat-table thead > tr > th').each(($th,$idx)=>{
          cy.wrap($th).invoke('text').should('contain',language === 'en' ? columnsHeadersEnglish[$idx]:columnsHeadersSpanish[$idx])
      })
    });
  });
}

describe('DIP Sets View', () => {
  beforeAllTests();
  runTests('en');
});

describe('DIP Sets View (Spanish)', () => {
  beforeAllTests(() => {
    cy.get('a.language-menu').click();

    cy.get('div.language-menu').find('app-menu').eq(0).click();
  });
  runTests('es');
});
