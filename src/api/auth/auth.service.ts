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
  try {
    const response = await apiClient.post<LoginResponse>(
      '/api/v2/auth/login',
      credentials
    );

    if (response.data.success && typeof window !== 'undefined') {
      // Token'ı localStorage'a kaydet
      const token = response.data.data.token.token;
      localStorage.setItem('authToken', token);

      // User bilgilerini kaydet
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem(
        'currentTenantId',
        response.data.data.tenantId.toString()
      );
      localStorage.setItem('tenantName', response.data.data.tenantName);
    }

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Giriş işlemi sırasında bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Register Service
 * POST /api/v1/auth/register
 */
export const register = async (
  registerData: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      '/api/v1/auth/register',
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
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  try {
    const response = await apiClient.get<GetCurrentUserResponse>(
      '/api/v1/auth/me'
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
 * POST /api/v1/auth/sendPasswordMail
 */
export const sendPasswordMail = async (
  data: SendPasswordMailRequest
): Promise<SendPasswordMailResponse> => {
  try {
    const response = await apiClient.post<SendPasswordMailResponse>(
      '/api/v1/auth/sendPasswordMail',
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
 * POST /api/v1/auth/changePassword
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const response = await apiClient.post<ChangePasswordResponse>(
      '/api/v1/auth/changePassword',
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

