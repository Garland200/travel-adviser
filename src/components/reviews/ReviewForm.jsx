import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const ReviewForm = ({ destinationId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview = {
        id: Date.now(),
        userId: user.id,
        username: user.username,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0],
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
      };

      onReviewSubmitted(newReview);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-800 mb-4">Sign in to leave a review</p>
        <Button as="a" href="/login" variant="primary">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              {star <= (hoveredRating || rating) ? (
                <StarSolidIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <StarIcon className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating} star{rating !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience at this destination..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
          required
          maxLength={500}
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {comment.length}/500 characters
        </div>
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!comment.trim()}
        className="w-full"
      >
        Submit Review
      </Button>
    </motion.form>
  );
};