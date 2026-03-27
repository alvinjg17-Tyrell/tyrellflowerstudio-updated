import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Add auth header to requests when token exists
const getAuthHeader = () => {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: (email, password) => axios.post(`${API}/auth/login`, { email, password }).then(r => r.data),
  verifyAuth: (token) => axios.get(`${API}/auth/verify`, { 
    headers: { Authorization: `Bearer ${token}` } 
  }).then(r => r.data),

  // Get all content
  getContent: () => axios.get(`${API}/content`).then(r => r.data),

  // Update site content (brand, hero, about, services section, contact)
  updateContent: (data) => axios.put(`${API}/content`, data, { headers: getAuthHeader() }).then(r => r.data),

  // Services CRUD
  getServices: () => axios.get(`${API}/services`).then(r => r.data),
  createService: (data) => axios.post(`${API}/services`, data, { headers: getAuthHeader() }).then(r => r.data),
  updateService: (id, data) => axios.put(`${API}/services/${id}`, data, { headers: getAuthHeader() }).then(r => r.data),
  deleteService: (id) => axios.delete(`${API}/services/${id}`, { headers: getAuthHeader() }).then(r => r.data),

  // Catalog Links CRUD
  getCatalogLinks: () => axios.get(`${API}/catalog-links`).then(r => r.data),
  createCatalogLink: (data) => axios.post(`${API}/catalog-links`, data, { headers: getAuthHeader() }).then(r => r.data),
  updateCatalogLink: (id, data) => axios.put(`${API}/catalog-links/${id}`, data, { headers: getAuthHeader() }).then(r => r.data),
  deleteCatalogLink: (id) => axios.delete(`${API}/catalog-links/${id}`, { headers: getAuthHeader() }).then(r => r.data),

  // Color Palette
  getColorPalette: () => axios.get(`${API}/color-palette`).then(r => r.data),
  updateColorPalette: (data) => axios.put(`${API}/color-palette`, data, { headers: getAuthHeader() }).then(r => r.data),

  // Dynamic Sections CRUD
  getDynamicSections: () => axios.get(`${API}/dynamic-sections`).then(r => r.data),
  createDynamicSection: (data) => axios.post(`${API}/dynamic-sections`, data, { headers: getAuthHeader() }).then(r => r.data),
  updateDynamicSection: (id, data) => axios.put(`${API}/dynamic-sections/${id}`, data, { headers: getAuthHeader() }).then(r => r.data),
  deleteDynamicSection: (id) => axios.delete(`${API}/dynamic-sections/${id}`, { headers: getAuthHeader() }).then(r => r.data),

  // Product Categories CRUD
  getCategories: () => axios.get(`${API}/categories`).then(r => r.data),
  createCategory: (data) => axios.post(`${API}/categories`, data, { headers: getAuthHeader() }).then(r => r.data),
  updateCategory: (id, data) => axios.put(`${API}/categories/${id}`, data, { headers: getAuthHeader() }).then(r => r.data),
  deleteCategory: (id) => axios.delete(`${API}/categories/${id}`, { headers: getAuthHeader() }).then(r => r.data),

  // Upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API}/upload`, formData, { 
      headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" } 
    }).then(r => r.data);
  },
};

