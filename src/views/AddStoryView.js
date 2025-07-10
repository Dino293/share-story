import L from "leaflet";

export default class AddStoryView {
  constructor() {
    this._form = document.getElementById("add-story-form");
    this._photoInput = document.getElementById("uploadInput");
    this._descriptionInput = document.getElementById("description");
    this._previewContainer = document.getElementById("preview-container");
    this._messageEl = document.querySelector(".message");
    this._map = null;
    this._marker = null;
    this._videoElement = null;
  }

  bindOnSubmit(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      const description = this._descriptionInput.value;
      const photo = this._photoInput.files[0];
      handler({ description, photo });
    });
  }

  bindOnChooseFileClick(handler) {
    document.getElementById("choose-file").addEventListener("click", handler);
  }

  bindOnFileChange(handler) {
    this._photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) handler(file);
    });
  }

  bindOnCapturePhoto(handler) {
    document
      .getElementById("take-photo")
      .addEventListener("click", async () => {
        try {
          const photoFile = await handler();
          this.showCapturedPhoto(photoFile);
        } catch (err) {
          console.error("Gagal menampilkan foto:", err.message);
          this.showMessage("Gagal menampilkan foto. Coba lagi.", "red");
        }
      });
  }

  listenToHashChange(handler) {
    window.addEventListener("hashchange", handler);
  }

  stopListeningToHashChange(handler) {
    window.removeEventListener("hashchange", handler);
  }

  isAddStoryPageActive() {
    return window.location.hash === "#/add-story";
  }

  navigateToHome() {
    window.location.hash = "#/";
  }

  initializeMap(config, onMapClick) {
    this._map = L.map("map").setView([-2.5, 118], 5);
    L.tileLayer(`${config.MAP_TILE_URL}${config.MAP_API_KEY}`, {
      attribution: "© MapTiler",
    }).addTo(this._map);
    this._map.on("click", (e) => onMapClick(e.latlng));
    this.addDraggableMarker({ lat: -2.5, lng: 118 }, onMapClick);
  }

  addDraggableMarker(latlng, onMapClick) {
    if (this._marker) this._map.removeLayer(this._marker);
    this._marker = L.marker(latlng, { draggable: true }).addTo(this._map);
    this._marker.on("dragend", (e) => onMapClick(e.target.getLatLng()));
  }

  setPhotoFile(file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    this._photoInput.files = dataTransfer.files;
  }

  clearCameraPreview() {
    this._previewContainer.innerHTML = "";
  }

  showPreview(file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "Preview";
    img.className = "photo-preview";

    this._previewContainer.innerHTML = "";
    this._previewContainer.appendChild(img);
  }

  showCapturedPhoto(file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "Captured Photo";
    img.className = "captured-photo";

    this._previewContainer.innerHTML = "";
    this._previewContainer.appendChild(img);
  }

  async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this._videoElement = document.createElement("video");
    this._videoElement.autoplay = true;
    this._videoElement.srcObject = stream;
    this._previewContainer.innerHTML = "";
    this._previewContainer.appendChild(this._videoElement);
    return stream;
  }

  async capturePhotoFromVideo() {
    if (!this._videoElement) {
      throw new Error("Kamera belum aktif.");
    }
    const canvas = document.createElement("canvas");
    canvas.width = this._videoElement.videoWidth || 640;
    canvas.height = this._videoElement.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(this._videoElement, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], "captured-photo.jpg", { type: "image/jpeg" }));
          } else {
            reject(new Error("Gagal membuat file dari tangkapan kamera."));
          }
        },
        "image/jpeg",
        1.0
      )
    );
  }

  showMessage(message, color) {
    this._messageEl.textContent = message;
    this._messageEl.style.color = color;
  }

  resetForm() {
    this._form.reset();
    this._previewContainer.innerHTML = "";
  }
}
