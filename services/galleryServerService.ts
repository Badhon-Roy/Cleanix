import { GalleryItem } from './galleryService';

const BACKEND_INTERNAL_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'http://localhost:5000/api/v1';

export const fetchActiveGalleryServer = async (): Promise<GalleryItem[]> => {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/gallery/active?page=1&limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('Failed to fetch active gallery server-side:', res.statusText);
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error in fetchActiveGalleryServer:', error);
    return [];
  }
};
