describe('Product Tests', () => {
  const apiUrl = 'http://localhost:8080/unlimitedmarketplace';

  function generateUniqueProductName() {
    const timestamp = new Date().getTime();
    return `New Product ${timestamp}`;
  }

  beforeEach(() => {
    cy.login(); // Log in and store the token before each test
  });

  it('should create a new product', () => {
    const uniqueProductName = generateUniqueProductName();
    const productUrl = 'http://example.com/product';

    cy.log('Attempting to retrieve JWT Token from localStorage');
    cy.window().then((window) => {
      const token = window.localStorage.getItem('jwt');
      cy.log('Retrieved JWT Token: ' + token); // Log the retrieved token

      cy.request({
        method: 'POST',
        url: `${apiUrl}/products`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          userId: 1, // Replace with a valid user ID
          productName: uniqueProductName,
          productUrl: productUrl,
          productPrice: 29.99,
          productDateCreated: '2024-06-25T00:00:00'
        }
      }).then(response => {
        cy.log('Create Product Response:', JSON.stringify(response.body)); // Log the response body
        expect(response.status).to.eq(201);
      });
    });
  });

  it('should get all products', () => {
    cy.log('Attempting to retrieve JWT Token from localStorage');
    cy.window().then((window) => {
      const token = window.localStorage.getItem('jwt');
      cy.log('Retrieved JWT Token: ' + token); // Log the retrieved token

      cy.request({
        method: 'GET',
        url: `${apiUrl}/products`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        cy.log('Get All Products Response:', JSON.stringify(response.body)); // Log the response body
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('productEntities'); // Match the actual property name
        expect(response.body.productEntities).to.be.an('array');
      });
    });
  });

  it('should get a product by ID', () => {
    // Create a product first to ensure we have a valid product ID
    const uniqueProductName = generateUniqueProductName();
    const productUrl = 'http://example.com/product';

    cy.log('Attempting to retrieve JWT Token from localStorage');
    cy.window().then((window) => {
      const token = window.localStorage.getItem('jwt');
      cy.log('Retrieved JWT Token: ' + token); // Log the retrieved token

      // Create a product to retrieve later
      cy.request({
        method: 'POST',
        url: `${apiUrl}/products`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          userId: 1, // Replace with a valid user ID
          productName: uniqueProductName,
          productUrl: productUrl,
          productPrice: 29.99,
          productDateCreated: '2024-06-25T00:00:00'
        }
      }).then(response => {
        const productId = response.body.id;

        cy.request({
          method: 'GET',
          url: `${apiUrl}/products/${productId}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          cy.log('Get Product By ID Response:', JSON.stringify(response.body)); // Log the response body
          expect(response.status).to.eq(200);
        });
      });
    });
  });

  it('should get user listed products', () => {
    const userId = 1; // Replace with a valid user ID
    cy.log('Attempting to retrieve JWT Token from localStorage');
    cy.window().then((window) => {
      const token = window.localStorage.getItem('jwt');
      cy.log('Retrieved JWT Token: ' + token); // Log the retrieved token

      cy.request({
        method: 'GET',
        url: `${apiUrl}/products/mylistings?userId=${userId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        cy.log('Get User Listed Products Response:', JSON.stringify(response.body)); // Log the response body
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('productEntities'); // Match the actual property name
        expect(response.body.productEntities).to.be.an('array');
      });
    });
  });
});
