import React from 'react';
import type { UnsplashImage } from '../../api/unsplash';
import { useReactions } from '../../hooks/useInteractions';
import { MessageSquare, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';

interface ImageCardProps {
    image: UnsplashImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
    const { setSelectedImageId } = useUserStore();
    const { getCounts, addReaction } = useReactions(image.id);
    const counts = getCounts();

    const handleReaction = (e: React.MouseEvent, emoji: string) => {
        e.stopPropagation();
        addReaction(emoji);
    };

    return (
        <motion.div
            layoutId={`card-${image.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedImageId(image.id)}
            className="group relative cursor-pointer aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl"
        >
            {/* Image Content */}
            <img
                src={image.urls.small}
                alt={image.alt_description || ''}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Hover Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white">
                        {image.user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium truncate">
                        {image.user.name}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => handleReaction(e, '🔥')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-dark text-xs font-bold hover:bg-white/10 transition-colors"
                        >
                            🔥 <span className="text-white">{counts['🔥'] || 0}</span>
                        </button>
                        <button
                            onClick={(e) => handleReaction(e, '💖')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-dark text-xs font-bold hover:bg-white/10 transition-colors"
                        >
                            💖 <span className="text-white">{counts['💖'] || 0}</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                        <MessageSquare className="w-4 h-4" />
                        <Share2 className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Static Little Badge for Reactions */}
            {Object.keys(counts).length > 0 && (
                <div className="absolute top-4 right-4 flex gap-1 group-hover:opacity-0 transition-opacity">
                    {Object.entries(counts).slice(0, 2).map(([emoji, count]: [string, any]) => (
                        <div key={emoji} className="glass-dark px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                            {emoji} {count}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ImageCard;
