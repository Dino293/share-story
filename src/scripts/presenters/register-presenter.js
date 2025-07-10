export default class RegisterPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.onSubmit(this._handleRegister.bind(this));
  }

  _validateEmail(email) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  async _handleRegister({ name, email, password }) {
    if (!this._validateEmail(email)) {
      this.view.showMessage("Format email tidak valid");
      return;
    }

    if (password.length < 8) {
      this.view.showMessage("Password minimal 8 karakter");
      return;
    }

    try {
      const message = await this.model.register({ name, email, password });
      this.view.showMessage(message, "green");
      this.view.resetForm();
      this.view.onRegisterSuccess();
    } catch (error) {
      this.view.showMessage(error.message);
    }
  }
}
