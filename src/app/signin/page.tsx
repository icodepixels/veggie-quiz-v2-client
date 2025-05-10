'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../store/hooks';
import { signIn } from '../store/authSlice';
import AuthForm from '../components/AuthForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (email: string) => {
    try {
      setError(null);

      // Step 1: Get token
      const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Invalid email');
      }

      const { access_token } = await tokenResponse.json();

      // Step 2: Get user details
      const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();

      // Step 3: Update Redux store
      dispatch(signIn({
        user: userData,
        token: access_token,
      }));

      // Redirect to home page
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to continue your plant journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="p-8">
            <AuthForm
              mode="signin"
              onSubmit={handleSubmit}
              submitButtonText="Sign In"
              error={error}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <a
              href="/signup"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Create one here
            </a>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
          {/* Additional decorative leaf */}
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-100 rounded-full opacity-10 blur-2xl transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}