// Most Preferred Models
export interface MostPreferredItem {
  id: string;
  name: string;
  status: string;
}

// Most Preferred Response Models
export interface MostPreferredResponse {
  success: boolean;
  data: MostPreferredItem[];
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

