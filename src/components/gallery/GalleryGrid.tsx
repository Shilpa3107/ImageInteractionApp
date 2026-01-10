import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchImages } from '../../api/unsplash';
import ImageCard from './ImageCard';
import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const GalleryGrid: React.FC = () => {
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['images'],
        queryFn: fetchImages,
        getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
        initialPageParam: 1,
    });

    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    if (status === 'pending') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-900 animate-pulse" />
                ))}
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                <p className="text-zinc-400">Failed to load images. Please check your API key.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.pages.map((group, i) => (
                    <React.Fragment key={i}>
                        {group.map((image) => (
                            <ImageCard key={image.id} image={image} />
                        ))}
                    </React.Fragment>
                ))}
            </div>

            <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage ? (
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading more...</span>
                    </div>
                ) : hasNextPage ? (
                    <span className="text-zinc-600">Scroll for more</span>
                ) : (
                    <span className="text-zinc-600">You've reached the end!</span>
                )}
            </div>
        </div>
    );
};

export default GalleryGrid;
