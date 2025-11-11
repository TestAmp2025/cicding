import { request, expect } from '@playwright/test';

export async function loginAndGetApi({
  baseURL = 'https://mini-shop-be.onrender.com',
  email,
  password,
}) {
  const bootstrap = await request.newContext({ baseURL });
  const res = await bootstrap.post('/auth/login', {
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    data: { email, password },
  });

  if (!res.ok()) {
    throw new Error(`API login failed: ${res.status()} ${await res.text()}`);
  }

  const json = await res.json();
  const token =
    json.token || json.accessToken || json.jwt || json.data?.token;
  const userId =
    json.user?.id || json.user?._id || json.userId || json.data?.userId;

  expect(token, 'No token in login response').toBeTruthy();

  const api = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });

  return { api, userId, token, raw: json };
}
