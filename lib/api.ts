// API Configuration for Static Website
import { requestCache } from './requestCache';

const resolveApiBaseUrl = () => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const normalizedUrl = configuredUrl.replace(/\/+$/, "");

  return normalizedUrl.endsWith("/api")
    ? normalizedUrl
    : `${normalizedUrl}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

// Helper function to make API calls with automatic caching
const apiCall = async (endpoint: string, cacheTTL: number = 30 * 1000) => {
  try {
    // Use request cache to deduplicate concurrent requests and cache responses
    return await requestCache.execute(
      endpoint,
      async () => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        return data;
      },
      cacheTTL
    );
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Website Data APIs
export const websiteAPI = {
  // Get all website data
  getAll: async () => {
    return apiCall('/website/all');
  },

  // Get officials/representatives
  getOfficials: async () => {
    return apiCall('/website/officials');
  },

  // Get gallery images
  getGallery: async () => {
    return apiCall('/website/gallery');
  },

  // Get certificates
  getCertificates: async () => {
    return apiCall('/certificates');
  },

  // Get infrastructure
  getInfrastructure: async () => {
    return apiCall('/infrastructure');
  },

  // Get historical data
  getHistorical: async () => {
    return apiCall('/historical');
  },

  // Get grampanchayat info
  getGrampanchayatInfo: async () => {
    return apiCall('/grampanchayat');
  },

  // Get documents (statistics)
  getDocuments: async () => {
    return apiCall('/documents');
  },

  // Get images by category
  getImagesByCategory: async (category: string) => {
    return apiCall(`/images?category=${category}`);
  },

  // Get announcements
  getAnnouncements: async () => {
    return apiCall('/announcements');
  },

  // Get hero images
  getHeroImages: async () => {
    return apiCall('/hero-images');
  },
  
  // Get tax payment info
  getTaxPayment: async () => {
    return apiCall('/tax-payment');
  },

  // Get projects
  getProjects: async () => {
    return apiCall('/projects', 5 * 1000);
  },
};

export default websiteAPI;
