export default class LoginView {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <section class="login-section">
        <h2>Login</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          <button type="submit">Login</button>
          <div id="login-message" class="message" aria-live="polite"></div>
        </form>
      </section>
    `;

    this.form = this.container.querySelector("#login-form");
    this.message = this.container.querySelector("#login-message");
  }

  onSubmit(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler({
        email: this.form.email.value,
        password: this.form.password.value,
      });
    });
  }

  showMessage(text, color = "red") {
    this.message.textContent = text;
    this.message.style.color = color;
  }

  onLoginSuccess() {
    window.dispatchEvent(
      new CustomEvent("auth-change", { detail: { isLoggedIn: true } })
    );
    window.location.hash = "/";
  }
}
