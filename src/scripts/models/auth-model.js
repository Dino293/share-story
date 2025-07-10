export default class AuthModel {
  static getToken() {
    return localStorage.getItem('accessToken');
  }

  static setToken(token) {
    if (typeof token !== 'string') {
      throw new Error('Token harus berupa string.');
    }
    localStorage.setItem('accessToken', token);
  }

  static removeToken() {
    localStorage.removeItem('accessToken');
  }

  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static setUser(user) {
    if (typeof user !== 'object') {
      throw new Error('User harus berupa objek.');
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  static removeUser() {
    localStorage.removeItem('user');
  }
}
