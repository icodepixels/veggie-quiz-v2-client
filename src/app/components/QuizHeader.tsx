'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '../store/hooks';

interface QuizHeaderProps {
  quiz: {
    id: number;
    name: string;
    description: string;
    image?: string;
    theme_color?: string;
  };
}

export default function QuizHeader({ quiz }: QuizHeaderProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const themeColor = quiz.theme_color || '#388E3C';

  return (
    <nav className="bg-white shadow-md relative">
      {/* Rainbow Border with inline styles */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          backgroundImage: `linear-gradient(to right, ${themeColor}, ${themeColor})`,
          backgroundSize: '200% 100%',
          animation: 'gradientMove 8s linear infinite',
        }}
      />

      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center">
            <Link href="/" className="flex items-center py-2 flex-shrink-0">
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

            {/* Quiz-specific mission statement */}
            <div className="mb-2 md:mt-0 md:mx-4 text-sm max-w-lg bg-gradient-to-r from-green-50 to-amber-50 p-3 rounded-lg border border-green-100">
              <div>
                <p className="text-gray-700 leading-snug">
                  <span className="font-semibold text-green-700">{quiz.name}</span> - {quiz.description}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                pathname === '/'
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
              <Link
                href="/profile"
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  pathname === '/profile'
                    ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-400'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className='sr-only'>Profile</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap ${
                    pathname === '/signin'
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
                  className="px-4 py-2 text-sm font-medium bg-amber-600 text-white hover:bg-amber-500 transition-colors duration-200 flex items-center space-x-2 shadow-sm whitespace-nowrap"
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