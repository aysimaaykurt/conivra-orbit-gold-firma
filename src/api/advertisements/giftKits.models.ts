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
  images?: File[]; // Multi-image support
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
  images?: File[]; // Multi-image support
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
  images?: { id?: string | number; imageUrl: string; imageId?: string; isMain: boolean; sortOrder?: number }[]; // URL to the uploaded images
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
    images?: { id?: string | number; imageUrl: string; imageId?: string; isMain: boolean; sortOrder?: number }[];
  };
}

// Update Gift Kit Response Models (PUT)
export interface UpdateGiftKitResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    adImages?: { id?: string; imageUrl: string; isMain: boolean }[];
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

export interface GetGiftKitsParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

