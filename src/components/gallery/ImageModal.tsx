import React, { useState } from 'react';
import type { UnsplashImage } from '../../api/unsplash';
import { useReactions, useComments } from '../../hooks/useInteractions';
import { X, Send, Heart, Flame, Sparkles, Wand2, MessageCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';

interface ImageModalProps {
    image: UnsplashImage;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
    const { userId } = useUserStore();
    const { getCounts, addReaction, getUserReactions } = useReactions(image.id);
    const { comments, addComment, deleteComment } = useComments(image.id);
    const [newComment, setNewComment] = useState('');

    const counts = getCounts();
    const userReactions = getUserReactions();

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(newComment.trim());
            setNewComment('');
        }
    };

    const reactionOptions = [
        { emoji: '🔥', label: 'LIT', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { emoji: '💖', label: 'Love', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { emoji: '✨', label: 'Magic', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { emoji: '🦄', label: 'Epic', icon: Wand2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    const extraEmojis = ['🚀', '💯', '👏', '🎨', '📸', '🌈', '⚡', '🤖'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
                layoutId={`card-${image.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-6xl h-full max-h-[90vh] glass-dark rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/50 text-white/50 hover:text-white hover:bg-black/70 transition-all border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image Section */}
                <div className="flex-[1.5] relative group bg-black flex items-center justify-center overflow-hidden">
                    <img
                        src={image.urls.regular}
                        alt={image.alt_description || ''}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Sidebar Section */}
                <div className="flex-1 flex flex-col min-w-0 bg-zinc-950/50">
                    {/* Header */}
                    <div className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                                {image.user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-lg text-white truncate">{image.user.name}</h3>
                                <p className="text-zinc-500 text-sm">@{image.user.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reactions Grid */}
                    <div className="p-6 border-b border-white/5">
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {reactionOptions.map((r) => {
                                const Icon = r.icon;
                                const isActive = userReactions.includes(r.emoji);
                                return (
                                    <button
                                        key={r.emoji}
                                        onClick={() => addReaction(r.emoji)}
                                        className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${isActive
                                            ? 'bg-white/10 border-white/20 scale-105'
                                            : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08]'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${r.bg} ${r.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">{r.label}</span>
                                            <span className="text-sm font-black text-white">{counts[r.emoji] || 0}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Emoji Picker */}
                        <div className="flex items-center justify-between px-2">
                            <div className="flex gap-2">
                                {extraEmojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => addReaction(emoji)}
                                        className={`text-lg hover:scale-125 transition-transform ${userReactions.includes(emoji) ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'grayscale-[0.5] hover:grayscale-0'}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                        <div className="flex items-center gap-2 mb-2 text-zinc-500">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Discussion</span>
                        </div>

                        {comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                <MessageCircle className="w-12 h-12 mb-2" />
                                <p className="text-sm">Be the first to say something!</p>
                            </div>
                        ) : (
                            comments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-4 group">
                                    <div
                                        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-inner"
                                        style={{ backgroundColor: comment.userColor as string }}
                                    >
                                        {comment.username.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-white" style={{ color: comment.userColor as string }}>{comment.username}</span>
                                                <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
                                                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {comment.userId === userId && (
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all text-zinc-600"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-zinc-300 text-sm leading-relaxed break-words">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Comment Input */}
                    <form onSubmit={handleAddComment} className="p-8 pt-4 bg-zinc-950/80 border-t border-white/5">
                        <div className="relative group">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-blue-600 text-white disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ImageModal;
