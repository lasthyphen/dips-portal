/// <reference types="Cypress" />
import jsYaml from "js-yaml";

Given("The corresponding yaml values are read", () => {
  cy.fixture("fakeNews.yaml").then((news) => {
    cy.wrap(jsYaml.load(news)).as("news");
  });
  cy.fixture("vars.yaml").then((vars) => {
    cy.wrap(jsYaml.load(vars)).as("vars");
  });
});

Given("The corresponding yaml values are read in spanish", () => {
  cy.fixture("fakeNews.yaml").then((news) => {
    cy.wrap(jsYaml.load(news)).as("news");
  });
  cy.fixture("vars-es.yaml").then((vars) => {
    cy.wrap(jsYaml.load(vars)).as("vars");
  });
});

Given(
  "Fake fixture is set to replace news.yaml configuration files with each new reset time set to 4 seconds",
  () => {
    cy.intercept("**/news.yaml*", { fixture: "fakeNews.yaml" }).as(
      "yamlRequest"
    );
  }
);

When("The user closes the existent news", () => {
  cy.get(".container-green > .icon > img").click();
  cy.get(".container-yellow > .icon > img").click();
  cy.get(".container-red > .icon > img").click();
});

Then("The news should not yet be present again", () => {
  cy.get(".container-green > .icon > img").should("not.exist");
  cy.get(".container-yellow > .icon > img").should("not.exist");
  cy.get(".container-red > .icon > img").should("not.exist");
});

Then("The news should be present again", () => {
  cy.get(".container-green > .icon > img").should("exist");
  cy.get(".container-yellow > .icon > img").should("exist");
  cy.get(".container-red > .icon > img").should("exist");
});

Then(
  "News title, description, style and icon should match the ones read from the news.yaml file",
  () => {
    cy.get("@vars").then((vars) => {
      cy.get("@news").then((news) => {
        cy.get("[class*=container-] > .icon > img").each(($new, index) => {
          const item = news.data[index];
          let title = item.title;
          if (title.startsWith("$")) {
            title = vars.news[title.replace("$", "")];
          }
          let description = item.description;
          if (description.startsWith("$")) {
            description = vars.news[description.replace("$", "")];
          }
          let className = `container-${item.type.toLowerCase()}`;
          const elementTitle = $new
            .parent()
            .parent()
            .find(".item-title")[0]
            .textContent.trim();
          const elementDescription = $new
            .parent()
            .parent()
            .find("[class*=item-description]")[0]
            .textContent.trim();
          let iconUrl = "";
          switch (item.type) {
            case "GREEN":
              iconUrl = "./assets/images/notification/circle";
              break;
            case "YELLOW":
              iconUrl = "./assets/images/notification/tip-Y";
              break;
            case "RED":
            default:
              iconUrl = "./assets/images/notification/tip-R";
              break;
          }

          cy.wrap(elementTitle).should("eq", title);
          cy.wrap(elementDescription).should("eq", description);
          cy.wrap($new.parent().parent()).should("have.class", className);
          cy.wrap($new.parent().parent())
            .find(`img[src*='${iconUrl}']`)
            .should("exist");
        });
      });
    });
  }
);

Then("News should be rendered above the list of DIPs", () => {
  var indexes = {};
  cy.get(
    "app-list-page>app-news,app-list-page>app-filter-list,app-list-page>app-list"
  ).each(($item, idx) => {
    indexes[$item.prop("tagName")] = idx;
  });
  cy.wrap(indexes).then((indexes) => {
    cy.wrap(indexes["APP-NEWS"]).should("be.below", indexes["APP-LIST"]);
  });
});
