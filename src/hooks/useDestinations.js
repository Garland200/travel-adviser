import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useDestinations = (filters = {}) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        let query = supabase.from('destinations').select('*');
        
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        
        const { data, error } = await query.order('rating', { ascending: false });
        
        if (error) throw error;
        
        let filteredData = data || [];
        
        if (filters.search) {
          filteredData = filteredData.filter(d => 
            d.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            d.location.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        if (filters.minRating) {
          filteredData = filteredData.filter(d => d.rating >= filters.minRating);
        }
        
        setDestinations(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [filters.search, filters.type, filters.minRating]);

  return { destinations, loading, error, refetch: () => fetchDestinations() };
};

export const useDestination = (id) => {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setDestination(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDestination();
  }, [id]);

  return { destination, loading, error };
};