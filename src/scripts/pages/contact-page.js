export default class ContactPage {
  async render() {
    return `
      <section class="container">
        <h1>Contact</h1>
        <p>Hubungi kami melalui email: <a href="mailto:support@app.com">support@app.com</a> atau WhatsApp: 08xx-xxxx-xxxx.</p>
      </section>
    `;
  }

  async afterRender() {}
} 