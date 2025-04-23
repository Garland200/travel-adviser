// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  StarIcon, 
  HeartIcon, 
  MapPinIcon,
  MagnifyingGlassIcon,
  GlobeAmericasIcon,
  ArrowsUpDownIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { FunnelIcon } from '@heroicons/react/20/solid';

export default function Dashboard() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    type: '',
    minRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const destinationsPerPage = 6;

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/destinations');
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Filter and sort logic
  const filteredDestinations = destinations
    .filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.type ? d.type === filters.type : true) &&
      d.rating >= filters.minRating
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.reviews.length - a.reviews.length;
    });

  // Pagination
  const indexOfLast = currentPage * destinationsPerPage;
  const indexOfFirst = indexOfLast - destinationsPerPage;
  const currentDestinations = filteredDestinations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDestinations.length / destinationsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.username || 'Explorer'}!
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredDestinations.length} destinations available
              </p>
            </div>
            
            {/* Search and Filters */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={filters.type}
                    onChange={(e) => {
                      setFilters({...filters, type: e.target.value});
                      setCurrentPage(1);
                    }}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="City">City</option>
                    <option value="Historical">Historical</option>
                  </select>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <StarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={filters.minRating}
                    onChange={(e) => {
                      setFilters({...filters, minRating: Number(e.target.value)});
                      setCurrentPage(1);
                    }}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="0">All Ratings</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="name">A-Z</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDestinations.map((destination) => (
              <article key={destination.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <Link to={`/destination/${destination.id}`} className="block">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </Link>
                <div className="p-6"></div>
                  <Link to={`/destination/${destination.id}`} className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                    {destination.name}
                  </Link>                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="truncate">{destination.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{destination.rating}</span>
                        <span className="text-gray-500 ml-1">
                          ({destination.reviews?.length || 0})
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {destination.type}
                      </span>
                    </div>

                    <p className="text-gray-600 line-clamp-3">
                      {destination.description}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        ${destination.priceRange?.min || '??'} - ${destination.priceRange?.max || '??'}
                      </span>
                            <Link
                            to={`/destination/${destination.id}`}
                            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            View details →
                          </Link>
                        </div>
                      </article>
                    ))}
                </div>

            {/* Empty State */}
            {filteredDestinations.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <GlobeAmericasIcon className="h-full w-full" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No destinations found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ type: '', minRating: 0 });
                    setSortBy('rating');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 
                      ? i + 1 
                      : currentPage >= totalPages - 2 
                        ? totalPages - 4 + i 
                        : currentPage - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}