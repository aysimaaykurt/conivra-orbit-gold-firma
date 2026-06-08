import apiClient from '../axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  GetCurrentUserResponse,
  SendPasswordMailRequest,
  SendPasswordMailResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ApiErrorResponse,
} from './auth.models';

/**
 * Login Service
 * POST /api/v2/auth/login
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  // Geliştirme ve kontrol amacıyla login endpointi devre dışı bırakıldı.
  // Doğrudan başarılı mock verisi dönülüyor.
  const mockUser = {
    id: 1,
    tenantId: 1,
    firstName: "Test",
    lastName: "Kullanıcı",
    email: credentials.email || "test@conivra.com",
    phone: "05555555555",
    status: true,
    subscriptionStatus: "gold",
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', "mock-jwt-token-12345");
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('currentTenantId', "1");
    localStorage.setItem('tenantName', "Conivra Orbit Gold Firma");
  }

  return {
    success: true,
    message: "Giriş başarılı (Kontrol Modu)",
    data: {
      token: {
        token: "mock-jwt-token-12345",
        expiration: new Date(Date.now() + 86400000).toISOString(),
      },
      user: mockUser,
      tenantId: 1,
      tenantName: "Conivra Orbit Gold Firma",
    },
  };
};

/**
 * Register Service
 * POST auth/register
 */
export const register = async (
  registerData: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      'auth/register',
      registerData
    );

    // Eğer register sonrası token dönerse, localStorage'a kaydet
    if (
      response.data.success &&
      response.data.data?.token &&
      typeof window !== 'undefined'
    ) {
      const token = response.data.data.token.token;
      localStorage.setItem('authToken', token);

      if (response.data.data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(response.data.data.user)
        );
      }
    }

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Kayıt işlemi sırasında bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Current User Service
 * GET auth/me
 */
export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  try {
    const response = await apiClient.get<GetCurrentUserResponse>(
      'auth/me'
    );

    if (response.data.success && typeof window !== 'undefined') {
      // User bilgilerini güncelle
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.data.user)
      );

      // Organizasyon listesini kaydet
      localStorage.setItem(
        'organizations',
        JSON.stringify(response.data.data.organizations)
      );
    }

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Kullanıcı bilgileri alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Logout Service
 * Token'ı ve kullanıcı bilgilerini temizle
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('currentTenantId');
    localStorage.removeItem('tenantName');
    localStorage.removeItem('organizations');
  }
};

/**
 * Get stored token
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Get stored user
 */
export const getStoredUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

/**
 * Send Password Mail Service
 * POST auth/sendPasswordMail
 */
export const sendPasswordMail = async (
  data: SendPasswordMailRequest
): Promise<SendPasswordMailResponse> => {
  try {
    const response = await apiClient.post<SendPasswordMailResponse>(
      'auth/sendPasswordMail',
      data
    );

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Doğrulama kodu gönderilirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Change Password Service
 * POST auth/changePassword
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const response = await apiClient.post<ChangePasswordResponse>(
      'auth/changePassword',
      data
    );

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Şifre değiştirilirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

