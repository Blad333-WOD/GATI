'use client';

import dynamic from 'next/dynamic';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check login status (sessionStorage or localStorage as per your logic)
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const Map = useMemo(() =>
    dynamic(
      () => import('@/components/TrafficMap'),
      {
        loading: () => <p className="text-center p-10">A map is loading...</p>,
        ssr: false
      }
    ),
    []
  );

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="h-[70vh] w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden">
        <Map />
      </div>
    </main>
  );
}

