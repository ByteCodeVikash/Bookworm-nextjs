// src/admin/services/adminApi.ts
import { fetchApi, API_BASE_URL } from "@/utils/api";

function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bookworm_admin_token");
  }
  return null;
}

async function fetchAdmin<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const headers = {
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  return fetchApi<T>(endpoint, {
    ...options,
    headers,
  });
}

export const adminApi = {
  // Image Upload
  // Sends a multipart/form-data POST to the dedicated upload endpoint.
  // Returns the server-stored relative URL for the uploaded image.
  uploadBookCover: async (file: File): Promise<{ url: string }> => {
    const token = getAdminToken();
    const formData = new FormData();
    formData.append("image", file);

    const url = `${API_BASE_URL}/api/admin/upload.php`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        // Do NOT set Content-Type — browser must set it with the multipart boundary
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      let message = `Upload failed: ${response.status} ${response.statusText}`;
      try {
        const json = await response.json();
        if (json?.error) message = json.error;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(message);
    }

    const json = await response.json();
    if (json.status !== "success" || !json.url) {
      throw new Error(json.error || "Upload endpoint returned an unexpected response.");
    }

    // Prepend API base URL so the path is absolute
    return { url: `${API_BASE_URL}${json.url}` };
  },

  // Authentication
  login: async (payload: any) => {
    return fetchApi<{ status: string; token: string; user: any }>("/api/admin/auth.php", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  
  verifyToken: async () => {
    return fetchAdmin<{ status: string; valid: boolean }>("/api/admin/auth.php");
  },
  
  // Dashboard
  getDashboardStats: async () => {
    return fetchAdmin<{ status: string; data: any }>("/api/admin/dashboard.php");
  },
  
  // Books CRUD
  getBooks: async (params?: { search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    
    return fetchAdmin<{ status: string; data: { books: any[]; pagination: any } }>(
      `/api/admin/books.php?${query.toString()}`
    );
  },
  
  getBookById: async (id: string) => {
    return fetchAdmin<{ status: string; data: any }>(`/api/admin/books.php?id=${id}`);
  },
  
  createBook: async (book: any) => {
    return fetchAdmin<{ status: string; message: string; id: string }>("/api/admin/books.php", {
      method: "POST",
      body: JSON.stringify(book),
    });
  },
  
  updateBook: async (id: string, book: any) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/books.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    });
  },
  
  deleteBook: async (id: string) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/books.php?id=${id}`, {
      method: "DELETE",
    });
  },
  
  // Categories CRUD
  getCategories: async () => {
    return fetchAdmin<{ status: string; data: any[] }>("/api/admin/categories.php");
  },
  
  createCategory: async (category: any) => {
    return fetchAdmin<{ status: string; message: string; id: string }>("/api/admin/categories.php", {
      method: "POST",
      body: JSON.stringify(category),
    });
  },
  
  updateCategory: async (id: string, category: any) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/categories.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    });
  },
  
  deleteCategory: async (id: string) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/categories.php?id=${id}`, {
      method: "DELETE",
    });
  },
  
  // Authors CRUD
  getAuthors: async () => {
    return fetchAdmin<{ status: string; data: any[] }>("/api/admin/authors.php");
  },
  
  createAuthor: async (author: any) => {
    return fetchAdmin<{ status: string; message: string; id: string }>("/api/admin/authors.php", {
      method: "POST",
      body: JSON.stringify(author),
    });
  },
  
  updateAuthor: async (id: string, author: any) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/authors.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(author),
    });
  },
  
  deleteAuthor: async (id: string) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/authors.php?id=${id}`, {
      method: "DELETE",
    });
  },
  
  // Orders CRUD
  getOrders: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    
    return fetchAdmin<{ status: string; data: { orders: any[]; pagination: any } }>(
      `/api/admin/orders.php?${query.toString()}`
    );
  },
  
  getOrderById: async (id: string) => {
    return fetchAdmin<{ status: string; data: any }>(`/api/admin/orders.php?id=${id}`);
  },
  
  updateOrderStatus: async (id: string, status: string) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/orders.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
  
  // Contact messages
  getContactMessages: async () => {
    return fetchAdmin<{ status: string; data: any[] }>("/api/admin/contacts.php");
  },
  
  deleteContactMessage: async (id: number) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/contacts.php?id=${id}`, {
      method: "DELETE",
    });
  },
  
  // Newsletter subscribers
  getSubscribers: async () => {
    return fetchAdmin<{ status: string; data: any[] }>("/api/admin/subscribers.php");
  },
  
  deleteSubscriber: async (id: number) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/subscribers.php?id=${id}`, {
      method: "DELETE",
    });
  },
  
  // Users management
  getUsers: async (params?: { search?: string; role?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.role) query.append("role", params.role);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    
    return fetchAdmin<{ status: string; data: { users: any[]; pagination: any } }>(
      `/api/admin/users.php?${query.toString()}`
    );
  },
  
  getUserById: async (id: number) => {
    return fetchAdmin<{ status: string; data: any }>(`/api/admin/users.php?id=${id}`);
  },
  
  updateUserRole: async (id: number, role: string) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/users.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  },
  
  deleteUser: async (id: number) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/users.php?id=${id}`, {
      method: "DELETE",
    });
  },
  
  // Store Settings
  getSettings: async () => {
    return fetchAdmin<{ status: string; data: Record<string, string> }>("/api/admin/settings.php");
  },
  
  updateSettings: async (settings: Record<string, string>) => {
    return fetchAdmin<{ status: string; message: string }>("/api/admin/settings.php", {
      method: "POST",
      body: JSON.stringify(settings),
    });
  },

  // Banners CRUD
  getBanners: async () => {
    return fetchAdmin<{ status: string; data: any[] }>("/api/admin/banners.php");
  },

  createBanner: async (banner: any) => {
    return fetchAdmin<{ status: string; message: string; id: string }>("/api/admin/banners.php", {
      method: "POST",
      body: JSON.stringify(banner),
    });
  },

  updateBanner: async (id: number, banner: any) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/banners.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(banner),
    });
  },

  deleteBanner: async (id: number) => {
    return fetchAdmin<{ status: string; message: string }>(`/api/admin/banners.php?id=${id}`, {
      method: "DELETE",
    });
  },

  // Wishlist Viewer (read-only)
  getWishlist: async (params?: { user_id?: number; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.user_id) query.append("user_id", String(params.user_id));
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    return fetchAdmin<{ status: string; data: { wishlist: any[]; pagination: any } }>(
      `/api/admin/wishlist.php?${query.toString()}`
    );
  },

  // Transactions Viewer (read-only)
  getTransactions: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    return fetchAdmin<{ status: string; data: { transactions: any[]; pagination: any } }>(
      `/api/admin/transactions.php?${query.toString()}`
    );
  },
};
