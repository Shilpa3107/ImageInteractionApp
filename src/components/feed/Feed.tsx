import React from 'react';
import { db } from '../../api/instantdb';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Flame, ExternalLink } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

const Feed: React.FC = () => {
    const { setSelectedImageId } = useUserStore();
    const { isLoading, data } = db.useQuery({
        feedEvents: {
            $: {
                limit: 20,
            },
        },
    });

    const events = ((data as any)?.feedEvents || []).sort((a: any, b: any) => b.createdAt - a.createdAt);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800/50" />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-10 glass-dark rounded-3xl border border-zinc-800/50">
                <p className="text-zinc-500 text-sm">Waiting for interactions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence initial={false}>
                {events.map((event: any) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ x: -2 }}
                        onClick={() => setSelectedImageId(event.imageId)}
                        className="group relative p-4 glass-dark rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all flex items-start gap-3 cursor-pointer"
                    >
                        <div className="shrink-0 mt-1">
                            {event.type === 'reaction' ? (
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 text-blue-500" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-300">
                                <span className="font-bold text-white">{event.username}</span>
                                {event.type === 'reaction' ? ' reacted with ' : ' commented on '}
                                <span className="font-bold text-white group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                                    an image <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                            </p>

                            {event.type === 'comment' && (
                                <p className="text-xs text-zinc-500 mt-1 italic line-clamp-1">
                                    "{event.payload?.text}"
                                </p>
                            )}

                            {event.type === 'reaction' && (
                                <div className="mt-1 flex items-center gap-1">
                                    <span className="text-lg">{event.payload?.emoji}</span>
                                </div>
                            )}

                            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-2">
                                {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Feed;
