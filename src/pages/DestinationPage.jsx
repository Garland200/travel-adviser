import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StarIcon, HeartIcon, MapPinIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function DestinationPage() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const [destination, setDestination] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${id}`);
        const data = await response.json();
        setDestination(data);
      } catch (error) {
        console.error('Error fetching destination:', error);
      }
    };
    fetchDestination();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const review = {
      ...newReview,
      userId: user.id,
      date: new Date().toISOString().split('T')[0]
    };

    // Mock submission
    setDestination(prev => ({
      ...prev,
      reviews: [...prev.reviews, review]
    }));
    setNewReview({ rating: 5, comment: '' });
  };

  if (!destination) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="col-span-1">
          <img 
            src={destination.images[0]} 
            alt={destination.name}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {destination.images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${destination.name} ${i + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Destination Info */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPinIcon className="h-6 w-6 mr-2" />
            <span>{destination.location}</span>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-6 w-6 text-yellow-500 mr-1" />
            <span className="text-2xl font-bold">{destination.rating}</span>
            <span className="ml-2 text-gray-600">({destination.reviews.length} reviews)</span>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(destination.id)}
          className={`p-2 rounded-full ${
            user?.favorites?.includes(destination.id)
              ? 'text-red-500 bg-red-100'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          <HeartIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-8">{destination.description}</p>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {/* Add Review Form */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                className="w-20 px-3 py-2 border rounded"
              >
                {[5,4,3,2,1].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Share your experience..."
                className="w-full px-4 py-2 border rounded-lg"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {destination.reviews.map(review => (
            <div key={review.id} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-medium">{review.rating}</span>
                <span className="ml-2 text-gray-500 text-sm">{review.date}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}