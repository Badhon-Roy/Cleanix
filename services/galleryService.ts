const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1';

export interface GalleryItem {
  _id?: string;
  title: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export const fetchActiveGalleryAPI = async (page = 1, limit = 100) => {
  try {
    const res = await fetch(`${BASE_URL}/gallery/active?page=${page}&limit=${limit}`, { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching active gallery:', error);
    return { success: false, data: [], meta: { hasMore: false, total: 0 } };
  }
};

export const fetchAdminGalleryAPI = async () => {
  try {
    const res = await fetch(`${BASE_URL}/gallery/admin`, { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching admin gallery:', error);
    return { success: false, data: [] };
  }
};

export const createGalleryAPI = async (payload: Partial<GalleryItem>) => {
  try {
    const res = await fetch(`${BASE_URL}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Failed to create gallery item');
    }
    return data;
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    throw error;
  }
};

export const createBulkGalleryAPI = async (payloads: Partial<GalleryItem>[]) => {
  try {
    const res = await fetch(`${BASE_URL}/gallery/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloads),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Failed to create bulk gallery items');
    }
    return data;
  } catch (error: any) {
    console.error('Error creating bulk gallery items:', error);
    throw error;
  }
};

export const updateGalleryAPI = async (id: string, payload: Partial<GalleryItem>) => {
  try {
    const res = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Failed to update gallery item');
    }
    return data;
  } catch (error: any) {
    console.error('Error updating gallery item:', error);
    throw error;
  }
};

export const deleteGalleryAPI = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Failed to delete gallery item');
    }
    return data;
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};

export const deleteBulkGalleryAPI = async (ids: string[]) => {
  try {
    const res = await fetch(`${BASE_URL}/gallery/delete-bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Failed to delete bulk gallery items');
    }
    return data;
  } catch (error: any) {
    console.error('Error deleting bulk gallery items:', error);
    throw error;
  }
};
