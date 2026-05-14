// Add Gift Kit Request Models (POST)
export interface AddGiftKitRequest {
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  followerRange: string;
  platformPreference: string;
  businessType: string;
  contentType: string;
  image?: File; // Optional, will be sent as FormData
}

// Update Gift Kit Request Models (PUT)
export interface UpdateGiftKitRequest {
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  followerRange: string;
  platformPreference: string;
  businessType: string;
  contentType: string;
  image?: File; // Optional, will be sent as FormData
}

// Gift Kit Response Models (GET)
export interface GiftKit {
  id: string;
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  followerRange: string;
  platformPreference: string;
  businessType: string;
  contentType: string;
  imageUrl?: string; // URL to the uploaded image
  createDate: string; // ISO 8601 date format
  updateDate?: string; // ISO 8601 date format (optional)
  status?: string; // e.g., "active", "inactive", "pending"
}

// Add Gift Kit Response Models (POST)
export interface AddGiftKitResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
}

// Update Gift Kit Response Models (PUT)
export interface UpdateGiftKitResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
}

// Get Gift Kit Response Models (GET)
export interface GetGiftKitResponse {
  success: boolean;
  data: GiftKit;
  message?: string;
}

// Get Gift Kits List Response Models (GET - List)
export interface GetGiftKitsListResponse {
  success: boolean;
  data: GiftKit[];
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

