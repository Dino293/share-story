import LoginModel from "../../models/login-model-fixed.js";
import LoginView from "../../../views/login-view.js";
import LoginPresenter from "../../presenters/login-presenter.js";
import AuthModel from "../../models/auth-model.js";

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <div id="login-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById("login-container");
    const model = new LoginModel();
    const view = new LoginView(container);
    new LoginPresenter(model,AuthModel, view);
  }
}
