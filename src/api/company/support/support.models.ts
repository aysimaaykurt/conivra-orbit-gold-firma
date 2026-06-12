import { SupportStatus } from './supportStatus.enum';

// Create Support Request Models (POST)
export interface CreateSupportRequest {
  title: string;
  type: string;
  description: string;
}

// Update Support Request Models (PUT)
export interface UpdateSupportRequest {
  title: string;
  type: string;
  description: string;
}

// Support Response Models (GET)
export interface Support {
  id: string;
  title: string;
  type: string;
  description: string;
  status: SupportStatus;
  createDate: string; // ISO 8601 date format
  updateDate?: string; // ISO 8601 date format (optional)
}

// Create Support Response Models (POST)
export interface CreateSupportResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    type: string;
  };
}

// Get Supports List Response Models (GET - List)
export interface GetSupportsListResponse {
  success: boolean;
  data: Support[];
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

// Basic Response for PUT and DELETE
export interface BasicResponse {
  success: boolean;
  message: string;
}

