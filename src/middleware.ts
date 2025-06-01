import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isQuizPage = request.nextUrl.pathname.startsWith('/quiz/');

  // Add a custom header to indicate if this is a quiz page
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-is-quiz-page', isQuizPage ? 'true' : 'false');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/:path*',
};