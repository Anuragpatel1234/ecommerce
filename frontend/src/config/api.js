// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  ADMIN: {
    DASHBOARD_STATS: `${API_BASE_URL}/api/admin/dashboard/stats`,
    PRODUCTS: `${API_BASE_URL}/api/admin/products`,
    PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/admin/products/${id}`,
    ORDERS: `${API_BASE_URL}/api/admin/orders`,
    ORDER_BY_ID: (id) => `${API_BASE_URL}/api/admin/orders/${id}`,
    ORDER_STATUS: (id) => `${API_BASE_URL}/api/admin/orders/${id}/status`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    USER_BY_ID: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
    SECTIONS: `${API_BASE_URL}/api/admin/sections`,
    SECTION_BY_ID: (id) => `${API_BASE_URL}/api/admin/sections/${id}`,
    SECTION_BY_KEY: (key) => `${API_BASE_URL}/api/admin/sections/${key}`,
    UPLOAD: `${API_BASE_URL}/api/admin/upload`,
  },
  CMS: {
    SETTINGS: `${API_BASE_URL}/api/admin/cms/settings`,
    UPLOAD: `${API_BASE_URL}/api/admin/cms/upload`,
    MEDIA: `${API_BASE_URL}/api/admin/cms/media`,
    MEDIA_DELETE: (filename) => `${API_BASE_URL}/api/admin/cms/media/${filename}`,
    SECTIONS_REORDER: `${API_BASE_URL}/api/admin/cms/sections/reorder`,
    SECTIONS_BY_TYPE: (type) => `${API_BASE_URL}/api/admin/cms/sections/type/${type}`,
    SECTION_BY_KEY: (key) => `${API_BASE_URL}/api/admin/cms/sections/key/${key}`,
    // Admin section CRUD (reuse existing)
    SECTIONS: `${API_BASE_URL}/api/admin/sections`,
    SECTION_BY_ID: (id) => `${API_BASE_URL}/api/admin/sections/${id}`,
  },
};

export default API_BASE_URL;

