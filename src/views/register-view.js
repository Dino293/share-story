export default class RegisterView {
    constructor(container) {
      this.container = container;
      this._render();
    }
  
    _render() {
      this.container.innerHTML = `
        <section class="register-section">
          <h2>Register</h2>
          <form id="register-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" name="name" type="text" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" required minlength="8" />
            </div>
            <button type="submit">Register</button>
            <div id="register-message" class="message"></div>
          </form>
        </section>
      `;
  
      this.form = this.container.querySelector('#register-form');
      this.messageEl = this.container.querySelector('#register-message');
    }
  
    onSubmit(callback) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = this.form.name.value;
        const email = this.form.email.value;
        const password = this.form.password.value;
        callback({ name, email, password });
      });
    }
  
    showMessage(text, color = 'red') {
      this.messageEl.textContent = text;
      this.messageEl.style.color = color;
    }
  
    resetForm() {
      this.form.reset();
    }
  
    onRegisterSuccess() {
      alert('Akun berhasil dibuat! Silakan login.');
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);
    }
  }
  