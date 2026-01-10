import { db } from '../api/instantdb';
import { useUserStore } from '../store/useUserStore';
import { tx, id } from '@instantdb/react';

export const useReactions = (imageId: string) => {
    const { userId, username } = useUserStore();

    const { isLoading, error, data } = db.useQuery({
        reactions: {
            $: {
                where: { imageId },
            },
        },
    });

    const reactions = (data as any)?.reactions || [];

    const addReaction = async (emoji: string) => {
        // Check if user already reacted with this emoji
        const existing = reactions.find((r: any) => r.emoji === emoji && r.userId === userId);

        if (existing) {
            await db.transact([
                tx.reactions[existing.id].delete()
            ]);
            return;
        }

        const reactionId = id();
        const eventId = id();

        await db.transact([
            tx.reactions[reactionId].update({
                imageId,
                userId,
                emoji,
                createdAt: Date.now(),
            }),
            tx.feedEvents[eventId].update({
                type: 'reaction',
                imageId,
                userId,
                username,
                payload: { emoji },
                createdAt: Date.now(),
            }),
        ]);
    };

    const getCounts = () => {
        const counts: Record<string, number> = {};
        reactions.forEach((r: any) => {
            counts[r.emoji] = (counts[r.emoji] || 0) + 1;
        });
        return counts;
    };

    const getUserReactions = () => {
        return reactions.filter((r: any) => r.userId === userId).map((r: any) => r.emoji);
    };

    return { reactions, addReaction, getCounts, getUserReactions, isLoading, error };
};

export const useComments = (imageId: string) => {
    const { userId, username, userColor } = useUserStore();

    const { isLoading, error, data } = db.useQuery({
        comments: {
            $: {
                where: { imageId },
            },
        },
    });

    const comments = ((data as any)?.comments || []).sort((a: any, b: any) => b.createdAt - a.createdAt);

    const addComment = async (text: string) => {
        const commentId = id();
        const eventId = id();

        await db.transact([
            tx.comments[commentId].update({
                imageId,
                userId,
                username,
                userColor,
                text,
                createdAt: Date.now(),
            }),
            tx.feedEvents[eventId].update({
                type: 'comment',
                imageId,
                userId,
                username,
                payload: { text },
                createdAt: Date.now(),
            }),
        ]);
    };

    const deleteComment = async (commentId: string) => {
        await db.transact([
            tx.comments[commentId].delete()
        ]);
    };

    return { comments, addComment, deleteComment, isLoading, error };
};
