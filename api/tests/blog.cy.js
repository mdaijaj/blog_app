describe('Blog API Integration Tests', () => {
  it('should create a new blog successfully', () => {
    cy.request('POST', '/api/blog/add', {
      title: 'Test Blog',
      content: 'This is a test blog.',
      author: 'Test Author',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.blog).to.have.property('title', 'Test Blog');
    });
  });
});
