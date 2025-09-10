'use client';

import LoginPage from '@/components/LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();


  // This is the security guard for the login page.
  useEffect(() => {
    // If the user is already logged in, it sends them to the home page.
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  // If the user is logged in, show a loading message while we redirect.
  if (isLoggedIn) {
    return <p className="text-center p-10">You are already logged in. Redirecting...</p>;
  }

  // If the user is not logged in, show the actual login form.
  return <LoginPage />;
}
