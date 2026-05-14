// Dashboard Stats Models
export interface DashboardStatsItem {
  id: string;
  title: string;
  description: string;
  value: number;
  icon: string; // PrimeIcon class name
  color: string; // Badge color (hex)
}

// Dashboard Stats Response Models
export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStatsItem[];
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

