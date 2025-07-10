export default class HomePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    try {
      const stories = await this.model.fetchStories();

      const storiesWithLocation = stories.filter((s) => {
        const lat = parseFloat(s.lat);
        const lon = parseFloat(s.lon);
        return !isNaN(lat) && !isNaN(lon);
      });

      this.view.renderStories(stories);
      this.view.renderMap(storiesWithLocation);
    } catch (error) {
      console.error("[HomePresenter] Error fetch story:", error);
      this.renderError("Gagal memuat data. Silakan coba lagi.");
    }
  }

  renderStories(stories) {
    this.view.renderStories(stories);
  }

  renderError(message) {
    this.view.renderError(message);
  }
}
