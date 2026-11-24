export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  locality?: string;
  city: string;
  state?: string;
  displayName: string;
}

export async function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        reject(err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocationResult> {
  // Strategy 1: BigDataCloud reverse geocode (CORS-friendly, fast, very accurate in India)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Near Me';
      const locality = data.locality && data.locality !== city ? data.locality : undefined;
      return {
        latitude,
        longitude,
        city,
        locality,
        state: data.principalSubdivision,
        displayName: [locality, city].filter(Boolean).join(', ') || city,
      };
    }
  } catch (err) {
    console.warn('BigDataCloud geocode failed, trying fallback', err);
  }

  // Strategy 2: OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.district || addr.state_district || 'Near Me';
      const locality = addr.suburb || addr.neighbourhood || addr.road || undefined;
      return {
        latitude,
        longitude,
        city,
        locality,
        state: addr.state,
        displayName: [locality, city].filter(Boolean).join(', ') || city,
      };
    }
  } catch (err) {
    console.warn('Nominatim geocode failed', err);
  }

  return {
    latitude,
    longitude,
    city: 'Current Location',
    displayName: 'Current Location',
  };
}

export function getGoogleMapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

export function getGoogleMapsDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
