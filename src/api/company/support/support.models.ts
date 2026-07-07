import { SupportStatus } from './supportStatus.enum';

// Create Support Request Models (POST)
export interface CreateSupportRequest {
  supportTypeId: number;
  title: string;
  type: string;
  description: string;
}

// Update Support Request Models (PUT)
export interface UpdateSupportRequest {
  supportTypeId: number;
  title: string;
  type: string;
  description: string;
}

// Support Response Models (GET)
export interface Support {
  id?: string;
  supportTypeId?: number;
  title: string;
  type: string;
  category?: string;
  description: string;
  status: SupportStatus;
  isEdited?: boolean;
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

// Support Types Response
export interface SupportType {
  id: number;
  name: string;
}

export interface GetSupportTypesResponse {
  success: boolean;
  message: string;
  data: SupportType[];
}

