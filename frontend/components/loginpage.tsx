'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [policeId, setPoliceId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
        const params = new URLSearchParams();
        params.append('username', policeId);
        params.append('password', password);

        const response = await fetch('http://127.0.0.1:8000/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Invalid credentials');
        }

        const data = await response.json();
        login(data.access_token);

    } catch (error) {
        if (error instanceof Error) {
            setLoginError(error.message);
        } else {
            setLoginError('An unknown error occurred. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-white">GATI</h1>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="policeId" className="block text-sm font-medium text-white">
                Police ID
              </label>
              <div className="mt-1">
                <input
                  id="policeId"
                  name="policeId"
                  type="text"
                  required
                  className="pl-3 appearance-none relative block w-full px-3 py-3 border border-white/30 bg-white/5 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your Police ID"
                  value={policeId}
                  onChange={(e) => setPoliceId(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-3 appearance-none relative block w-full px-3 py-3 border border-white/30 bg-white/5 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* --- THIS IS THE ADDED CODE --- */}
            {/* This block will only appear if there is a loginError */}
            {loginError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-red-200 text-sm">{loginError}</p>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}