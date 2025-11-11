// pages/api/JsonPlaceholderClient.js
import { expect } from '@playwright/test';

/**
 * Very small wrapper around Playwright's APIRequestContext.
 * Each method does one thing and returns the parsed JSON (when applicable).
 */
export class JsonPlaceholderClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} baseURL
   */
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL;
  }

  // ---- Posts ----
  async listPosts() {
    const res = await this.request.get(`${this.baseURL}/posts`);
    await expect(res).toBeOK();
    return res.json();
  }

  async getPost(id) {
    const res = await this.request.get(`${this.baseURL}/posts/${id}`);
    return res;
  }

  async createPost(data) {
    const res = await this.request.post(`${this.baseURL}/posts`, {
      data,
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  }

  async updatePost(id, data) {
    const res = await this.request.put(`${this.baseURL}/posts/${id}`, {
      data,
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  }

  async deletePost(id) {
    const res = await this.request.delete(`${this.baseURL}/posts/${id}`);
    return res;
  }

  // ---- Users ----
  async listUsers() {
    const res = await this.request.get(`${this.baseURL}/users`);
    await expect(res).toBeOK();
    return res.json();
  }
}