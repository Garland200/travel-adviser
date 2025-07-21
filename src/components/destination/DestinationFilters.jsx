import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';

export const DestinationFilters = ({ filters, onFiltersChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const destinationTypes = ['Beach', 'Mountain', 'City', 'Historical', 'Cultural', 'Adventure'];
  const priceRanges = [
    { label: 'Budget ($0-100)', min: 0, max: 100 },
    { label: 'Mid-range ($100-300)', min: 100, max: 300 },
    { label: 'Luxury ($300+)', min: 300, max: 1000 }
  ];

  const handleTypeChange = (type) => {
    onFiltersChange({
      ...filters,
      type: filters.type === type ? '' : type
    });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating
    });
  };

  const handlePriceRangeChange = (range) => {
    onFiltersChange({
      ...filters,
      priceRange: filters.priceRange?.min === range.min ? null : range
    });
  };

  const activeFiltersCount = [
    filters.type,
    filters.minRating > 0,
    filters.priceRange
  ].filter(Boolean).length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <FunnelIcon className="h-4 w-4 mr-2" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Destination Type */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Destination Type</h4>
              <div className="flex flex-wrap gap-2">
                {destinationTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.type === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h4>
              <div className="flex gap-2">
                {[3, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.minRating === rating
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {rating}+ ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceRangeChange(range)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.priceRange?.min === range.min
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};