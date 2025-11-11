// test-data/apiData.js

// Base URL for the public demo API
export const API_BASE = 'https://jsonplaceholder.typicode.com';

// Sample payloads for create/update flows
export const newPost = {
  title: 'Test Product',
  body: 'This is a test product created via API',
  userId: 1,
};

export const updatedPost = {
  id: 1,
  title: 'Updated Test Product',
  body: 'This product has been updated',
  userId: 1,
};

// A productId to use when fetching single "product" (post)
export const productIdForGet = 1;

// A non-existing id to force a 404
export const notFoundId = 999999;