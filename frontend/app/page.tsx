'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function Home() {
  // This prepares the map component to be displayed.
  const Map = useMemo(() => 
    // Dynamically loads the map component.
    dynamic(
      () => import('@/components/TrafficMap'),
      {
        // Shows a simple text message while the map is loading.
        loading: () => <p className="text-center p-10">A map is loading...</p>,
        // IMPORTANT: Prevents the map from rendering on the server (it needs a browser).
        ssr: false
      }
    ),
    // The empty array `[]` ensures this setup only runs once.
    []
  );
 
  return (
    // Container to hold the map.
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      {/* the container for your map.
        easily change its size here. For example:
        - h-[500px] w-full max-w-3xl -> A fixed height, full width up to a certain max.
        - h-[80vh] w-[80vw] -> 80% of the viewport height and width.
      */}
      <div className="h-[70vh] w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden">
        <Map />
      </div>
    </main>
  );
}

