'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../store/hooks';
import { signIn } from '../store/authSlice';
import AuthForm from '../components/AuthForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (email: string) => {
    try {
      setError(null);

      // Extract username from email (everything before @)
      const username = email.split('@')[0];

      // First try to create a new account
      const createResponse = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }),
      });

      if (!createResponse.ok) {
        // If user already exists, try to sign them in
        if (createResponse.status === 400) {
          // Step 1: Get token
          const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!tokenResponse.ok) {
            throw new Error('Failed to sign in with existing account');
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
          return;
        }
        throw new Error('Failed to create account');
      }

      // If account creation was successful, get the token and sign in
      const { access_token } = await createResponse.json();
      const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      dispatch(signIn({
        user: userData,
        token: access_token,
      }));

      // Redirect to home page
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Our Garden!</h2>
          <p className="text-gray-600">Create an account to start your plant journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="p-8">
            <AuthForm
              mode="signup"
              onSubmit={handleSubmit}
              submitButtonText="Create Account"
              error={error}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a
              href="/signin"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Sign in here
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