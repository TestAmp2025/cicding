// tests/api/checkout-orders-ddt.spec.js
import { test, expect, request } from '@playwright/test';
import { shopUser } from '../../test-data/credentials.js';
import {
  customers,        // 10 US customers (all with email testuser2@yopmail.com per your change)
  paymentInfo,      // { cardNumber, expiryDate, ccv }
  CHECKOUT_TOTAL,   // e.g. 1000
  PRODUCT_ID        // e.g. 'prod123'
} from '../../test-data/customers.js';

const API_BASE = 'https://mini-shop-be.onrender.com';

// --- Helpers -----------------------------------------------------------------

/** Normalize any /orders response into an array you can .find() on */
function normalizeOrders(json) {
  if (Array.isArray(json)) return json;                     // [ {...}, {...} ]
  if (Array.isArray(json?.orders)) return json.orders;      // { orders: [ ... ] }
  if (Array.isArray(json?.data)) return json.data;          // { data: [ ... ] }
  if (Array.isArray(json?.results)) return json.results;    // { results: [ ... ] }

  // Fallback: return the first array value found
  if (json && typeof json === 'object') {
    for (const k of Object.keys(json)) {
      const v = json[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

/** Try common shapes for created order id */
function getCreatedId(obj) {
  return (
    obj?._id ||
    obj?.id ||
    obj?.order?._id ||
    obj?.data?._id ||
    null
  );
}

// --- Test --------------------------------------------------------------------

test.describe('Mini-Shop API – Auth via API, then /checkout & /orders (DDT x10)', () => {
  test('Create orders for 10 customers and fetch their order details', async () => {

    // 1) Create a bare API context (no auth yet)
    const apiNoAuth = await request.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });

    // 2) Login via API and capture a token (adjust keys as your API returns them)
    const loginRes = await apiNoAuth.post('/auth/login', {
      data: { email: shopUser.email, password: shopUser.password },
      failOnStatusCode: false
    });

    expect(loginRes.ok(), `Login failed: ${loginRes.status()} ${await loginRes.text()}`).toBeTruthy();
    const loginJson = await loginRes.json();

    // Common token fields: accessToken | token | jwt
    const bearer =
      loginJson?.accessToken ||
      loginJson?.token ||
      loginJson?.jwt;

    expect(bearer, 'No bearer token found in /auth/login response').toBeTruthy();

    // 3) Create an AUTHENTICATED API context with Bearer token
    const api = await request.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      }
    });

    // (Optional) sanity check
    const sanity = await api.get('/orders', { failOnStatusCode: false });
    console.log('GET /orders sanity →', sanity.status());
    // Do not assert here—some backends allow GET /orders with or without auth.

    const results = [];

    // (Optional) your backend may require a userId (if so, supply it here)
    // If not required, remove it from the payload below.
    const userId = loginJson?.userId || loginJson?.user?._id || '673b5afd2b8901c75eeba1cb';

    // 4) DDT: loop through the 10 customers
    for (const c of customers) {
      const payload = {
        userId,
        items: [{ productId: PRODUCT_ID, quantity: 2, _id: 'temp-line-id' }],
        totalPrice: CHECKOUT_TOTAL,
        firstname: c.first,
        lastname: c.last,
        country: c.country,
        address: c.address,
        city: c.city,
        state: c.state,
        postalCode: c.postalCode,
        phone: c.phone,
        email: c.email,
        paymentInfo: {
          cardNumber: paymentInfo.cardNumber,
          expiryDate: paymentInfo.expiryDate,
          ccv: paymentInfo.ccv,
          cardName: `${c.first} ${c.last}`,
        },
        status: 'Pending',
      };

      // POST /checkout
      const postRes = await api.post('/checkout', {
        data: payload,
        failOnStatusCode: false
      });

      const ok = postRes.ok();
      console.log(`POST /checkout for ${c.first} ${c.last} → ${postRes.status()} (ok=${ok})`);

      if (!ok) {
        const body = await postRes.text().catch(() => '<no body>');
        throw new Error(`Checkout failed: ${postRes.status()} ${body}`);
      }

      const created = await postRes.json();
      const createdId = getCreatedId(created);

      // GET /orders to confirm it exists (and capture status)
      const getRes = await api.get('/orders', { failOnStatusCode: false });
      expect(getRes.ok(), `GET /orders failed: ${getRes.status()} ${await getRes.text()}`).toBeTruthy();

      const ordersRaw = await getRes.json();
      const orders = normalizeOrders(ordersRaw);

      // Try by id, then by email (support various shapes)
      const found =
        (createdId && orders.find(o => (o._id || o.id) === createdId)) ||
        orders.find(o => (o.email || o.customerEmail) === c.email);

      expect(found, 'Order not found after creation').toBeTruthy();

      results.push({
        customer: `${c.first} ${c.last}`,
        email: c.email,
        orderId: (found && (found._id || found.id)) || createdId || 'n/a',
        status: (found && (found.status || found.orderStatus)) || 'n/a',
      });
    }

    console.log('\n=== Order Results (DDT x10) ===');
    for (const r of results) {
      console.log(`${r.customer} | ${r.email} | ${r.orderId} | ${r.status}`);
    }
    expect(results.length).toBe(10);
  });
});
