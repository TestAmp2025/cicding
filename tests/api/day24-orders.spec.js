import { test, expect, request } from '@playwright/test';

// Day 24: API Testing with Playwright
// Testing APIs using Playwright's request context

//const { test, expect } = require('@playwright/test');

test.describe('API Testing with Playwright', () => {
    test('comprehensive API testing demo (Practice requirement)', async ({ request }) => {
        console.log('=== API Testing Demo ===');
        
        // 1. Test product list endpoint (Practice requirement)
        console.log('--- Testing Product List API ---');
        
        // Mock API server response for demonstration
        const mockProducts = [
            { id: 1, name: 'Wireless Headphones', price: 99.99, category: 'Electronics', inStock: true },
            { id: 2, name: 'Smartphone Case', price: 19.99, category: 'Accessories', inStock: true },
            { id: 3, name: 'Bluetooth Speaker', price: 79.99, category: 'Electronics', inStock: false },
            { id: 4, name: 'USB Cable', price: 12.99, category: 'Accessories', inStock: true }
        ];
        
        // Create a simple API server for testing
        const apiBaseUrl = 'https://jsonplaceholder.typicode.com'; // Using public API for demo
        
        // Test GET request - Product list
        const productsResponse = await request.get(`${apiBaseUrl}/posts` ); // Using posts as product simulation
        expect(productsResponse.status()).toBe(200);
        
        const products = await productsResponse.json();
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
        
        // Validate product structure
        const firstProduct = products[0];
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('title'); // Using title as product name
        expect(firstProduct).toHaveProperty('body'); // Using body as description
        
        console.log(`✅ Product list API returned ${products.length} products`);
        
        // 2. Test individual product endpoint
        console.log('--- Testing Individual Product API ---');
        
        const productId = 1;
        const productResponse = await request.get(`${apiBaseUrl}/posts/${productId}`);
        expect(productResponse.status()).toBe(200);
        
        const product = await productResponse.json();
        expect(product.id).toBe(productId);
        expect(product.title).toBeTruthy();
        
        console.log(`✅ Individual product API returned: ${product.title}`);
        
        // 3. Test POST request - Create product
        console.log('--- Testing Create Product API ---');
        
        const newProduct = {
            title: 'Test Product',
            body: 'This is a test product created via API',
            userId: 1
        };
        
        const createResponse = await request.post(`${apiBaseUrl}/posts`, {
            data: newProduct,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        expect(createResponse.status()).toBe(201);
        
        const createdProduct = await createResponse.json();
        expect(createdProduct.title).toBe(newProduct.title);
        expect(createdProduct.body).toBe(newProduct.body);
        expect(createdProduct.id).toBeTruthy();
        
        console.log(`✅ Product created successfully with ID: ${createdProduct.id}`);
        
        // 4. Test PUT request - Update product
        console.log('--- Testing Update Product API ---');
        
        const updatedProduct = {
            id: 1,
            title: 'Updated Test Product',
            body: 'This product has been updated',
            userId: 1
        };
        
        const updateResponse = await request.put(`${apiBaseUrl}/posts/1`, {
            data: updatedProduct,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        expect(updateResponse.status()).toBe(200);
        
        const updated = await updateResponse.json();
        expect(updated.title).toBe(updatedProduct.title);
        
        console.log('✅ Product updated successfully');
        
        // 5. Test DELETE request
        console.log('--- Testing Delete Product API ---');
        
        const deleteResponse = await request.delete(`${apiBaseUrl}/posts/1`);
        expect(deleteResponse.status()).toBe(200);
        
        console.log('✅ Product deleted successfully');
        
        // 6. Test error handling
        console.log('--- Testing Error Handling ---');
        
        const notFoundResponse = await request.get(`${apiBaseUrl}/posts/999999`);
        expect(notFoundResponse.status()).toBe(404);
        
        console.log('✅ Error handling verified (404 for non-existent product)');
    });
    
    test('API response validation and data extraction', async ({ request }) => {
        console.log('=== API Response Validation ===');
        
        const apiUrl = 'https://jsonplaceholder.typicode.com/users';
        
        // Test response headers
        const response = await request.get(apiUrl );
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        
        // Test response body structure
        const users = await response.json();
        expect(Array.isArray(users)).toBe(true);
        
        // Validate each user object structure
        users.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('address');
            expect(user.address).toHaveProperty('city');
            expect(user.address).toHaveProperty('zipcode');
        });
        
        // Extract specific data for further testing
        const userEmails = users.map(user => user.email);
        expect(userEmails.every(email => email.includes('@'))).toBe(true);
        
        console.log(`✅ Validated ${users.length} user records with proper structure`);
    });
});