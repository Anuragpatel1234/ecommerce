import { useState, useEffect } from 'react';
import { client } from '../lib/sanity';

/**
 * Hook to fetch data from Sanity
 * @param {string} query GROQ query
 * @param {object} params Query parameters
 * @returns {object} { data, loading, error }
 */
export const useSanityData = (query, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await client.fetch(query, params);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching from Sanity:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query, JSON.stringify(params)]);

  return { data, loading, error };
};
