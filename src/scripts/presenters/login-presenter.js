export default class LoginPresenter {
  constructor(model, authModel, view) {
    this.model = model; // LoginModel
    this.authModel = authModel; // AuthModel
    this.view = view;

    this.view.render();
    this.view.onSubmit(this._handleLogin.bind(this));
  }

  _validateEmail(email) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  async _handleLogin({ email, password }) {
    if (!this._validateEmail(email)) {
      this.view.showMessage('Format email tidak valid.');
      return;
    }

    if (password.length < 8) {
      this.view.showMessage('Password minimal 8 karakter.');
      return;
    }

    try {
      const result = await this.model.login({ email, password });
      this.authModel.setToken(result.token);
      this.authModel.setUser(result);

      this.view.showMessage('Login berhasil!', 'green');
      setTimeout(() => {
        this.view.onLoginSuccess();
      }, 1000);
    } catch (error) {
      console.error('[LoginPresenter] Error login:', error);
      this.view.showMessage(error.message || 'Login gagal.');
    }
  }
}
