import { init } from '@instantdb/react';

// Replace with your InstantDB App ID
const APP_ID = import.meta.env.VITE_INSTANT_APP_ID || '00000000-0000-0000-0000-000000000000';

export interface Schema {
    images: {
        id: string;
        url: string;
        author: string;
        createdAt: number;
    };
    reactions: {
        id: string;
        imageId: string;
        userId: string;
        emoji: string;
        createdAt: number;
    };
    comments: {
        id: string;
        imageId: string;
        userId: string;
        username: string;
        userColor: string;
        text: string;
        createdAt: number;
    };
    feedEvents: {
        id: string;
        type: 'reaction' | 'comment';
        imageId: string;
        userId: string;
        username: string;
        payload: any;
        createdAt: number;
    };
}

export const db = init<any>({ appId: APP_ID });
