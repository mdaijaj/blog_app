describe('Add Blog Page Integration Tests', () => {
  it('should create a new blog successfully', () => {
    cy.visit('/add-blog');
    cy.get('input[name="title"]').type('Test Blog');
    cy.get('textarea[name="content"]').type('This is a test blog.');
    cy.get('button[type="submit"]').click();

    cy.contains('Blog created successfully').should('be.visible');
  });
});
