import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || ''; // To be provided by user

const unsplashApi = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
});

export interface UnsplashImage {
    id: string;
    urls: {
        regular: string;
        small: string;
        thumb: string;
    };
    user: {
        name: string;
        username: string;
    };
    description: string | null;
    alt_description: string | null;
    width: number;
    height: number;
}

export const fetchImages = async ({ pageParam = 1 }): Promise<UnsplashImage[]> => {
    if (!UNSPLASH_ACCESS_KEY) {
        // If no key, return some mock data to keep the app functional for demo
        console.warn('Unsplash Access Key missing. Using mock data.');
        return new Array(10).fill(null).map((_, i) => ({
            id: `mock-${pageParam}-${i}`,
            urls: {
                regular: `https://picsum.photos/seed/${pageParam}-${i}/800/600`,
                small: `https://picsum.photos/seed/${pageParam}-${i}/400/300`,
                thumb: `https://picsum.photos/seed/${pageParam}-${i}/200/150`,
            },
            user: {
                name: 'Demo User',
                username: 'demouser',
            },
            description: 'A beautiful placeholder image',
            alt_description: 'Placeholder',
            width: 800,
            height: 600,
        }));
    }

    const { data } = await unsplashApi.get('/photos', {
        params: {
            page: pageParam,
            per_page: 12,
            order_by: 'latest',
        },
    });
    return data;
};
