// Profile Stats Models (from profile.ts)
export interface ProfileStats {
  activeAds?: number;
  totalApplications?: number;
  favoriteInfluencers?: number;
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  cancelledJobs: number;
}

// Get Profile Info Response Models (GET)
export interface GetProfileInfoResponse {
  success: boolean;
  data: ProfileStats;
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

