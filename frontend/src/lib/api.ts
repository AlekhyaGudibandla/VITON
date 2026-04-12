const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthHeaders(): Promise<HeadersInit> {
  // Get token from Supabase session
  const { supabase } = await import('./supabase');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function uploadUserImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}/upload/user-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload user image');
  }

  return response.json();
}

export async function uploadClothingImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}/upload/clothing-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload clothing image');
  }

  return response.json();
}

export async function uploadClothingUrl(url: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}/upload/clothing-url`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch clothing from URL');
  }

  return response.json();
}

export async function generateTryOn(userImageId: string, clothingImageId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}/tryon/generate`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userImageId, clothingImageId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate try-on');
  }

  return response.json();
}

export async function getTryOnResult(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}/tryon/result/${id}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch result');
  }

  return response.json();
}

export async function getTryOnHistory() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}/tryon/history`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch history');
  }

  return response.json();
}

export type ImageRecord = {
  id: string;
  user_id: string;
  image_type: 'user' | 'clothing';
  storage_path: string;
  original_filename: string;
  url: string;
  created_at: string;
};

export type TryOnResult = {
  id: string;
  user_id: string;
  user_image_id: string;
  clothing_image_id: string;
  result_storage_path: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_time_ms: number;
  error_message: string | null;
  result_url: string | null;
  user_image_url: string;
  clothing_image_url: string;
  created_at: string;
};
