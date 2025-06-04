'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function AircraftMap({ aircraft }) {
  const center = [37.5, -96.5]; // Center over the US

  return (
    <div className="h-[400px] w-full mb-10 rounded-lg overflow-hidden shadow">
      <MapContainer center={center} zoom={4} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {aircraft.map((plane) => (
          <Marker key={plane.tailNumber} position={[plane.location.lat, plane.location.lng]}>
            <Popup>
              <strong>{plane.tailNumber}</strong><br />
              {plane.model}<br />
              Status: {plane.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
