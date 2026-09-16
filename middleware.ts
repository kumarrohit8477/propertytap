import { type NextRequest } from 'next/server';
import { update_session } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await update_session(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
