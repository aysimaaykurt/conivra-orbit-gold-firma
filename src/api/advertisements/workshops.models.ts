// Add Workshop Request Models (POST)
export interface AddWorkshopRequest {
  title: string;
  description: string;
  startDate: string; // ISO 8601 date format
  endDate: string; // ISO 8601 date format
  duration: string;
  city: string;
  district: string;
  address: string;
  category: string;
  targetAudience: string;
  participantCount: string;
  participationCondition: string;
  fee: string;
  contentType: string;
  workshopGoal: string;
  workshopContent: string;
  images?: File[]; // Multi-image support
}

// Update Workshop Request Models (PUT)
export interface UpdateWorkshopRequest {
  title: string;
  description: string;
  startDate: string; // ISO 8601 date format
  endDate: string; // ISO 8601 date format
  duration: string;
  city: string;
  district: string;
  address: string;
  category: string;
  targetAudience: string;
  participantCount: string;
  participationCondition: string;
  fee: string;
  contentType: string;
  workshopGoal: string;
  workshopContent: string;
  images?: File[]; // Multi-image support
}

// Workshop Response Models (GET)
export interface Workshop {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO 8601 date format
  endDate: string; // ISO 8601 date format
  duration: string;
  city: string;
  district: string;
  address: string;
  category: string;
  targetAudience: string;
  participantCount: string;
  participationCondition: string;
  fee: string;
  contentType: string;
  workshopGoal: string;
  workshopContent: string;
  images?: { id?: string | number; imageUrl: string; imageId?: string; isMain: boolean; sortOrder?: number }[]; // URL to the uploaded images
  createDate: string; // ISO 8601 date format
  updateDate?: string; // ISO 8601 date format (optional)
  status?: string; // e.g., "active", "inactive", "pending"
}

// Add Workshop Response Models (POST)
export interface AddWorkshopResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    images?: { id?: string | number; imageUrl: string; imageId?: string; isMain: boolean; sortOrder?: number }[];
  };
}

// Update Workshop Response Models (PUT)
export interface UpdateWorkshopResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    adImages?: { id?: string; imageUrl: string; isMain: boolean }[];
  };
}

// Get Workshop Response Models (GET)
export interface GetWorkshopResponse {
  success: boolean;
  data: Workshop;
  message?: string;
}

// Get Workshops List Response Models (GET - List)
export interface GetWorkshopsListResponse {
  success: boolean;
  data: Workshop[];
  message?: string;
}

export interface GetWorkshopsParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  city?: string;
  sortBy?: string;
  sortOrder?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

