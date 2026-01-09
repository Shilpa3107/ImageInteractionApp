import { useState } from 'react';
import { Photo } from '../hooks/useUnsplashPhotos';

interface EmojiReactions {
  [key: string]: number;
}

interface ImageCardProps {
  photo: Photo;
  onReact: (photoId: string, emoji: string) => void;
  reactions: EmojiReactions;
}

const EMOJIS = ['👍', '❤️', '😍', '😮', '😂', '😢'];

const ImageCard: React.FC<ImageCardProps> = ({ photo, onReact, reactions }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onReact(photo.id, emoji);
    setShowEmojis(false);
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowEmojis(false);
      }}
    >
      <img
        src={photo.urls.small}
        alt={photo.alt_description || 'Unsplash photo'}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojis(!showEmojis);
              }}
              className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg hover:bg-opacity-100 transition-all"
              aria-label="Add reaction"
            >
              <span className="text-xl">😊</span>
            </button>
            
            {showEmojis && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 flex space-x-1 bg-white rounded-full p-1 shadow-lg">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmojiClick(emoji);
                    }}
                    className="text-2xl hover:scale-125 transform transition-transform"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={photo.user.profile_image.small}
              alt={photo.user.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-700">{photo.user.username}</span>
          </div>
          <div className="text-sm text-gray-500">
            ❤️ {photo.likes}
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.entries(reactions).map(([emoji, count]) => (
            count > 0 && (
              <span 
                key={emoji} 
                className="text-sm bg-gray-100 rounded-full px-2 py-1"
              >
                {emoji} {count}
              </span>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

interface EmojiImageGridProps {
  photos: Photo[];
  isLoading?: boolean;
  onLoadMore?: () => void;
}

const EmojiImageGrid: React.FC<EmojiImageGridProps> = ({ 
  photos, 
  isLoading = false, 
  onLoadMore 
}) => {
  const [reactions, setReactions] = useState<Record<string, EmojiReactions>>({});

  const handleReact = (photoId: string, emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [photoId]: {
        ...prev[photoId],
        [emoji]: (prev[photoId]?.[emoji] || 0) + 1
      }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <ImageCard
            key={photo.id}
            photo={photo}
            onReact={handleReact}
            reactions={reactions[photo.id] || {}}
          />
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {onLoadMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmojiImageGrid;
