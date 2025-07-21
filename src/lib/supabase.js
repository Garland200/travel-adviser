import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:3001';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

// For development, we'll use a mock client that works with json-server
const createMockClient = () => {
  const baseUrl = 'http://localhost:3001';
  
  return {
    auth: {
      signUp: async ({ email, password, options }) => {
        const response = await fetch(`${baseUrl}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            username: options?.data?.username || email.split('@')[0],
            bio: options?.data?.bio || '',
            avatar: options?.data?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            favorites: [],
            created_at: new Date().toISOString()
          })
        });
        const user = await response.json();
        return { data: { user }, error: null };
      },
      
      signInWithPassword: async ({ email, password }) => {
        const response = await fetch(`${baseUrl}/users?email=${email}&password=${password}`);
        const users = await response.json();
        if (users.length === 0) {
          return { data: null, error: { message: 'Invalid credentials' } };
        }
        return { data: { user: users[0] }, error: null };
      },
      
      signOut: async () => {
        return { error: null };
      },
      
      getUser: async () => {
        const user = JSON.parse(localStorage.getItem('travelAdvisorUser') || 'null');
        return { data: { user }, error: null };
      }
    },
    
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => ({
          single: async () => {
            const response = await fetch(`${baseUrl}/${table}?${column}=${value}`);
            const data = await response.json();
            return { data: data[0] || null, error: null };
          },
          async then(resolve) {
            const response = await fetch(`${baseUrl}/${table}?${column}=${value}`);
            const data = await response.json();
            resolve({ data, error: null });
          }
        }),
        order: (column, options = {}) => ({
          async then(resolve) {
            const response = await fetch(`${baseUrl}/${table}?_sort=${column}&_order=${options.ascending ? 'asc' : 'desc'}`);
            const data = await response.json();
            resolve({ data, error: null });
          }
        }),
        async then(resolve) {
          const response = await fetch(`${baseUrl}/${table}`);
          const data = await response.json();
          resolve({ data, error: null });
        }
      }),
      
      insert: (values) => ({
        select: () => ({
          async then(resolve) {
            const response = await fetch(`${baseUrl}/${table}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            });
            const data = await response.json();
            resolve({ data: [data], error: null });
          }
        })
      }),
      
      update: (values) => ({
        eq: (column, value) => ({
          select: () => ({
            async then(resolve) {
              const response = await fetch(`${baseUrl}/${table}/${value}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
              });
              const data = await response.json();
              resolve({ data: [data], error: null });
            }
          })
        })
      })
    })
  };
};

export const supabase = import.meta.env.PROD ? createClient(supabaseUrl, supabaseKey) : createMockClient();