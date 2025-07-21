import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const DestinationCard = ({ destination, index = 0 }) => {
  const { user, toggleFavorite } = useAuth();
  const isFavorite = user?.favorites?.includes(destination.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleFavorite(destination.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="group">
        <Link to={`/destination/${destination.id}`}>
          <div className="relative overflow-hidden">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-3 right-3">
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isFavorite 
                    ? 'bg-red-500/20 text-red-500' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                disabled={!user}
              >
                {isFavorite ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="absolute top-3 left-3">
              <Badge variant="primary">{destination.type}</Badge>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {destination.name}
              </h3>
              <div className="flex items-center ml-2">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium ml-1">{destination.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{destination.location}</span>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {destination.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  ${destination.priceRange?.min || '??'}
                </span>
                {destination.priceRange?.max && (
                  <span> - ${destination.priceRange.max}</span>
                )}
                <span className="ml-1">per night</span>
              </div>
              <span className="text-sm text-blue-600 font-medium group-hover:text-blue-800">
                View details →
              </span>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};