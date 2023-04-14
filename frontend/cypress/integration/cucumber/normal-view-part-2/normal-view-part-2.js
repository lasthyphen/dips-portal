/// <reference types="Cypress" />

Given("The user opens the main page", () => {
  cy.visit("");
});

When("The user opens all DIPs containing components", () => {
  cy.get("tr[data-cy=search-result]").each((row) => {
    if (row.find(".mat-button-wrapper > .arrow-wrapper").length >= 2) {
      row.find(".mat-button-wrapper > .arrow-wrapper")[0].click();
    }
  });
});

When("The user opens all components containing subproposals", () => {
  cy.get("tr[role=row].maker-element-subset-row").each((component) => {
    if (component.find("div.arrow-wrapper.rotate")) {
      component.click();
    }
  });
});

And("Find all request is mocked to return components instead",()=>{
  cy.intercept(
    {
      pathname: "/dips/findall",
    },
    {
      fixture: "dip4-components.json",
    }
  ).as("DIP components");
})

When("The user clicks the first subproposal in ascendent order", () => {
  let rows = [];
  cy.get("tr[role=row]").each((row) => {
    if (
      row.find("tbody").length === 0 &&
      (row.find("td").length > 1 || row.find("div.arrow-wrapper").length > 0)
    ) {
      rows.push(row);
    }
  });
  cy.wrap(rows).as("elementRows");

  cy.get("@elementRows").then((rows) => {
    let dipIdx = 0;
    let componentIdx = 0;
    let subporposalIdx = 0;

    function isDip(row) {
      return row[0].getAttribute("data-cy") === "search-result";
    }

    function isSubProposal(row) {
      return row[0].getAttribute("data-cy") === "subporposal-row";
    }

    let i = 0;
    for (; i < rows.length; i++) {
      if (isSubProposal(rows[i])) {
        subporposalIdx = i;
        break;
      } else if (isDip(rows[i])) dipIdx = i;
      else componentIdx = i;
    }

    let dipNumber = +rows[dipIdx].find("td")[0].innerText.trim();

    let ct = rows[componentIdx].find("td")[0].innerText.trim();
    let componentNumber = +ct.substring(ct.indexOf("c") + 1, ct.indexOf(":"));

    let subProposalNumber = subporposalIdx - componentIdx;

    cy.wrap(rows[subporposalIdx]).click();
    cy.wrap({ dipNumber, componentNumber, subProposalNumber }).as(
      "subProposalData"
    );
  });
});

Then(
  "The view page corresponding to selected Dip-Component-Subproposal should open",
  () => {
    cy.get("@subProposalData").then(
      ({ subProposalNumber, componentNumber, dipNumber }) => {
        cy.location().then((loc) => {
          cy.wrap(loc.pathname).should(
            "eq",
            `/dips/details/DIP${dipNumber}c${componentNumber}SP${subProposalNumber}`
          );
        });
      }
    );
  }
);

Then(
  "The open page should contain the title corresponding to Dip-Component-Subproposal",
  () =>
    cy
      .get("@subProposalData")
      .then(({ subProposalNumber, componentNumber, dipNumber }) => {
        cy.get("app-detail-content")
          .find("span.title-bold")
          .contains(
            `DIP${dipNumber}c${componentNumber}-SP${subProposalNumber}`
          );
      })
);

When("The user clicks the row corresponding to DIP {string}", (dipNumber) => {
  cy.get("tr[data-cy=search-result]")
    .filter(`:contains(DIP${dipNumber})`)
    .as("targetRow");
  cy.get("@targetRow")
    .find("td")
    .eq(1)
    .invoke("text")
    .then((text) => {
      cy.wrap(text).as("dipTitle"); // title of the dip
    });
  cy.get("@targetRow").click();
});

Then("The view page corresponding to DIP {string} should open", (dipNumber) => {
  cy.location().then((loc) => {
    cy.wrap(loc.pathname).should("eq", `/dips/details/DIP${dipNumber}`);
  });
});

Then("The open page should contain the title of DIP {string}", (dipNumber) => {
  cy.get("@dipTitle").then((title) => {
    const dipName = title;
    console.log(dipName);
    cy.get("app-detail-content").find("span.title").contains(dipName);
  });
});
