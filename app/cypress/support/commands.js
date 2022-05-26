// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("acceptCookies", () => {
    cy.get("#cookie-consent-accept")
        .click()
        .then(() => {
            cy.getCookie("cookie_consent").then((cookie) => {
                expect(cookie.value).to.equal("true");
                expect(cookie.path).to.equal("/");
                expect(cookie.httpOnly).to.equal(false);
                expect(cookie.secure).to.equal(true);
                expect(cookie.sameSite).to.equal("strict");
                expect(cookie.domain).to.equal("modulo.local");
            });
        });
});

Cypress.Commands.add("login", (credentials) => {
    cy.get('input[name="uuid"]').type(credentials.uuid);
    cy.get('input[name="password"]').type(credentials.password);
    cy.get('button[type="submit"]').as("submitButton").click();
});
