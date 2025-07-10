const BASE_URL = 'https://story-api.dicoding.dev/v1';

export default class LoginModel {
  static async login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.message || 'Login gagal.');
    }

    return result.loginResult;
  }
}
