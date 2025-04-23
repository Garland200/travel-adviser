import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedUser = localStorage.getItem('travelAdvisorUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuthState();
  }, []);

  // Mock login function
  const login = async (credentials) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users?username=${credentials.username}&password=${credentials.password}`
      );
      const users = await response.json();
      
      if (users.length === 0) {
        throw new Error('Invalid credentials');
      }

      const authenticatedUser = users[0];
      localStorage.setItem('travelAdvisorUser', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Mock registration function
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          favorites: [],
        }),
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const newUser = await response.json();
      localStorage.setItem('travelAdvisorUser', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('travelAdvisorUser');
    setUser(null);
  };

  const updateUser = async (updatedUser) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      const data = await response.json();
      setUser(data);
      localStorage.setItem('travelAdvisorUser', JSON.stringify(data));
    } catch (error) {
      console.error('Update user error:', error);
    }
  };
  
// Add this to your existing AuthContext
    const toggleFavorite = async (destinationId) => {
      try {
        const newFavorites = user.favorites.includes(destinationId)
          ? user.favorites.filter(id => id !== destinationId)
          : [...user.favorites, destinationId];
        
        // Update local state immediately for responsive UI
        const updatedUser = { ...user, favorites: newFavorites };
        setUser(updatedUser);
        localStorage.setItem('travelAdvisorUser', JSON.stringify(updatedUser));
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return true;
      } catch (error) {
        console.error('Error updating favorites:', error);
        // Revert on error
        setUser(user);
        return false;
      }
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        toggleFavorite
  
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};