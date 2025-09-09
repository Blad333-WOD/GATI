'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression, LatLngBoundsExpression } from 'leaflet';

// Import Leaflet's CSS. This is crucial for the map to render correctly.
import 'leaflet/dist/leaflet.css';

// --- 1. Define a TypeScript interface for our signal data ---
// This ensures every signal object has the correct properties and types.
interface TrafficSignal {
  id: number;
  position: LatLngExpression; // Use Leaflet's type for coordinates
  name: string;
}

// --- 2. Data for Your Traffic Signals ---
// We declare that this array will contain objects matching the TrafficSignal interface.
const trafficSignals: TrafficSignal[] = [
  { id: 1, position: [19.059381,72.836801], name: "Shri Narayan Daji Salian Chowk Signal" }, 
  { id: 2, position: [19.059360,72.834176], name: "Perry Road Signal" },       
  { id: 3, position: [19.059541,72.829502], name: "Goverdhan Das O Kalantri Chowk Signal" }, 
  { id: 4, position: [19.055200,72.830034], name: "St. Stanislaus Signal" }, 
];

// --- 3. Custom Icon for the Traffic Signal ---
// We use L.divIcon to create a custom icon using an emoji.

// Control the traffic signal size here.
// Simply change this number to make the icons bigger or smaller.
const ICON_SIZE: number = 40; 

const trafficSignalIcon = new L.DivIcon({
  html: `<span style="font-size: ${ICON_SIZE}px;">🚦</span>`,
  className: "bg-transparent border-0", // Use transparent background and no border
  iconSize: [ICON_SIZE, ICON_SIZE],
  // Adjust anchor to be half the width and the full height to pin the bottom of the emoji
  iconAnchor: [ICON_SIZE / 2, ICON_SIZE], 
  popupAnchor: [0, -ICON_SIZE]
});

// Define the component using the React.FC (Functional Component) type
const TrafficMap: React.FC = () => {
  // The map is centered in a wider view that includes both Bandra and Khar.
  const mapCenter: LatLngExpression = [19.059418, 72.836874];

  // The map bounds are expanded to show a larger area.
  const mapBounds: LatLngBoundsExpression = [
    [19.042575,72.819271], // Southwest corner (ensures southern signals are visible)
    [19.067235,72.843627]  // Northeast corner (expanded north)
  ];

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={15} // Zoomed out slightly to fit the larger area
      style={{ height: '100%', width: '100%' }}
      maxBounds={mapBounds} // This locks the panning to the defined bounds
      minZoom={14}          // This prevents zooming out too far
    >
      {/* --- The Map Background (Tile Layer) --- */}
      {/* This uses OpenStreetMap data, which is free and perfect for road layouts. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* --- Placing Markers on the Map --- */}
      {/* We map over our `trafficSignals` array to create a Marker for each one. */}
      {trafficSignals.map((signal) => (
        <Marker key={signal.id} position={signal.position} icon={trafficSignalIcon}>
          <Popup>
            <div>
              <h3>{signal.name}</h3>
              <p>Traffic Simulation will go here!</p>
              {/* This is where you would embed your friend's simulation component */}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default TrafficMap;