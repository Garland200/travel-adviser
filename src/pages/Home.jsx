import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlobeAmericasIcon, MagnifyingGlassIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/destinations?_limit=4');
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-blue-600 text-white">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Explore curated travel destinations and plan your perfect trip
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-white rounded-lg p-2 shadow-lg">
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 mx-4" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="flex-1 p-4 text-gray-900 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link 
                to={searchTerm ? `/dashboard?search=${encodeURIComponent(searchTerm)}` : '/dashboard'}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Travel Advisor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: GlobeAmericasIcon,
                title: "Global Destinations",
                description: "Access thousands of destinations worldwide"
              },
              {
                icon: StarIcon,
                title: "Expert Reviews",
                description: "Real traveler reviews and ratings"
              },
              {
                icon: HeartIcon,
                title: "Personalized Plans",
                description: "Save and organize your favorite spots"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <Link to={`/destination/${destination.id}`}>
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <GlobeAmericasIcon className="h-5 w-5 mr-2" />
                    <span>{destination.location}</span>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-medium">{destination.rating}</span>
                    <span className="text-gray-500 ml-1">({destination.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
              </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Journey Today</h2>
            <p className="text-xl mb-8">Join our community of travelers and unlock amazing features</p>
            <Link 
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2024 Travel Advisor. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="/about" className="hover:text-blue-400 transition">About</a>
            <a href="/contact" className="hover:text-blue-400 transition">Contact</a>
            <a href="/terms" className="hover:text-blue-400 transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}