/// <reference types="cypress" />

Given("The user opens md viewer for Dip 1 component 4 sub proposal", () => {
  cy.visit(
    "/dips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fdips%2Fmaster%2FDIP1%2FDIP1c4-Subproposal-Template.md"
  );
  cy.get(".maker-loading-shade").should("not.exist");
  cy.wait(1000);
});

Given("DIP4 github raw content is set to be mocked", () => {
  cy.intercept(
    "https://raw.githubusercontent.com/makerdao/dips/master/DIP1/DIP1c4-Subproposal-Template.md",
    { fixture: "dip4-raw.txt" }
  ).as('DIP4Raw');
});
