describe('Product Tests', () => {
    const apiUrl = 'http://localhost:8080/unlimitedmarketplace'; // Adjust this to your API's base URL

    it('should create a new product', () => {
        cy.request({
            method: 'POST',
            url: `${apiUrl}/products`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <your_access_token>' // Replace with a valid token if needed
            },
            body: {
                userId: 1, // Replace with a valid user ID
                productName: 'New Product',
                productUrl: 'http://example.com/product',
                productPrice: 29.99,
                productDateCreated: '2024-06-25T00:00:00'
            }
        }).then(response => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.productName).to.eq('New Product');
        });
    });

    it('should get all products', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/products`,
            headers: {
                'Authorization': 'Bearer <your_access_token>' // Replace with a valid token if needed
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('allProducts');
            expect(response.body.allProducts).to.be.an('array');
        });
    });

    it('should get a product by ID', () => {
        const productId = 1; // Replace with a valid product ID

        cy.request({
            method: 'GET',
            url: `${apiUrl}/products/${productId}`,
            headers: {
                'Authorization': 'Bearer <your_access_token>' // Replace with a valid token if needed
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', productId);
        });
    });

    it('should get user listed products', () => {
        const userId = 1; // Replace with a valid user ID

        cy.request({
            method: 'GET',
            url: `${apiUrl}/products/mylistings?userId=${userId}`,
            headers: {
                'Authorization': 'Bearer <your_access_token>' // Replace with a valid token if needed
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('allProducts');
            expect(response.body.allProducts).to.be.an('array');
        });
    });
});
