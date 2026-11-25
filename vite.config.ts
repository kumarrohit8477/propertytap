import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load environment variables from .env and .env.local without requiring a prefix
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        'next/link': path.resolve(__dirname, './lib/shims/link.tsx'),
        'next/image': path.resolve(__dirname, './lib/shims/image.tsx'),
        'next/navigation': path.resolve(__dirname, './lib/shims/navigation.ts'),
      },
    },
    define: {
      'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(
        env.PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL || ''
      ),
      'process.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
        env.PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || ''
      ),
      'process.env.PUBLIC_RAZORPAY_KEY_ID': JSON.stringify(
        env.PUBLIC_RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID || ''
      ),
      'process.env.PUBLIC_WEB3FORMS_ACCESS_KEY': JSON.stringify(
        env.PUBLIC_WEB3FORMS_ACCESS_KEY || env.VITE_WEB3FORMS_ACCESS_KEY || ''
      ),
    },
    server: {
      port: 3000,
      open: false,
    },
  };
});
