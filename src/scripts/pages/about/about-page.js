export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About</h1>
        <p>App ini adalah platform berbagi cerita dengan fitur peta, foto, dan aksesibilitas modern. Dibangun dengan arsitektur SPA dan menerapkan prinsip MVP.</p>
      </section>
    `;
  }

  async afterRender() {
  }
}
