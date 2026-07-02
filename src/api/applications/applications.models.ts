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
export type AdType = "campaign" | "giftkit" | "workshop" | "soiree-menu" | "beach-cocktail" | "soiree-breakfast";

export interface ApplicationDocumentDto {
  id: string;
  url: string;
  type: "image" | "video";
}

export interface InfluencerEvaluationDto {
  collaborationSatisfaction: number;
  agreementRespected: "yes" | "no";
  agreementViolationNote?: string;
  companyBehaviorScore: number;
  representativeBehaviorScore: number;
  createDate: string;
}

export interface ApplicationListItem {
  id: string;
  influencerId?: string;
  adId?: number;
  adType: AdType;
  profileImageSrc?: string;
  fullName: string;
  followerCount: string; // e.g., "13.5K"
  location: string;
  socialMedia: {
    instagram?: boolean;
    instagramLink?: string;
    instagramFollowers?: string | null;
    tiktok?: boolean;
    tiktokLink?: string;
    tiktokFollowers?: string | null;
    youtube?: boolean;
    youtubeLink?: string;
    youtubeFollowers?: string | null;
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

export interface ApplicationDetailDto extends ApplicationListItem {
  documents?: ApplicationDocumentDto[];
  influencerEvaluation?: any | null; // Company's evaluation of the influencer
  companyEvaluation?: any | null; // Influencer's evaluation of the company
  [key: string]: any;
}

// Application Detail Response
export interface ApplicationDetailResponse {
  success: boolean;
  data: ApplicationDetailDto;
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

// Bulk Update Application Status Request
export interface BulkUpdateApplicationStatusRequest {
  applicationIds: string[];
  status: number;
}

// Request Revision Request
export interface RequestRevisionRequest {
  revisionNote: string;
}

