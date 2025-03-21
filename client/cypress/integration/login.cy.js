describe('Login Page Integration Tests', () => {
  it('should log in successfully with valid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:3000/dashboard');
    cy.contains('Welcome, Test User').should('be.visible');
  });
});
