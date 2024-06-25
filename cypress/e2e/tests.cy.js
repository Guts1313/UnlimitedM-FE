describe('E2E Tests', () => {
  const apiUrl = 'http://localhost:8080/unlimitedmarketplace';

  function generateUniqueUsername() {
    const timestamp = new Date().getTime();
    return `user${timestamp}`;
  }

  function generateUniqueProductName() {
    const timestamp = new Date().getTime();
    return `New Product ${timestamp}`;
  }

  beforeEach(() => {
    cy.login(); // Log in and store the token before each test
  });

  // User Management Tests
  it('should register a new user', () => {
    const uniqueUsername = generateUniqueUsername();

    cy.request({
      method: 'POST',
      url: `${apiUrl}`, // Adjust this to your user registration endpoint
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        userName: uniqueUsername,
        email: `${uniqueUsername}@example.com`,
        passwordHash: 'password123',
        role: "USER"
      }
    }).then(response => {
      expect(response.status).to.eq(201);
    });
  });

  it('should get user details', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/1`, // Replace with a valid user ID
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
      }
    }).then(response => {
      expect(response.status).to.eq(200);
    });
  });

  // Authentication Tests
  it('should fail to login with invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/auth/login`,
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: 'invalidUser',
        passwordHash: 'invalidPassword'
      }
    }).then(response => {
      expect(response.status).to.eq(500);
    });
  });

  it('should logout successfully', () => {
    cy.logout(); // Use the custom logout command
  });

  // Bidding Tests

  it('should get bids for a product', () => {
    const productId = 1; // Replace with a valid product ID

    cy.request({
      method: 'GET',
      url: `http://localhost:8080/bids/latest/${productId}`,
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
      }
    }).then(response => {
      expect(response.status).to.eq(200);
    });
  });
});
