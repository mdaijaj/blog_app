describe('Auth API Integration Tests', () => {
  it('should return 404 for invalid login credentials', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: { email: 'invalid@example.com', password: 'wrongpassword' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.eq('Invalid login credentials.');
    });
  });

  it('should return 200 and a token for valid login credentials', () => {
    cy.request('POST', '/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.user).to.have.property('token');
    });
  });
});
