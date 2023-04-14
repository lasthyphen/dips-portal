/// <reference types="cypress" />

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeDips } = require("../../helpers/fake-dips");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");


describe('Normal List View', () => {
  before(() => {
    fakeVars();
    fakeNews();
    fakeDips();
    fakeMenu();
    cy.viewport(1536, 600);
    cy.visit('');
  });

  it('Entire View', () => {
    Cypress.$('app-button-top').remove();
    cy.testScreenshot(null, 'normal-view/entire-view');
  });

  it('Table', () => {
    cy.testScreenshot('[data-cy=table-list-dips]', 'normal-view/dips-table');
  });

  it('Headers', () => {
    cy.get('[data-cy=table-list-dips] thead tr').first().then($el => {
      cy.testScreenshot($el, 'normal-view/dip-row-header')
    });
  });

  it('Row', () => {
    cy.get('[data-cy=table-list-dips] tbody tr').first().then($el => {
      cy.testScreenshot($el, 'normal-view/dip-row');
    });
  });

  it('DIP description', () => {
    cy.get('[data-cy=table-list-dips] tbody tr').first().then($tr => {
      cy.wrap($tr).find('td.mat-column-summary button').click();
      cy.testScreenshot($tr, 'normal-view/dip-row-with-expanded-description');
      cy.wrap($tr).find('td.mat-column-summary button').click();
    })
  });

  it('DIP components', () => {
    cy.get('[data-cy=table-list-dips] tbody tr').eq(4).then($tr => {
      cy.wrap($tr).find('td:first-child button').click();
      cy.testScreenshot($tr.next(), 'normal-view/dip-row-with-expanded-components');
    })
  });
});
