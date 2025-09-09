'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [policeId, setPoliceId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [policeIdError, setPoliceIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  // Predefined login credentials
  const validCredentials = [
    { policeId: 'OFFICER123', password: '123456' },
    { policeId: 'TRAFFIC001', password: '654321' },
    { policeId: 'PATROL202', password: '202520' }
  ];

  const validatePoliceId = () => {
    const policeIdRegex = /^[a-zA-Z0-9]+$/;
    if (!policeIdRegex.test(policeId)) {
      setPoliceIdError('Police ID must be alphanumeric (letters and numbers only)');
      return false;
    }
    setPoliceIdError('');
    return true;
  };

  const validatePassword = () => {
    const passwordRegex = /^[0-9]+$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Your password must contain only numbers');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const isPoliceIdValid = validatePoliceId();
    const isPasswordValid = validatePassword();
    
    if (isPoliceIdValid && isPasswordValid) {
      const isValidLogin = validCredentials.some(
        cred => cred.policeId === policeId && cred.password === password
      );
      
      if (isValidLogin) {
        console.log('Login successful:', { policeId, rememberMe });
        
        if (rememberMe) {
          localStorage.setItem('policeId', policeId);
        }
        
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to main page (/) instead of /dashboard
        router.push('/');
      } else {
        setLoginError('Invalid Police ID or password');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">GATI</h1>
          
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="policeId" className="block text-sm font-medium text-white">
                Police ID
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="policeId"
                  name="policeId"
                  type="text"
                  required
                  className="pl-10 appearance-none relative block w-full px-3 py-3 border border-white/30 bg-white/5 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your Police ID"
                  value={policeId}
                  onChange={(e) => setPoliceId(e.target.value)}
                  onBlur={validatePoliceId}
                />
              </div>
              {policeIdError && <p className="mt-2 text-sm text-red-300">{policeIdError}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 appearance-none relative block w-full px-3 py-3 border border-white/30 bg-white/5 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                />
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-300">{passwordError}</p>}
            </div>

            {loginError && (
              <div className="bg-red-400/20 border border-red-400/30 rounded-lg p-3">
                <p className="text-red-200 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {loginError}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-400 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-300 hover:text-blue-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center text-xs text-blue-300/80 bg-white/5 rounded-full px-4 py-2">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            
          </div>
          <p className="mt-4 text-xs text-blue-200/60">GATI © 2025</p>
        </div>
      </div>
    </main>
  );
}