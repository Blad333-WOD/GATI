'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L, { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SimulationModal from './SimulationModal';

// --- 1. Define a TypeScript interface for our signal data ---
// This ensures every signal object has the correct properties and types.
interface TrafficSignal {
  id: number;
  position: LatLngExpression; // Use Leaflet's type for coordinates
  name: string;
  videoUrl: string; // A property to hold the path to the video file.
}

// --- 2. Data for Traffic Signals ---
// We declare that this array will contain objects matching the TrafficSignal interface.
const trafficSignals: TrafficSignal[] = [
  { id: 1, position: [19.059381, 72.836801], name: "Shri Narayan Daji Salian Chowk Signal", videoUrl: "narayan-chowk-sim.mp4" }, 
  { id: 2, position: [19.059360, 72.834176], name: "Perry Road Signal", videoUrl: "perry-road-sim.mp4" },       
  { id: 3, position: [19.059541, 72.829502], name: "Goverdhan Das O Kalantri Chowk Signal", videoUrl: "goverdhan-das-sim.mp4" }, 
  { id: 4, position: [19.055200, 72.830034], name: "St. Stanislaus Signal", videoUrl: "st-stanislaus-sim.mp4" }, 
];

// --- 3. Custom Icon for the Traffic Signal ---
// L.divIcon to create a custom icon using an emoji.

// Control the traffic signal size here.
// Simply change this number to make the icons bigger or smaller.
const ICON_SIZE: number = 40; 
const trafficSignalIcon = new L.DivIcon({
  html: `<span style="font-size: ${ICON_SIZE}px;">🚦</span>`,
  className: "bg-transparent border-0",
  iconSize: [ICON_SIZE, ICON_SIZE],
  iconAnchor: [ICON_SIZE / 2, ICON_SIZE], 
});

// Define the component using the React.FC (Functional Component) type
const TrafficMap: React.FC = () => {
  // --- State to track the currently selected signal ---
  // When null, no modal is shown. When it holds a signal object, the modal appears.
  const [selectedSignal, setSelectedSignal] = useState<TrafficSignal | null>(null);

  const mapCenter: LatLngExpression = [19.059418, 72.836874];
  const mapBounds: LatLngBoundsExpression = [ [19.042575, 72.819271], [19.067235, 72.843627] ];

  return (
    <>
      <MapContainer 
        center={mapCenter} 
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        maxBounds={mapBounds}
        minZoom={14}
      >
        {/* --- The Map Background (Tile Layer) --- */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* --- Placing Markers on the Map --- */}
        {trafficSignals.map((signal) => (
          <Marker 
            key={signal.id} 
            position={signal.position} 
            icon={trafficSignalIcon}
            // --- We now use event handlers instead of a Popup ---
            eventHandlers={{
              click: () => {
                // When a marker is clicked, we update the state with that signal's data.
                setSelectedSignal(signal); 
              },
            }}
          />
        ))}
      </MapContainer>

      {/* --- Conditionally render the modal --- */}
      {/* This JSX will only be rendered if `selectedSignal` is not null. */}
      {selectedSignal && (
        <SimulationModal 
          // Using the signal's ID as a key is a clever React trick. It forces
          // the component to be completely recreated when you click a new signal,
          // which guarantees the video restarts from the beginning every time.
          key={selectedSignal.id}
          signal={selectedSignal} 
          // pass a function that allows the modal to set our state back to null, closing itself.
          onClose={() => setSelectedSignal(null)} 
        />
      )}
    </>
  );
}

export default TrafficMap;

