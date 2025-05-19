'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '../store/hooks';
import Image from 'next/image';

// Custom CSS for rainbow animation
// Define styles using camelCase for consistent client/server rendering
const rainbowStyle = {
  backgroundImage: 'linear-gradient(to right, #FBE9A7, #388E3C, #66BB6A, #43A047, #FFF3D6, #FF8A30, #F57C00, #3E2C1A, #FBE9A7)',
  backgroundSize: '200% 100%',
  animationName: 'rainbowMove',
  animationDuration: '8s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
};

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Close mobile menu when a link is clicked
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

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

      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center">
            <Link href="/" className="flex items-center py-2 flex-shrink-0" onClick={closeMenu}>
              <Image
                src="/veggie-quiz-carrot.png"
                alt="Veggie Quiz Logo"
                width={70}
                height={70}
              />
              <Image
                src="/logo-v4.png"
                alt="Veggie Quiz Logo"
                width={150}
                height={75}
              />
            </Link>

                        {/* Mission statement */}
            <div className="mt-2 md:mt-0 md:ml-6 text-sm max-w-lg bg-gradient-to-r from-green-50 to-amber-50 p-3 rounded-lg border border-green-100">
              <div>
                <p className="text-gray-700 leading-snug">
                  <span className="font-semibold text-green-700">Unlock the science of plant-based nutrition</span> through our fun, bite-sized quizzes. Discover how <span className="italic">fruits</span>, <span className="italic">veggies</span>, <span className="italic">herbs</span>, and <span className="italic">legumes</span> fuel your body and protect your health!
                </p>
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                isActive('/')
                  ? 'bg-yellow-50 text-amber-800 border-b-2 border-amber-400'
                  : 'text-gray-700 hover:bg-yellow-50 hover:text-amber-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className='sr-only'>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive('/profile')
                      ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-400'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className='sr-only'>Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive('/signin')
                      ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Log In</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-amber-600 text-white hover:bg-amber-500 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden absolute top-2 right-4 z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-600 hover:bg-amber-50 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        } md:hidden absolute top-full left-0 right-0 transition-all duration-200 ease-in-out z-[100]`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white shadow-lg">
          <Link
            href="/"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive('/')
                ? 'bg-yellow-50 text-amber-800'
                : 'text-gray-700 hover:bg-yellow-50 hover:text-amber-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className='sr-only'>Home</span>
            </div>
          </Link>

          {isAuthenticated ? (
            <Link
              href="/profile"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/profile')
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </div>
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/signin')
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Log In
                </div>
              </Link>
              <Link
                href="/signup"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium bg-amber-600 text-white hover:bg-amber-500 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign Up
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}