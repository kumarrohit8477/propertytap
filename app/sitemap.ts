import { MetadataRoute } from 'next';
import { create_server_client } from '@/lib/supabase/server';

// Encode a city display name into a URL-safe slug e.g. "New Delhi" → "new-delhi"
function encode_city(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = create_server_client();

  // Fetch all active property IDs + city/purpose for both detail pages and city landing pages
  const { data: properties } = await supabase
    .from('properties')
    .select('id, city, purpose, updated_at')
    .eq('status', 'active');

  const property_urls: MetadataRoute.Sitemap = (properties ?? []).map((p) => ({
    url: `https://propertytap.in/properties/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Derive unique city+purpose combinations for landing pages
  const seen = new Set<string>();
  const city_landing_urls: MetadataRoute.Sitemap = [];

  for (const p of properties ?? []) {
    if (!p.city || !p.purpose) continue;
    const key = `${p.purpose}:${p.city.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    city_landing_urls.push({
      url: `https://propertytap.in/properties/city/${p.purpose}/${encode_city(p.city)}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'daily',
      priority: 0.85,
    });
  }

  return [
    {
      url: 'https://propertytap.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://propertytap.in/properties',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://propertytap.in/about',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://propertytap.in/contact',
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: 'https://propertytap.in/pricing',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...city_landing_urls,
    ...property_urls,
  ];
}
