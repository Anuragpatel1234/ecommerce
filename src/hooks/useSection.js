import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Custom hook to fetch website section data
 * @param {string} sectionKey - The unique key of the section to fetch
 * @returns {object} - { section, loading, error }
 */
export const useSection = (sectionKey) => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sectionKey) {
      setLoading(false);
      return;
    }

    const fetchSection = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/sections/${sectionKey}`);
        setSection(response.data);
      } catch (err) {
        console.error(`Error fetching section ${sectionKey}:`, err);
        setError(err.response?.data?.message || 'Failed to load section');
        setSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [sectionKey]);

  return { section, loading, error };
};

/**
 * Custom hook to fetch multiple sections
 * @param {string} sectionType - Optional filter by section type
 * @returns {object} - { sections, loading, error }
 */
export const useSections = (sectionType = null) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = sectionType 
          ? `${API_BASE_URL}/api/sections?type=${sectionType}`
          : `${API_BASE_URL}/api/sections`;
        
        const response = await axios.get(url);
        setSections(response.data.sections || []);
      } catch (err) {
        console.error('Error fetching sections:', err);
        setError(err.response?.data?.message || 'Failed to load sections');
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [sectionType]);

  return { sections, loading, error };
};

