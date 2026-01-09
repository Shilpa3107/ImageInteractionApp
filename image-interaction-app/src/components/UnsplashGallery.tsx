import { useInView } from 'react-intersection-observer';
import { useUnsplashPhotos } from '../hooks/useUnsplashPhotos';
import { useEffect, useState } from 'react';

const UnsplashGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState('nature'); // Default search query
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useUnsplashPhotos(query);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchQuery);
  };

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Error loading photos: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for photos..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={!searchQuery.trim()}
          >
            Search
          </button>
        </form>
      </div>

      {allPhotos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No photos found. Try a different search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allPhotos.map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description || 'Unsplash photo'}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={photo.user.profile_image.small}
                      alt={photo.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{photo.user.username}</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>❤️ {photo.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading indicator at the bottom for infinite scroll */}
          <div ref={ref} className="mt-8">
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            {!hasNextPage && allPhotos.length > 0 && (
              <p className="text-center text-gray-500 py-4">No more photos to load</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UnsplashGallery;
