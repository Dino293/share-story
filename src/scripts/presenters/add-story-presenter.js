import CONFIG from '../config';

export default class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this._lat = null;
    this._lon = null;
    this._activeStream = null;
  }

  async init() {
    this.view.initializeMap(CONFIG, this._onMapClick.bind(this));
    this.view.bindOnSubmit(this._onSubmit.bind(this));
    this.view.bindOnChooseFileClick(this._onStartCamera.bind(this));
    this.view.bindOnFileChange(this._onFileChange.bind(this));
    this.view.bindOnCapturePhoto(this._onCapturePhoto.bind(this));

    this._onHashChange = () => {
      if (window.location.hash !== '#/add-story') {
        this.destroy();
      }
    };
    window.addEventListener('hashchange', this._onHashChange);
  }

  async _onSubmit({ description, photo }) {
    if (!photo) {
      this.view.showMessage('Silakan pilih atau ambil foto.', 'red');
      return;
    }

    try {
      await this.model.postStory({
        description,
        photo,
        lat: this._lat,
        lon: this._lon,
      });
      this.view.showMessage('Cerita berhasil dikirim!', 'green');
      this.view.resetForm();
      setTimeout(() => (window.location.hash = '#/'), 1500);
    } catch (error) {
      console.error('Error saat mengirim cerita:', error);
      this.view.showMessage(error.message, 'red');
    }
  }

  _onFileChange(file) {
    console.log('File diunggah:', file);
    this.view.showPreview(file);
  }

  async _onStartCamera() {
    try {
      console.log('Memulai kamera...');
      const stream = await this.view.startCamera();
      this._activeStream = stream;
      console.log('Kamera berhasil diaktifkan:', stream);
      this.view.showMessage('Kamera berhasil diaktifkan.', 'green');
    } catch (err) {
      console.error('Error mengakses kamera:', err);
      this.view.showMessage('Tidak dapat mengakses kamera. Pastikan izin diberikan.', 'red');
    }
  }

  async _onCapturePhoto() {
    try {
      console.log('Memulai proses capture foto...');
      const photoBlob = await this.view.capturePhotoFromVideo();
      const file = new File([photoBlob], 'photo.jpg', { type: 'image/jpeg' });
      console.log('Foto berhasil diambil:', file);

      this.view.setPhotoFile(file); // Atur foto ke input file
      return file; // Kembalikan file untuk ditampilkan di view
    } catch (err) {
      console.error('Gagal mengambil foto:', err.message);
      this.view.showMessage('Gagal mengambil foto. Coba lagi.', 'red');
      throw err; // Lempar error ke handler di view
    }
  }

  _onMapClick(latlng) {
    this._lat = latlng.lat;
    this._lon = latlng.lng;
    console.log('Lokasi dipilih:', latlng);
    this.view.addDraggableMarker(latlng, this._onMapClick.bind(this));
  }

  _stopCamera() {
    if (this._activeStream) {
      this._activeStream.getTracks().forEach((track) => track.stop());
      this._activeStream = null;
    }

    this.view.clearCameraPreview();
    console.log('Kamera dimatikan.');
  }

  destroy() {
    this._stopCamera();
    if (this._onHashChange) {
      window.removeEventListener('hashchange', this._onHashChange);
      this._onHashChange = null;
    }
  }
}
