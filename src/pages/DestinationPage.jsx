import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StarIcon, HeartIcon, MapPinIcon, ChatBubbleLeftIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function DestinationPage() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const [destination, setDestination] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch destination data
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${id}`);
        if (!response.ok) throw new Error('Failed to fetch destination');
        const data = await response.json();
        setDestination(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchDestination();
  }, [id]);

  // Handle image gallery navigation
  const navigateImage = (direction) => {
    const images = destination.images;
    const currentIndex = images.indexOf(selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    }
    
    setSelectedImage(images[newIndex]);
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmittingReview(true);
    
    // Mock API call simulation
    setTimeout(() => {
      const review = {
        id: Date.now(),
        userId: user.id,
        username: user.username,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        avatar: user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
      };

      setDestination(prev => ({
        ...prev,
        reviews: [review, ...prev.reviews],
        rating: ((prev.rating * prev.reviews.length) + review.rating) / (prev.reviews.length + 1)
      }));
      
      setNewReview({ rating: 5, comment: '' });
      setIsSubmittingReview(false);
    }, 1000);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!user) return;
    toggleFavorite(destination.id);
  };

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!destination) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 relative">
          <img
            src={selectedImage || destination.image}
            alt={destination.name}
            className="w-full h-96 object-cover rounded-xl cursor-pointer"
            onClick={() => setSelectedImage(selectedImage || destination.image)}
          />
          {selectedImage && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <button 
                className="absolute top-4 right-4 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              <button 
                className="absolute left-4 text-white p-2 bg-black bg-opacity-50 rounded-full"
                onClick={() => navigateImage('prev')}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <img
                src={selectedImage}
                alt={destination.name}
                className="max-h-[80vh] max-w-[90vw] object-contain"
              />
              <button 
                className="absolute right-4 text-white p-2 bg-black bg-opacity-50 rounded-full"
                onClick={() => navigateImage('next')}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {destination.images.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${destination.name} ${index + 1}`}
              className={`w-full h-48 object-cover rounded-lg cursor-pointer ${selectedImage === img ? 'ring-4 ring-blue-500' : ''}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Destination Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPinIcon className="h-6 w-6 mr-2" />
            <span>{destination.location}</span>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-6 w-6 text-yellow-500 mr-1" />
            <span className="text-2xl font-bold">{destination.rating.toFixed(1)}</span>
            <span className="ml-2 text-gray-600">({destination.reviews.length} reviews)</span>
          </div>
        </div>
        <button
          onClick={handleFavoriteToggle}
          disabled={!user}
          className={`p-2 rounded-full ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
            user?.favorites?.includes(destination.id)
              ? 'text-red-500 bg-red-100'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title={!user ? "Sign in to save favorites" : ""}
        >
          <HeartIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-8">{destination.description}</p>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ChatBubbleLeftIcon className="h-6 w-6 mr-2" />
          Traveler Reviews
        </h2>

        {/* Add Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${newReview.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setNewReview({...newReview, rating: star})}
                  />
                ))}
                <span className="ml-2 text-gray-600">{newReview.rating} stars</span>
              </div>
            </div>
            <div className="mb-4">
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Share your experience..."
                className="w-full p-2 border rounded"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-blue-800">
              <Link to="/login" className="font-medium hover:underline">
                Sign in
              </Link> to add reviews and save favorites
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {destination.reviews.length > 0 ? (
            destination.reviews.map(review => (
              <div key={review.id} className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={review.avatar} 
                    alt={review.username} 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.username}</h4>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${review.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    {review.userId === user?.id && (
                      <span className="text-xs text-gray-500 mt-1 block">Your review</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}