import { RequestStatus } from './requestStatus.enum';

// Create Request Request Models (POST)
export interface CreateRequestRequest {
  title: string;
  type: string;
  description: string;
}

// Request Response Models (GET)
export interface Request {
  id: string;
  title: string;
  type: string;
  description: string;
  status: RequestStatus;
  createDate: string; // ISO 8601 date format
  updateDate?: string; // ISO 8601 date format (optional)
}

// Create Request Response Models (POST)
export interface CreateRequestResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    type: string;
  };
}

// Get Requests List Response Models (GET - List)
export interface GetRequestsListResponse {
  success: boolean;
  data: Request[];
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

