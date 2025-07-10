import AddStoryPresenter from '../../presenters/add-story-presenter';
import AddStoryModel from '../../models/AddStoryModel';
import AddStoryView from '../../../views/AddStoryView';

export default class AddStoryPage {
  constructor() {
    this._presenter = null;
  }

  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita</h1>
        <form id="add-story-form">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" placeholder="Bagikan ceritamu..." required aria-label="Deskripsi"></textarea>
            <small>Beritahu kami tentang cerita Anda dengan detail</small>
          </div>
          <div class="form-group">
            <label>Foto</label>
            <div class="upload-options">
              <button type="button" id="choose-file" class="photo-button">Mulai Kamera</button>
              <button type="button" id="take-photo" class="photo-button">Ambil Foto</button>
              <input type="file" id="uploadInput" accept="image/*" style="display: none;" aria-label="Unggah Foto">
            </div>
            <div id="preview-container" aria-live="polite"></div>
          </div>
          <div class="form-group">
            <label>Lokasi</label>
            <div id="map" style="height: 400px; margin: 2rem 0;" role="region" aria-label="Peta Lokasi"></div>
            <div id="location-info" style="margin-top: 0.5rem; font-size: 0.95em; color: #555;">
              Lokasi yang dipilih: -6.200000, 106.800000
            </div>
          </div>
          <p class="message" role="alert"></p>
          <button type="submit" class="submit-button">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Inisialisasi Model, View, dan Presenter
    const model = new AddStoryModel();
    const view = new AddStoryView();
    this._presenter = new AddStoryPresenter(model, view);

    // Inisialisasi presenter
    await this._presenter.init();
  }

  destroy() {
    if (this._presenter) {
      this._presenter.destroy();
    }
  }
}
