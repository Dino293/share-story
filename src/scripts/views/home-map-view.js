if (!this.map) {
  console.warn("Map belum diinisialisasi!");
  return;
}

const bounds = [];

storiesWithLocation.forEach(({ lat, lon, name, description, photoUrl }) => {
  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (isNaN(latNum) || isNaN(lonNum)) return;

  const popupContent = `
    <div style="text-align:center;">
      <h3 style="margin: 0;">${name}</h3>
      <img src="${photoUrl || "#"}" alt="${
    description || "Story image"
  }" style="width: 100px; border-radius: 8px;" />
      <p style="margin: 0.5rem 0;">${description || "Tidak ada deskripsi"}</p>
      <small>Lokasi: ${latNum}, ${lonNum}</small>
    </div>
  `;

  const markerIcon = L.icon({
    iconUrl: "images/leaflet/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "images/leaflet/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const marker = L.marker([latNum, lonNum], { icon: markerIcon });

  // Penting! Jangan bind atau buka popup sebelum layer ditambahkan
  marker.addTo(this.map).bindPopup(popupContent);

  this.markers.push(marker);
  bounds.push([latNum, lonNum]);
});

if (bounds.length > 0) {
  this.map.fitBounds(bounds, { padding: [40, 40] });
}
