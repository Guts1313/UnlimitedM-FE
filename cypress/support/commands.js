// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8080/unlimitedmarketplace/auth/login',
        body: {
            username: 'gosu',
            passwordHash: 'gosuu'
        }
    }).then((response) => {
        expect(response.status).to.eq(200); // Ensure login was successful
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        cy.log('Received Access Token: ' + accessToken);
        cy.log('Received Refresh Token: ' + refreshToken);
        window.localStorage.setItem('jwt', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
    });
});

Cypress.Commands.add('logout', () => {
    const refreshToken = window.localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available for logout.');
    }

    cy.request({
        method: 'POST',
        url: 'http://localhost:8080/unlimitedmarketplace/auth/logout',
        body: {
            refreshToken: refreshToken
        },
        failOnStatusCode: false
    }).then((response) => {
        expect(response.status).to.eq(200); // Ensure logout was successful
        window.localStorage.removeItem('jwt');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('userId');
    });
});
