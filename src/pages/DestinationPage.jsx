import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDestination } from '../hooks/useDestinations';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { ReviewList } from '../components/reviews/ReviewList';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  StarIcon, 
  HeartIcon, 
  MapPinIcon, 
  ChatBubbleLeftIcon, 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function DestinationPage() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const { destination, loading, error } = useDestination(id);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Initialize reviews when destination loads
  useState(() => {
    if (destination?.reviews) {
      setReviews(destination.reviews);
    }
  }, [destination]);

  // Handle image gallery navigation
  const navigateImage = (direction) => {
    const images = destination?.images || [];
    const currentIndex = images.indexOf(selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    }
    
    setSelectedImage(images[newIndex]);
  };

  // Handle new review submission
  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!user) return;
    
    try {
      await toggleFavorite(destination.id);
      toast.success(
        user.favorites?.includes(destination.id) 
          ? 'Removed from favorites' 
          : 'Added to favorites'
      );
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const isFavorite = user?.favorites?.includes(parseInt(id));

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <Button as={Link} to="/dashboard">
        Back to Dashboard
      </Button>
    </div>
  );
  if (!destination) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Link 
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to destinations
          </Link>
        </motion.nav>

        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="lg:col-span-2 relative">
            <img
              src={selectedImage || destination.image}
              alt={destination.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-xl cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setSelectedImage(selectedImage || destination.image)}
            />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {destination.images?.slice(0, 4).map((img, index) => (
              <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                src={img}
                alt={`${destination.name} ${index + 1}`}
                className={`w-full h-24 lg:h-28 object-cover rounded-lg cursor-pointer transition-all hover:scale-105 ${
                  selectedImage === img ? 'ring-4 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                onClick={() => setSelectedImage(null)}
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              
              <button 
                className="absolute left-4 text-white p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedImage}
                alt={destination.name}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              <button 
                className="absolute right-4 text-white p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl font-bold text-gray-900">{destination.name}</h1>
                    <Badge variant="primary">{destination.type}</Badge>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span className="text-lg">{destination.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <StarIcon className="h-6 w-6 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-2xl font-bold">{destination.rating}</span>
                      <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant={isFavorite ? 'primary' : 'outline'}
                  onClick={handleFavoriteToggle}
                  disabled={!user}
                  className="flex items-center gap-2"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About this destination</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{destination.description}</p>
              </Card>
            </motion.div>

            {/* Reviews Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <ChatBubbleLeftIcon className="h-6 w-6 mr-3" />
                  Reviews & Experiences
                </h2>
                
                <div className="space-y-8">
                  <ReviewForm 
                    destinationId={destination.id} 
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                  <ReviewList reviews={reviews} />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 sticky top-24">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold">
                      ${destination.priceRange?.min || '??'}
                    </span>
                    <span className="text-gray-600">per night</span>
                  </div>
                  {destination.priceRange?.max && (
                    <p className="text-sm text-gray-500">
                      Up to ${destination.priceRange.max} per night
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Best time to visit</p>
                      <p className="text-sm">{destination.bestTimeToVisit || 'Year-round'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Price range</p>
                      <p className="text-sm">
                        ${destination.priceRange?.min || '??'} - ${destination.priceRange?.max || '??'} per night
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mb-4" size="lg">
                  Check Availability
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </Card>
            </motion.div>

            {/* Amenities */}
            {destination.amenities && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
                  <div className="space-y-3">
                    {destination.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <WifiIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}