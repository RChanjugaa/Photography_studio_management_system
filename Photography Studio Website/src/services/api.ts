// API Service - Connect Frontend to Backend
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API requests
export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data?: any
) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

// === CLIENTS API ===
export const clientsAPI = {
  getAll: () => apiCall('/clients'),
  getOne: (id: number) => apiCall(`/clients/${id}`),
  create: (data: any) => apiCall('/clients', 'POST', data),
  update: (id: number, data: any) => apiCall(`/clients/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/clients/${id}`, 'DELETE'),
  getStats: () => apiCall('/clients/stats/overview'),
};

// === BOOKINGS API ===
export const bookingsAPI = {
  getAll: () => apiCall('/bookings'),
  getOne: (id: number) => apiCall(`/bookings/${id}`),
  create: (data: any) => apiCall('/bookings', 'POST', data),
  update: (id: number, data: any) => apiCall(`/bookings/${id}`, 'PUT', data),
  updateStatus: (id: number, status: string) =>
    apiCall(`/bookings/${id}/status`, 'PATCH', { status }),
  delete: (id: number) => apiCall(`/bookings/${id}`, 'DELETE'),
  getStats: () => apiCall('/bookings/stats/overview'),
};

// === EMPLOYEES API ===
export const employeesAPI = {
  getAll: () => apiCall('/employees'),
  getOne: (id: number) => apiCall(`/employees/${id}`),
  create: (data: any) => apiCall('/employees', 'POST', data),
  update: (id: number, data: any) => apiCall(`/employees/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/employees/${id}`, 'DELETE'),
  getPublicGallery: () => apiCall('/employees/public/gallery'),
};

// === EVENTS API ===
export const eventsAPI = {
  getAll: () => apiCall('/events'),
  getOne: (id: number) => apiCall(`/events/${id}`),
  create: (data: any) => apiCall('/events', 'POST', data),
  update: (id: number, data: any) => apiCall(`/events/${id}`, 'PUT', data),
  updateStatus: (id: number, status: string) =>
    apiCall(`/events/${id}/status`, 'PATCH', { status }),
  delete: (id: number) => apiCall(`/events/${id}`, 'DELETE'),
  getByType: (eventType: string) => apiCall(`/events/type/${eventType}`),
};

// === PAYMENTS API ===
export const paymentsAPI = {
  getAll: () => apiCall('/payments'),
  getOne: (id: number) => apiCall(`/payments/${id}`),
  create: (data: any) => apiCall('/payments', 'POST', data),
  update: (id: number, data: any) => apiCall(`/payments/${id}`, 'PUT', data),
  complete: (id: number) => apiCall(`/payments/${id}/complete`, 'PATCH'),
  delete: (id: number) => apiCall(`/payments/${id}`, 'DELETE'),
  getStats: () => apiCall('/payments/stats/overview'),
  getByClient: (clientId: number) => apiCall(`/payments/client/${clientId}`),
};

// === GALLERY API ===
export const galleryAPI = {
  getAll: () => apiCall('/gallery'),
  getOne: (id: number) => apiCall(`/gallery/${id}`),
  create: (data: any) => apiCall('/gallery', 'POST', data),
  bulkUpload: (bookingId: number, images: any[]) => 
    apiCall('/gallery/bulk/upload', 'POST', { bookingId, images }),
  delete: (id: number) => apiCall(`/gallery/${id}`, 'DELETE'),
  getByBooking: (bookingId: number) => apiCall(`/gallery/booking/${bookingId}`),
};

// === FEEDBACK API ===
export const feedbackAPI = {
  getAll: () => apiCall('/feedback'),
  getOne: (id: number) => apiCall(`/feedback/${id}`),
  create: (data: any) => apiCall('/feedback', 'POST', data),
  update: (id: number, data: any) => apiCall(`/feedback/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/feedback/${id}`, 'DELETE'),
};

// === ADMIN API ===
export const adminAPI = {
  getDashboardStats: () => apiCall('/admin/dashboard/stats'),
  getRecentActivity: () => apiCall('/admin/activity/recent'),
  getRevenueReport: () => apiCall('/admin/reports/revenue'),
  getBookingsReport: () => apiCall('/admin/reports/bookings'),
  getTopClients: () => apiCall('/admin/clients/top'),
  getUpcomingBookings: () => apiCall('/admin/bookings/upcoming'),
  getPerformanceMetrics: () => apiCall('/admin/metrics/performance'),
};

// === AUTHENTICATION API ===
export const authAPI = {
  adminLogin: (username: string, password: string) =>
    apiCall('/auth/admin-login', 'POST', { username, password }),
  adminRegister: (username: string, password: string, email: string) =>
    apiCall('/auth/admin-register', 'POST', { username, password, email }),
  clientLogin: (email: string, password: string) =>
    apiCall('/auth/client-login', 'POST', { email, password }),
  clientRegister: (firstName: string, lastName: string, email: string, phone: string, password: string) =>
    apiCall('/auth/client-register', 'POST', { firstName, lastName, email, phone, password }),
};
