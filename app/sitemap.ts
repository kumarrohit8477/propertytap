import { MetadataRoute } from 'next';
import { create_server_client } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = create_server_client();

  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .eq('status', 'active');

  const property_urls: MetadataRoute.Sitemap = (properties ?? []).map((p) => ({
    url: `https://propertytap.in/properties/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

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
    ...property_urls,
  ];
}
