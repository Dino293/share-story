import L from 'leaflet';
import CONFIG from '../scripts/config.js';

export default class HomeMapView {
  constructor(notesListEl, mapContainer) {
    this.notesListEl = notesListEl;
    this.mapEl = mapContainer;
    this.map = null;
    this.markers = [];
  }

  renderStories(stories) {
    if (!this.notesListEl) return;
    this.notesListEl.innerHTML = stories.map((story) => `
      <article 
        class="note-item" 
        aria-labelledby="story-${story.id}-title"
        tabindex="0"
        view-transition-name="note-item-${story.id}">
        <img src="${story.photoUrl}" 
             alt="${story.description || 'Story image'}" 
             loading="lazy"
             role="img" />
        <h3 id="story-${story.id}-title">${story.name}</h3>
        <p>${story.description}</p>
        ${story.lat && story.lon ? 
          `<small aria-label="Location">Lokasi: ${story.lat}, ${story.lon}</small>`
         : ''}
        <time datetime="${new Date(story.createdAt).toISOString()}">
          ${new Date(story.createdAt).toLocaleString()}
        </time>
      </article>
    `).join('');
  }

  renderError(message) {
    if (!this.notesListEl) return;
    this.notesListEl.innerHTML = `<p class="error-message">${message}</p>`;
  }

  clearMarkers() {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }

  renderMap(storiesWithLocation) {
    if (!this.mapEl) {
      console.warn('Map container not found');
      return;
    }
    if (this.mapEl.clientHeight === 0) {
      setTimeout(() => this.renderMap(storiesWithLocation), 100);
      return;
    }
    this.mapEl.setAttribute('role', 'application');
    this.mapEl.setAttribute('aria-label', 'Story locations map');
    if (!this.map) {
      this.map = L.map(this.mapEl).setView([0, 0], 2);
      const streets = L.tileLayer(`${CONFIG.MAP_TILE_URL}${CONFIG.MAP_API_KEY}`, {
        attribution: '© MapTiler',
        maxZoom: 18,
      });
      streets.addTo(this.map);
      const satellite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap',
        maxZoom: 17,
      });
      const baseLayers = {
        Streets: streets,
        Satellite: satellite,
      };
      L.control.layers(baseLayers).addTo(this.map);
    } else {
      this.clearMarkers();
    }
    const bounds = [];
    this.map.whenReady(() => {
      storiesWithLocation.forEach(({ lat, lon, name, description, photoUrl }) => {
        const latNum = Number(lat);
        const lonNum = Number(lon);
        if (isNaN(latNum) || isNaN(lonNum)) return;
        const popupContent = `
          <div style="text-align:center;">
            <h3 style="margin: 0;">${name}</h3>
            <img src="${photoUrl}" alt="${description || 'Story image'}" style="width: 100px; border-radius: 8px;" />
            <p style="margin: 0.5rem 0;">${description || 'Tidak ada deskripsi'}</p>
            <small>Lokasi: ${latNum}, ${lonNum}</small>
          </div>
        `;
        const marker = L.marker([latNum, lonNum]).addTo(this.map);
        marker.bindPopup(popupContent);
        this.markers.push(marker);
        bounds.push([latNum, lonNum]);
      });
      if (bounds.length === 1) {
        this.map.setView(bounds[0], 13);
      } else if (bounds.length > 1) {
        this.map.fitBounds(bounds, { padding: [30, 30] });
      } else {
        this.map.setView([0, 0], 2);
      }
    });
  }
}
