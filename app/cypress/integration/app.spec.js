describe("Navigation", () => {
    it("should login and get to the home page with a scope", () => {
        cy.visit("https://modulo.local:3000/");
        cy.acceptCookies();
        cy.contains("h1", "Connexion");
        cy.login({ uuid: "admin", password: "root" });
        cy.url({ timeout: 60000 }).should("include", "/scope-choice");
        cy.get('div[id="available-scopes"]')
            .children()
            .then((scopes) => {
                const scopeIndex = Math.floor(Math.random() * scopes.length);

                cy.get(scopes[scopeIndex])
                    .click()
                    .invoke("attr", "id")
                    .then((id) => {
                        cy.getCookie("current_scope").then((cookie) => {
                            expect(cookie.value).to.equal(id);
                            expect(cookie.path).to.equal("/");
                            expect(cookie.httpOnly).to.equal(false);
                            expect(cookie.secure).to.equal(true);
                            expect(cookie.sameSite).to.equal("lax");
                            expect(cookie.domain).to.equal("modulo.local");
                        });
                    });
            });
        cy.get('button[id="confirm-scope-choice"]').click();
        cy.url({ timeout: 60000 }).should("include", "/home");
        cy.contains("h1", "Accueil Connecté");
    });

    it("should navigate to the help page", () => {
        cy.visit("https://modulo.local:3000/help");
        cy.acceptCookies();
        cy.contains("h1", "Aide");
    });

    it("should navigate to the legal notice page", () => {
        cy.visit("https://modulo.local:3000/legal-notice");
        cy.acceptCookies();
        cy.contains("h1", "Mentions Légales");
    });

    it("should navigate to the cookie policy page", () => {
        cy.visit("https://modulo.local:3000/cookie-policy");
        cy.acceptCookies();
        cy.contains("h1", "Gestion des cookies");
    });

    it("should navigate to the about page", () => {
        cy.visit("https://modulo.local:3000/about");
        cy.acceptCookies();
        cy.contains("h1", "À propos");
    });
});
