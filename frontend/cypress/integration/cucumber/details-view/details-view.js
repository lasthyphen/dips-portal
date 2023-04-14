/// <reference types="Cypress" />

Given("The user navigates to details view for dip {string}", (dipNumber) => {
  cy.visit(`/dips/details/DIP${dipNumber}`);
  cy.viewport("macbook-16");
  cy.get("div.maker-loading-shade ng-star-inserted").should("not.exist");
});

When("The user clicks the last entry in the content table", () => {
  cy.get("app-proposal-components a")
    .last()
    .then(($link) => {
      const id = $link.attr("id");
      const sectionName = id.substring(12);
      cy.wrap(sectionName).as("sectionName");
      cy.wait(300);
      cy.wrap($link).click({ force: true });
    });
});

Then("The section name should match the location hash", () => {
  cy.get("@sectionName").then((sectionName) => {
    cy.location("hash").invoke("substring", 1).should("equal", sectionName);
  });
});

Then("The view should scroll to the section", () => {
  cy.wait(1000);
  cy.get("@sectionName").then((sectionName) => {
    cy.window().then((win) => {
      const $section = Cypress.$(`#${sectionName}`);

      cy.wrap(!!$section).should("be.true");

      const elementTop = $section.offset().top;
      const elementBottom = elementTop + $section.outerHeight();

      const viewportTop = Cypress.$(win).scrollTop();
      const viewportBottom = viewportTop + Cypress.$(win).height();

      const isInViewPort =
        elementBottom > viewportTop && elementTop < viewportBottom;

      cy.wrap(isInViewPort).should("be.true");
    });
  });
});

When("The user scrolls to the header {string}", (headerNumber) => {
  cy.get("h2 a, h3 a")
    .eq(headerNumber)
    .then(($header) => {
      cy.scrollTo(0, $header[0].parentElement.offsetTop + 10);
      cy.wait(100);
      cy.scrollTo(0, $header[0].parentElement.offsetTop);
      cy.wait(100);
    });
});

Then("The location hash should match the header {string}", (headerNumber) => {
  cy.get("h2 a, h3 a")
    .eq(headerNumber)
    .then(($header) => {
      cy.location("hash").invoke("substring", 1).should("equal", $header[0].id);
    });
});

When("The user clicks the first tag in tags section", () => {
  cy.get("[data-cy=details-tags] a")
    .first()
    .then(($link) => {
      const tag = $link.text().trim();
      cy.wrap(tag).as("tag");
      cy.wrap($link).click({ force: true });
    });
});

Then(
  "The corresponding tag is filled into the search box preceded by a hash code",
  () => {
    cy.get("@tag").then((tag) => {
      cy.get("[data-cy=search-input]")
        .invoke("text")
        .invoke("trim")
        .should("equal", `$ #${tag}`);
    });
  }
);

When("The user clicks the first entry in authors section", () => {
  cy.get("[data-cy=author-item]")
    .first()
    .then(($item) => {
      const text = $item.text().trim();
      cy.wrap(text).as("authorText");
      cy.wrap($item).click();
    });
});

Then(
  "The url query parameter author is set to the previously selected author entry text",
  () => {
    cy.get("@authorText").then((text) => {
      cy.location("search").then((query) => {
        const search = new URLSearchParams(query);
        const author = search.get("author");
        cy.wrap(author).should("equal", text);
        cy.go("back");
      });
    });
  }
);

When("The user clicks the first entry in contributors section", () => {
  cy.get("[data-cy=contributor-item]")
    .first()
    .then(($item) => {
      const text = $item.text().trim();
      cy.wrap(text).as("contributorText");
      cy.wrap($item).click();
    });
});

When(
  "The url query parameter author is set to the previously selected contributor entry text",
  () => {
    cy.get("@contributorText").then((text) => {
      cy.location("search").then((query) => {
        const search = new URLSearchParams(query);
        const contributor = search.get("contributor");
        cy.wrap(contributor).should("equal", text);
        cy.go("back");
      });
    });
  }
);

When("The user places the mouse over dip {string} reference", (dipNumber) => {
  cy.get(`[id^=md-dip${dipNumber}]`).then(($link) => {
    cy.wrap($link).trigger("mouseover");
    const text = $link.text().trim();
    cy.wrap(text).as("externalDipName");
  });
});

Then("The popup about corresponding dip should appear in the page", () => {
  cy.get("@externalDipName").then((externalDipName) => {
    cy.get("section.preview")
      .find(".dipName")
      .contains(externalDipName)
      .should("be.visible");
  });
});

Then("The open popup about corresponding dip should contain a Summary", () => {
  cy.get("section.preview")
    .find(".dipComponenSumary")
    .should("be.visible");
});
