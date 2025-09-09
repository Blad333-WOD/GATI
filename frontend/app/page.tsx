'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Dynamically import the map component to ensure it only runs in the browser
const Map = dynamic(
  () => import('@/components/TrafficMap'),
  { 
    ssr: false,
    loading: () => <p className="text-center p-10">Loading map...</p>
  }
);

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // This is the page's security guard. It runs when the page loads.
  useEffect(() => {
    // If the auth system says we are not logged in, redirect to the login page.
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // While checking, or if redirecting, show a simple message.
  if (!isLoggedIn) {
    return <p className="text-center p-10">Redirecting to login...</p>;
  }
  
  // If the user is logged in, show the map inside the centered container.
  return (
    // This <main> tag acts as the page's background and centers its content.
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      {/* This <div> is the visible container that holds your map. */}
      {/* It has the rounded corners, shadow, and specific size from our original design. */}
      <div className="h-[70vh] w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden">
        <Map />
      </div>
    </main>
  );
}

