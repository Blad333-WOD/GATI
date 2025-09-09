'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation'; // <-- We import a hook to read the current URL

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname(); // <-- This gets the current path, e.g., "/" or "/stats"

  // --- THIS IS THE FIX ---
  // The header will now hide itself if:
  // 1. The user is not logged in (to hide it on the login page).
  // 2. The user is on the "/stats" page (to prevent the double header).
  if (!isLoggedIn || pathname === '/stats') {
    return null;
  }

  // If neither of the above is true, we show the beautiful floating header.
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-x-6 bg-white/80 backdrop-blur-md shadow-lg rounded-full border border-gray-200/80 px-6 py-3">
        {/* GATI Logo and Name */}
        <Link href="/" className="flex items-center gap-x-2 text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m1.085 1.085L9 17.585l-1.085-1.085m1.085 1.085L9 17.585m0 0l-1.085 1.085m1.085-1.085L9 17.585m2.25-1.5h3.375m-3.375 0h-7.5m7.5 0h-3.375" />
          </svg>
          GATI
        </Link>
        
        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex items-center gap-x-6">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user?.policeId}</span>
          </span>
          <Link href="/stats" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
        </div>

        <button
          onClick={logout}
          className="ml-4 flex items-center gap-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 font-semibold py-2 px-4 rounded-full shadow-sm border border-gray-300 transition-all text-sm"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;

