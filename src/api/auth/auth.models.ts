// Login Request Models
export interface LoginRequest {
  email: string;
  password: string;
}

// Register Request Models
export interface RegisterRequest {
  company: string;
  sector: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  city: string;
  district: string;
  password: string;
  referral?: string;
  branchConfirm: boolean;
  kvkk: boolean;
}

// Token Response Models
export interface TokenResponse {
  token: string;
  expiration: string;
}

// User Models
export interface User {
  id: number;
  tenantId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: boolean;
  subscriptionStatus?: string; // "gold", "premium", "silver", "bronze", vb.
}

// Organization Models
export interface Organization {
  id: number;
  name: string;
  code: string;
  description: string | null;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  parentId: number | null;
  parentName: string | null;
  createDate: string;
}

// Login Response Models
export interface LoginResponse {
  success: boolean;
  data: {
    token: TokenResponse;
    user: User;
    tenantId: number;
    tenantName: string;
  };
  message: string;
}

// Register Response Models
export interface RegisterResponse {
  success: boolean;
  data?: {
    user: User;
    token?: TokenResponse;
  };
  message: string;
}

// Get Current User Response Models
export interface GetCurrentUserResponse {
  success: boolean;
  data: {
    user: User;
    organizations: Organization[];
  };
  message?: string;
}

// Send Password Mail Request Models
export interface SendPasswordMailRequest {
  email: string;
  oldPassword: string;
}

// Send Password Mail Response Models
export interface SendPasswordMailResponse {
  success: boolean;
  message: string;
}

// Change Password Request Models
export interface ChangePasswordRequest {
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

// Change Password Response Models
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

