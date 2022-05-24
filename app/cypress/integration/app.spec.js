describe("Navigation", () => {
    it("should navigate to the login page, then to the scope choice page, then to the home page", () => {
        cy.visit("https://modulo.local:3000/");
        cy.contains("h1", "Connexion");
        cy.get('input[name="uuid"]').type("admin");
        cy.get('input[name="password"]').type("root");
        cy.get('button[type="submit"]').as("submitButton").click();
        cy.url({ timeout: 60000 }).should("include", "/scope-choice");
        cy.contains("h1", "Je choisis ma fonction");
        cy.get('div[class="row justify-content-around"]')
            .children()
            .each(($el, index, $list) => {
                const randomIndex = Math.floor(Math.random() * $list.length);

                if (index === randomIndex) {
                    cy.wrap($el).first().click();
                }
            });
        cy.getCookie("current_scope");
        cy.get('button[id="mui-2"]').click();
        cy.url({ timeout: 60000 }).should("include", "/home");
        cy.contains("h1", "Accueil Connecté");
    });

    it("should navigate to the about page", () => {
        cy.visit("https://modulo.local:3000/about");
        cy.contains("h1", "À propos");
    });
});
