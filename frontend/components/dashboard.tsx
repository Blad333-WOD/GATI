'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const savedPoliceId = localStorage.getItem('policeId');
    
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setUser(savedPoliceId || 'Officer');
      setIsLoading(false);
    }

    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem('policeId');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Authenticating...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Traffic Command Center</h1>
                <p className="text-blue-300 text-sm">Welcome, {user}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-mono">{currentTime.toLocaleTimeString()}</div>
                <div className="text-blue-300 text-sm">{currentTime.toLocaleDateString()}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl border border-blue-500/30">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Active Incidents</p>
                <p className="text-3xl font-bold">24</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 shadow-xl border border-red-500/30">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-200 text-sm">Violations Today</p>
                <p className="text-3xl font-bold">156</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl border border-green-500/30">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-green-200 text-sm">Officers Active</p>
                <p className="text-3xl font-bold">18</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl border border-purple-500/30">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p className="text-purple-200 text-sm">Avg Response Time</p>
                <p className="text-3xl font-bold">8.2m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-blue-300">Recent Activities</h2>
            <div className="space-y-4">
              {[
                { time: '14:23', event: 'Speeding violation recorded on Highway 401', location: 'Camera #T-402' },
                { time: '14:15', event: 'Accident reported at Main & 5th intersection', location: 'Officer #45' },
                { time: '13:58', event: 'Traffic congestion cleared on Downtown Express', location: 'System Auto' },
                { time: '13:42', event: 'Red light violation at Oak Street crossing', location: 'Camera #R-156' },
                { time: '13:30', event: 'Roadside assistance requested - Officer dispatched', location: 'Dispatch' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <div className="text-blue-300 font-mono text-sm">{activity.time}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.event}</p>
                    <p className="text-xs text-blue-300 mt-1">{activity.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-blue-300">Command Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📊', label: 'Traffic Analysis', color: 'from-blue-500 to-blue-700' },
                { icon: '🚦', label: 'Signal Control', color: 'from-green-500 to-green-700' },
                { icon: '📹', label: 'Camera Feed', color: 'from-purple-500 to-purple-700' },
                { icon: '🚨', label: 'Emergency Alert', color: 'from-red-500 to-red-700' },
                { icon: '📋', label: 'Generate Report', color: 'from-cyan-500 to-cyan-700' },
                { icon: '👮', label: 'Officer Status', color: 'from-orange-500 to-orange-700' }
              ].map((action, index) => (
                <button
                  key={index}
                  className={`bg-gradient-to-r ${action.color} rounded-xl p-4 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-sm font-medium">{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 bg-green-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center">
            <div className="bg-green-500/20 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-green-200 text-sm">System Status: <span className="font-bold text-green-300">Operational</span></p>
              <p className="text-green-300/80 text-xs">All systems functioning normally. Last updated: {currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}