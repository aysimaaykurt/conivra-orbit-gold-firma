// Add Advertisement Request Models (POST)
export interface AddAdvertisementRequest {
  title: string;
  description: string;
  startDate: string; // ISO 8601 date format
  endDate: string; // ISO 8601 date format
  city: string;
  district: string;
  address: string;
  sector: string;
  category: string;
  services: string;
  guestCount: string;
  platformPreference: string;
  followerRange: string;
  contentType: string;
  businessType: string;
  image?: File; // Optional, will be sent as FormData
}

// Update Advertisement Request Models (PUT)
export interface UpdateAdvertisementRequest {
  title: string;
  description: string;
  startDate: string; // ISO 8601 date format
  endDate: string; // ISO 8601 date format
  city: string;
  district: string;
  address: string;
  sector: string;
  category: string;
  services: string;
  guestCount: string;
  platformPreference: string;
  followerRange: string;
  contentType: string;
  businessType: string;
  image?: File; // Optional, will be sent as FormData
}

// Advertisement Response Models (GET)
export interface Advertisement {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO 8601 date format
  endDate: string; // ISO 8601 date format
  city: string;
  district: string;
  address: string;
  sector: string;
  category: string;
  services: string;
  guestCount: string;
  platformPreference: string;
  followerRange: string;
  contentType: string;
  businessType: string;
  imageUrl?: string; // URL to the uploaded image
  createDate: string; // ISO 8601 date format
  updateDate?: string; // ISO 8601 date format (optional)
  status?: string; // e.g., "active", "inactive", "pending"
}

// Add Advertisement Response Models (POST)
export interface AddAdvertisementResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
}

// Update Advertisement Response Models (PUT)
export interface UpdateAdvertisementResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
}

// Get Advertisement Response Models (GET)
export interface GetAdvertisementResponse {
  success: boolean;
  data: Advertisement;
  message?: string;
}

// Get Advertisements List Response Models (GET - List)
export interface GetAdvertisementsListResponse {
  success: boolean;
  data: Advertisement[];
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

