import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../hooks/useDestinations';
import { DestinationCard } from '../components/destination/DestinationCard';
import { DestinationFilters } from '../components/destination/DestinationFilters';
import { SearchBar } from '../components/layout/SearchBar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { GlobeAmericasIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minRating: 0,
    priceRange: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('rating');
  const destinationsPerPage = 9;

  const { destinations, loading, error } = useDestinations({
    search: searchTerm,
    ...filters
  });

  // Memoized filtered and sorted destinations
  const processedDestinations = useMemo(() => {
    let filtered = destinations.filter(d => {
      const matchesSearch = searchTerm === '' || 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filters.type || d.type === filters.type;
      const matchesRating = d.rating >= filters.minRating;
      const matchesPrice = !filters.priceRange || 
        (d.priceRange?.min >= filters.priceRange.min && d.priceRange?.max <= filters.priceRange.max);
      
      return matchesSearch && matchesType && matchesRating && matchesPrice;
    });

    // Sort destinations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (a.priceRange?.min || 0) - (b.priceRange?.min || 0);
        case 'reviews':
          return (b.reviews?.length || 0) - (a.reviews?.length || 0);
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [destinations, searchTerm, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedDestinations.length / destinationsPerPage);
  const startIndex = (currentPage - 1) * destinationsPerPage;
  const currentDestinations = processedDestinations.slice(startIndex, startIndex + destinationsPerPage);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleFiltersReset = () => {
    setFilters({ type: '', minRating: 0, priceRange: null });
    setSearchTerm('');
    setSortBy('rating');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <GlobeAmericasIcon className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username || 'Explorer'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Discover {processedDestinations.length} amazing destinations
              </p>
            </div>
            
            {/* Search and Controls */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 lg:min-w-[500px]">
              <SearchBar
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
              <div className="flex gap-3">
                <DestinationFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleFiltersReset}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Top Rated</option>
                  <option value="name">A-Z</option>
                  <option value="price">Price</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : (
          <>
            {/* Results Summary */}
            {(searchTerm || filters.type || filters.minRating > 0 || filters.priceRange) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p className="text-blue-800">
                  Found {processedDestinations.length} destinations
                  {searchTerm && ` matching "${searchTerm}"`}
                  {filters.type && ` in ${filters.type}`}
                  {filters.minRating > 0 && ` with ${filters.minRating}+ rating`}
                </p>
              </motion.div>
            )}

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
                </div>

            {/* Empty State */}
            {processedDestinations.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-gray-400 mb-6">
                  <GlobeAmericasIcon className="h-20 w-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No destinations found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any destinations matching your criteria. Try adjusting your search or filters.
                </p>
                <Button onClick={handleFiltersReset}>
                  Reset filters
                </Button>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-12"
              >
                <nav className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </nav>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}