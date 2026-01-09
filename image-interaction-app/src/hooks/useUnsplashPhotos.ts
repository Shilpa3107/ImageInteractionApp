import { useInfiniteQuery } from '@tanstack/react-query';
import { UNSPLASH_CONFIG } from '../config/unsplash';

export interface Photo {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      small: string;
    };
  };
  likes: number;
}

interface FetchPhotosParams {
  pageParam?: number;
  query?: string;
}

interface FetchPhotosResponse {
  photos: Photo[];
  nextPage?: number;
  totalPages?: number;
  total?: number;
}

const fetchPhotos = async ({ 
  pageParam = 1, 
  query = 'nature' 
}: FetchPhotosParams): Promise<FetchPhotosResponse> => {
  const params = new URLSearchParams();
  params.append('page', pageParam.toString());
  params.append('per_page', UNSPLASH_CONFIG.defaultParams.per_page.toString());
  params.append('order_by', UNSPLASH_CONFIG.defaultParams.order_by);
  
  if (query) {
    params.append('query', query);
  }

  const endpoint = query && query !== 'nature' 
    ? UNSPLASH_CONFIG.endpoints.search 
    : UNSPLASH_CONFIG.endpoints.photos;

  const url = `${endpoint}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Client-ID ${UNSPLASH_CONFIG.accessKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }

  const data = await response.json();
  
  if (endpoint.includes('search')) {
    return {
      photos: data.results || [],
      nextPage: data.total_pages > pageParam ? pageParam + 1 : undefined,
      totalPages: data.total_pages,
      total: data.total,
    };
  }
  
  return {
    photos: data || [],
    nextPage: data.length > 0 ? pageParam + 1 : undefined,
  };
};

export const useUnsplashPhotos = (query = '') => {
  return useInfiniteQuery<FetchPhotosResponse, Error>({
    queryKey: ['unsplashPhotos', query],
    queryFn: ({ pageParam }) => fetchPhotos({ pageParam, query }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};
