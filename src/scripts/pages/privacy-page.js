export default class PrivacyPage {
  async render() {
    return `
      <section class="container">
        <h1>Privacy Policy</h1>
        <p>Kami menjaga privasi data pengguna. Data yang dikumpulkan hanya digunakan untuk keperluan aplikasi dan tidak dibagikan ke pihak ketiga.</p>
      </section>
    `;
  }

  async afterRender() {}
} 