import RegisterPresenter from '../../presenters/register-presenter';
import RegisterModel from '../../models/register-model';
import RegisterView from '../../../views/register-view.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <div id="register-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('register-container');
    const model = new RegisterModel();
    const view = new RegisterView(container);
    const presenter = new RegisterPresenter(model, view);
  }
}
