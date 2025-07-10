import HomePresenter from '../../presenters/home-presenter';
import { StoryModel } from '../../data/api';
import HomeMapView from '../../../views/home-map-view.js';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <div id="map" style="height: 400px; margin: 2rem 0"></div>
        <div id="notes-list" aria-live="polite" aria-atomic="true">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    const notesListEl = document.getElementById('notes-list');
    const mapEl = document.getElementById('map');
    const model = new StoryModel();
    const view = new HomeMapView(notesListEl, mapEl);
    const presenter = new HomePresenter(model, view);
    await presenter.init();
    if (notesListEl) notesListEl.focus();
  }
}
