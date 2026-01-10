import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    userId: string;
    username: string;
    userColor: string;
    setIdentity: (id: string, name: string, color: string) => void;
}

const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
];

const adjectives = ['Cool', 'Swift', 'Bright', 'Lively', 'Epic', 'Neon', 'Bold'];
const nouns = ['Panda', 'Eagle', 'Fox', 'Tiger', 'Nova', 'Storm', 'Zenith'];

const generateRandomName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun} ${Math.floor(Math.random() * 999)}`;
};

const generateRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userId: generateId(),
            username: generateRandomName(),
            userColor: generateRandomColor(),
            setIdentity: (userId, username, userColor) => set({ userId, username, userColor }),
        }),
        {
            name: 'user-storage',
        }
    )
);
