const BASE_URL = 'https://story-api.dicoding.dev/v1';

export default class LoginModel {
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi.');
    }

    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Gagal terhubung ke server.');
    }

    const result = await response.json();
    if (result.error) {
      throw new Error(result.message || 'Login gagal.');
    }

    return result.loginResult;
  }
}
