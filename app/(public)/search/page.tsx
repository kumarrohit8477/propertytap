'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(`/properties${qs ? `?${qs}` : ''}`);
  }, [router, searchParams]);

  return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
      Loading properties...
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading properties...</div>}>
      <SearchRedirect />
    </Suspense>
  );
}
