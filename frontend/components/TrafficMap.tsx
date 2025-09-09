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
  { id: 1, position: [19.0853, 72.9089], name: "Ghatkopar Station Signal" },
  { id: 2, position: [19.0785, 72.9105], name: "LBS Marg Signal" },
  { id: 3, position: [19.0866, 72.9145], name: "Hingwala Lane Signal" }
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
  // The map will be centered on Ghatkopar, Mumbai.
  // We explicitly type mapCenter with Leaflet's LatLngExpression type.
  const mapCenter: LatLngExpression = [19.083, 72.912];

  // Define the boundaries for the map view.
  // These are the South-West and North-East corners of the area you want to lock.
  const mapBounds: LatLngBoundsExpression = [
    [19.070, 72.895], // Southwest corner
    [19.095, 72.925]  // Northeast corner
  ];

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={16} 
      style={{ height: '100%', width: '100%' }}
      maxBounds={mapBounds} // This locks the panning to the defined bounds
      minZoom={15}          // This prevents zooming out too far
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