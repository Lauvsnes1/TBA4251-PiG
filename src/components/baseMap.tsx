import * as React from 'react';
//import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
export default function BaseMap() {
  const position: [number, number] = [51.1664, -120.906];
  return (
<MapContainer center={[10.77, 106.0]} zoom={10} style={{height: "100vh", width: "100vw"}}>
          <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
      </MapContainer>
  );
}
