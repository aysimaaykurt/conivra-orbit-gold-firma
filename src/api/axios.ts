import axios from 'axios';

// Base URL - environment variable'dan alınabilir
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inform-helen-manual-overseas.trycloudflare.com/api/v1/';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
  (config) => {
    // Token'ı localStorage'dan al
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized - Token geçersiz veya süresi dolmuş
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Kontrol/test modunda sayfalardan dışarı atmaması için yoruma alındı:
        /*
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('currentTenantId');
        localStorage.removeItem('tenantName');
        localStorage.removeItem('organizations');
        window.location.href = '/login';
        */
        console.warn("401 Unauthorized alındı, ancak kontrol modu aktif olduğu için çıkış yapılmadı.");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

