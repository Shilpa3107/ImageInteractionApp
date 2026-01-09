// Get your API key from https://unsplash.com/developers
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
const API_URL = 'https://api.unsplash.com';

export const UNSPLASH_CONFIG = {
  accessKey: ACCESS_KEY,
  endpoints: {
    photos: `${API_URL}/photos`,
    search: `${API_URL}/search/photos`,
  },
  defaultParams: {
    per_page: 12,
    order_by: 'latest',
  },
};
