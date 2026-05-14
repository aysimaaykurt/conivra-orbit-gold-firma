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

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

