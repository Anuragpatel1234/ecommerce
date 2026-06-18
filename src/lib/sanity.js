import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'your-project-id', // Replace with your project ID
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2023-05-03', // Use today's date or the latest API version
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

/**
 * Fetch data using a GROQ query
 * @param {string} query 
 * @param {object} params 
 */
export const fetchSanity = async (query, params = {}) => {
  try {
    return await client.fetch(query, params);
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    throw error;
  }
};
