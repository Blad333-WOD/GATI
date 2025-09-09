'use client';

import Link from 'next/link';
// We might need useRouter for the logout functionality in the future
// import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  // const router = useRouter();

  const handleLogout = () => {
    // In a real application, you would handle the logout logic here.
    // This could involve clearing authentication tokens, calling an API endpoint, etc.
    console.log("User logged out");
    // For now, we'll just log to the console. If you had a login page, you might do:
    // router.push('/login');
  };

  return (
    <header className="w-full bg-white shadow-md z-10 relative">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Project Name "GATI" */}
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
            GATI
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {/* Route to "Statistics" */}
          <Link href="/stats" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
            Statistics
          </Link>
          
          {/* A better Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 font-semibold py-2 px-4 rounded-lg shadow-sm border border-gray-300 transition-all duration-200 ease-in-out transform hover:-translate-y-px"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

