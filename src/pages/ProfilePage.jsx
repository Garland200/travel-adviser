import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/destinations?id=${user.favorites.join(',')}`);
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
    if (user?.favorites?.length) fetchFavorites();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Edit Form */}
      {editMode ? (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-700 mb-8">{user.bio || 'No bio provided'}</p>
      )}

      {/* Favorites Section */}
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <HeartIcon className="h-6 w-6 mr-2 text-red-500" />
        Favorite Destinations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map(destination => (
        <Link 
          to={`/destination/${destination.id}`}
          key={destination.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                <span>{destination.rating.toFixed(1)}</span>
                <span className="ml-2 text-gray-500">({destination.reviews.length})</span>
              </div>
          </div>
        </Link>
        ))}
        {favorites.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No favorites yet - start exploring!
          </div>
        )}
      </div>
    </div>
  );
}