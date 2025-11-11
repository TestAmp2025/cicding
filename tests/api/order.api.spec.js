import { test, expect } from '@playwright/test';
import { orderPayload } from '../../test-data/orderData.js';

const baseURL = 'https://mini-shop.testamplify.com/api';

test.describe('Mini-Shop API – Orders', () => {

  test('1️⃣ Create a new order and return order number', async ({ request }) => {
    const response = await request.post(`${baseURL}/orders`, { data: orderPayload });
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    console.log('🆕 Order Created:', body);

    expect(body).toHaveProperty('orderNumber');
    test.info().annotations.push({ type: 'orderNumber', description: body.orderNumber });
  });

  test('2️⃣ Get order by order number', async ({ request }) => {
    // In real use, we’d store/retrieve dynamically, but for teaching we use an example value.
    const orderNumber = 'ORD-10001';

    const response = await request.get(`${baseURL}/orders/${orderNumber}`);
    expect(response.ok()).toBeTruthy();

    const order = await response.json();
    console.log('📦 Order Details:', order);

    expect(order.orderNumber).toBe(orderNumber);
    expect(order).toHaveProperty('status');
  });

  test('3️⃣ Verify order status = success', async ({ request }) => {
    const orderNumber = 'ORD-10001';
    const response = await request.get(`${baseURL}/orders/${orderNumber}/status`);
    expect(response.ok()).toBeTruthy();

    const status = await response.json();
    console.log('✅ Order Status:', status);

    expect(status.currentStatus).toMatch(/success|complete/i);
  });
});
