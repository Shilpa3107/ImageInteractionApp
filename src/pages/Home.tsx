import React from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';
import Feed from '../components/feed/Feed';
import { useUserStore } from '../store/useUserStore';
import { Camera, Zap, Activity } from 'lucide-react';

const Home: React.FC = () => {
    const { username, userColor } = useUserStore();

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background to-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-dark border-b border-zinc-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-accent-push p-2 rounded-xl shadow-lg shadow-blue-500/20">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            PixelStream
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Active as</span>
                            <span className="text-sm font-semibold" style={{ color: userColor }}>{username}</span>
                        </div>
                        <div
                            className="w-10 h-10 rounded-full border-2 border-zinc-800 flex items-center justify-center font-bold text-white shadow-inner"
                            style={{ backgroundColor: userColor }}
                        >
                            {username.charAt(0)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-6">
                {/* Gallery Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <h2 className="text-2xl font-bold">Discover</h2>
                    </div>
                    <GalleryGrid />
                </div>

                {/* Global Feed Section */}
                <aside className="w-full lg:w-80 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-bold">Live Feed</h2>
                    </div>
                    <div className="sticky top-24">
                        <Feed />
                    </div>
                </aside>
            </main>

            {/* Footer / Mobile Profile */}
            <footer className="md:hidden fixed bottom-6 right-6">
                <div
                    className="px-4 py-2 rounded-full glass-dark text-white text-sm font-medium border border-zinc-700 shadow-2xl animate-bounce"
                    style={{ borderColor: userColor }}
                >
                    👋 {username}
                </div>
            </footer>
        </div>
    );
};

export default Home;
