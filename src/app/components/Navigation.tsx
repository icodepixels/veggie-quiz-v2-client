'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '../store/hooks';
import Image from 'next/image';

// Custom CSS for rainbow animation
const rainbowStyle = {
  backgroundImage: 'linear-gradient(to right, #8b5cf6, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6)',
  backgroundSize: '200% 100%',
  animation: 'rainbowMove 8s linear infinite',
};

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md relative">
      {/* Rainbow Border with inline styles */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={rainbowStyle}
      />

      <style jsx global>{`
        @keyframes rainbowMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center py-2">
              <Image
                src="/logo-v2.png"
                alt="Veggie Quiz Logo"
                width={150}
                height={75}
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-400'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive('/profile')
                      ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-pink-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive('/signin')
                      ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Log In</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-400 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}