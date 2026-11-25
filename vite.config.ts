import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load environment variables from .env and .env.local without requiring a prefix
  const env = loadEnv(mode, process.cwd(), '');

  const get_env = (...keys: string[]) => {
    for (const k of keys) {
      if (env[k]) return env[k];
    }
    return '';
  };

  const supabase_url = get_env('PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_URL');
  const supabase_anon_key = get_env('PUBLIC_SUPABASE_ANON_KEY', 'PUBLIC_SUPABASE_ANON_KEY', 'PUBLIC_SUPABASE_ANON_KEY');
  const razorpay_key = get_env('PUBLIC_RAZORPAY_KEY_ID', 'NEXT_PUBLIC_RAZORPAY_KEY_ID', 'VITE_RAZORPAY_KEY_ID', 'RAZORPAY_KEY_ID');
  const web3forms_key = get_env('WEB3FORMS_ACCESS_KEY', 'WEB3FORMS_ACCESS_KEY', 'WEB3FORMS_ACCESS_KEY', 'WEB3FORMS_ACCESS_KEY');

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
      'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(supabase_url),
      'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(supabase_url),
      'process.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(supabase_anon_key),
      'process.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(supabase_anon_key),
      'process.env.PUBLIC_RAZORPAY_KEY_ID': JSON.stringify(razorpay_key),
      'process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID': JSON.stringify(razorpay_key),
      'process.env.WEB3FORMS_ACCESS_KEY': JSON.stringify(web3forms_key),
      'process.env.WEB3FORMS_ACCESS_KEY': JSON.stringify(web3forms_key),
    },
    server: {
      port: 3000,
      open: false,
    },
  };
});
