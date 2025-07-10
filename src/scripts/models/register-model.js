// models/register-model.js
const BASE_URL = "https://story-api.dicoding.dev/v1";

export default class RegisterModel {
  async register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      throw new Error(result.message || "Registrasi gagal.");
    }

    return result.message;
  }
}
