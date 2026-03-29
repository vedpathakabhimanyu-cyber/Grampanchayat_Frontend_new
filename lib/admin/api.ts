// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Helper function to make API calls
const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add Content-Type for JSON requests
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  register: async (email: string, password: string, role = "admin") => {
    return apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    return apiCall("/auth/me");
  },
};

// Representatives APIs
export const representativesAPI = {
  getAll: async () => {
    return apiCall("/representatives");
  },

  save: async (representatives: any[]) => {
    return apiCall("/representatives", {
      method: "POST",
      body: JSON.stringify({ representatives }),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/representatives/${id}`, {
      method: "DELETE",
    });
  },

  uploadImage: async (file: File, category = "officials") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);

    return apiCall("/representatives/upload", {
      method: "POST",
      body: formData,
    });
  },
};

// Certificates APIs
export const certificatesAPI = {
  getAll: async () => {
    return apiCall("/certificates");
  },

  save: async (certificates: any[]) => {
    return apiCall("/certificates", {
      method: "POST",
      body: JSON.stringify({ certificates }),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/certificates/${id}`, {
      method: "DELETE",
    });
  },
};

// Images APIs
export const imagesAPI = {
  getAll: async (category?: string) => {
    const query = category ? `?category=${category}` : "";
    return apiCall(`/images${query}`);
  },

  upload: async (
    file: File,
    title?: string,
    description?: string,
    category = "gallery"
  ) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title || "");
    formData.append("description", description || "");
    formData.append("category", category);

    return apiCall("/images/upload", {
      method: "POST",
      body: formData,
    });
  },

  delete: async (id: string) => {
    return apiCall(`/images/${id}`, {
      method: "DELETE",
    });
  },
};

// Infrastructure APIs
export const infrastructureAPI = {
  getAll: async () => {
    return apiCall("/infrastructure");
  },

  getBySubcategory: async (subcategory: string) => {
    return apiCall(
      `/infrastructure/subcategory/${encodeURIComponent(subcategory)}`
    );
  },

  save: async (infrastructure: any[], subcategory?: string) => {
    return apiCall("/infrastructure", {
      method: "POST",
      body: JSON.stringify({ infrastructure, subcategory }),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/infrastructure/${id}`, {
      method: "DELETE",
    });
  },
};

// Historical Data APIs
export const historicalAPI = {
  get: async () => {
    return apiCall("/historical");
  },

  save: async (events: any[], places: any[], awards: any[]) => {
    return apiCall("/historical", {
      method: "POST",
      body: JSON.stringify({ events, places, awards }),
    });
  },

  deleteEvent: async (id: string) => {
    return apiCall(`/historical/events/${id}`, {
      method: "DELETE",
    });
  },

  deletePlace: async (id: string) => {
    return apiCall(`/historical/places/${id}`, {
      method: "DELETE",
    });
  },

  deleteAward: async (id: string) => {
    return apiCall(`/historical/awards/${id}`, {
      method: "DELETE",
    });
  },
};

// Grampanchayat Info APIs
export const grampanchayatAPI = {
  get: async () => {
    return apiCall("/grampanchayat");
  },

  save: async (info: any) => {
    return apiCall("/grampanchayat", {
      method: "POST",
      body: JSON.stringify(info),
    });
  },
};

// Website Data APIs (for public frontend)
export const websiteAPI = {
  getAll: async () => {
    return apiCall("/website/all");
  },

  getOfficials: async () => {
    return apiCall("/website/officials");
  },

  getGallery: async () => {
    return apiCall("/website/gallery");
  },
};

// Announcements APIs
export const announcementsAPI = {
  getAll: async () => {
    return apiCall("/announcements");
  },

  save: async (announcements: any[]) => {
    return apiCall("/announcements", {
      method: "POST",
      body: JSON.stringify({ announcements }),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/announcements/${id}`, {
      method: "DELETE",
    });
  },

  uploadDocument: async (file: File, category = "announcements") => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("category", category);

    return apiCall("/announcements/upload", {
      method: "POST",
      body: formData,
    });
  },
};

// Hero Images APIs
export const heroImagesAPI = {
  getAll: async () => {
    return apiCall("/hero-images");
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiCall("/hero-images/upload", {
      method: "POST",
      body: formData,
    });
  },

  delete: async (id: string) => {
    return apiCall(`/hero-images/${id}`, {
      method: "DELETE",
    });
  },

  updateOrder: async (id: string, order: number) => {
    return apiCall(`/hero-images/${id}/order`, {
      method: "PATCH",
      body: JSON.stringify({ order }),
    });
  },
};

// Tax Payment APIs
export const taxPaymentAPI = {
  get: async () => {
    return apiCall("/tax-payment");
  },

  save: async (data: any) => {
    return apiCall("/tax-payment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiCall("/tax-payment/upload", {
      method: "POST",
      body: formData,
    });
  },

  delete: async () => {
    return apiCall("/tax-payment", {
      method: "DELETE",
    });
  },

  deleteImage: async () => {
    return apiCall("/tax-payment/image", {
      method: "DELETE",
    });
  },
};

// Projects & Works
export const projectsAPI = {
  getAll: async () => {
    return apiCall("/projects");
  },
  getById: async (id: string) => {
    return apiCall(`/projects/${id}`);
  },
  save: async (data: any) => {
    return apiCall("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return apiCall(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiCall("/users");
  },
  create: async (userData: {
    email: string;
    password: string;
    role: string;
    permissions: string[];
  }) => {
    return apiCall("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
  update: async (
    id: string,
    updates: {
      email?: string;
      role?: string;
      permissions?: string[];
      is_active?: boolean;
    }
  ) => {
    return apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },
  delete: async (id: string) => {
    return apiCall(`/users/${id}`, {
      method: "DELETE",
    });
  },
  me: async () => {
    return apiCall("/users/me");
  },
};

export default {
  auth: authAPI,
  users: usersAPI,
  representatives: representativesAPI,
  certificates: certificatesAPI,
  images: imagesAPI,
  infrastructure: infrastructureAPI,
  historical: historicalAPI,
  grampanchayat: grampanchayatAPI,
  website: websiteAPI,
  announcements: announcementsAPI,
  heroImages: heroImagesAPI,
};
