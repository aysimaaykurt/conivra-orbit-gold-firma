import { ApplicationStatus } from './applicationStatus.enum';

// Application Models (Dashboard için basit tip)
export interface Application {
  id: string;
  email: string;
  title: string;
  description: string;
  timeAgo: string;
}

// Application List Item Models (Applications sayfası için detaylı tip)
export type AdType = "soiree-menu" | "beach-cocktail" | "soiree-breakfast";

export interface ApplicationListItem {
  id: string;
  adType: AdType;
  profileImageSrc?: string;
  fullName: string;
  followerCount: string; // e.g., "13.5K"
  location: string;
  socialMedia: {
    instagram?: boolean;
    tiktok?: boolean;
    youtube?: boolean;
  };
  status: ApplicationStatus; // 1: Bekliyor, 2: Onaylandı, 3: Reddedildi
}

// Dashboard Applications Response Models (Basit liste için)
export interface DashboardApplicationsResponse {
  success: boolean;
  data: Application[];
  message?: string;
}

// Applications Response Models (Detaylı liste için)
export interface ApplicationsResponse {
  success: boolean;
  data: ApplicationListItem[];
  totalItems?: number;
  totalPages?: number;
  message?: string;
}

// Update Application Status Request Models
export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus; // 1: Bekliyor, 2: Onaylandı, 3: Reddedildi
}

// Update Application Status Response Models
export interface UpdateApplicationStatusResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    status: ApplicationStatus;
  };
}

// Get Applications Query Parameters
export interface GetApplicationsParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  adType?: string;
  status?: number;
  sortBy?: string;
  sortOrder?: string;
}

// Application Detail Response
export interface ApplicationDetailResponse {
  success: boolean;
  data: any; // We'll refine this later if needed
  message?: string;
}

// Evaluate Application Request Body
export interface EvaluateApplicationRequest {
  applicationId: string;
  influencerId: string;
  serviceSatisfaction: number;
  collaborationEffectiveness: number;
  agreementAdherence: string;
  agreementExplanation: string;
  effects: {
    followerIncrease: boolean;
    similarCollaborations: boolean;
    likeIncrease: boolean;
    viewIncrease: boolean;
  };
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

