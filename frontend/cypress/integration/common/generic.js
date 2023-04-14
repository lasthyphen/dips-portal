/// <reference types="Cypress" />

And("The viewport is fixed to 1536x600", () => {
  cy.viewport(1536, 600);
});

And("The viewport is fixed to 375x667", () => {
  cy.viewport(375, 667);
});

And("{string} ms are past", (ms) => {
  cy.wait(+ms);
});

And("The page is reloaded", () => {
  cy.reload();
});

And("The user opens the main page", () => {
  cy.visit("");
});

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeMenuLang } = require("../../helpers/fake-menu-lang");
const { fakeDips } = require("../../helpers/fake-dips");
const { fakeDipSpecific } = require("../../helpers/fake-dip-specific");
const { fakeDipBy } = require("../../helpers/fake-dip-by");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");
const { fakeI18n } = require("../../helpers/fake-i18n");

And("Backend data is set to be mocked", () => {
  fakeVars();
  fakeNews();
  fakeDips();
  fakeDipSpecific();
  fakeDipBy();
  fakeMenu();
  fakeMenuLang();
  fakeI18n();
});

And("Vars data is set to be mocked in spanish", () => {
  fakeVars("es");
});

And("DIPs list is set to be mocked as a large list", () => {
  fakeDips(true);
});
