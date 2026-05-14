// Update Profile Request Models (POST/PUT)
export interface UpdateProfileRequest {
  companyName: string;
  aboutCompany?: string;
  city: string;
  district: string;
  address: string;
  sector: string;
}

// Profile Response Models (GET)
export interface Profile {
  id: string;
  companyName: string;
  aboutCompany?: string;
  city: string;
  district: string;
  address: string;
  sector: string;
  createDate: string; // ISO 8601 date format
  updateDate?: string; // ISO 8601 date format (optional)
}

// Update Profile Response Models (POST/PUT)
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    companyName: string;
  };
}

// Get Profile Response Models (GET)
export interface GetProfileResponse {
  success: boolean;
  data: Profile;
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

