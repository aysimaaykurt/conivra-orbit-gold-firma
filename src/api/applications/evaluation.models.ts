// Evaluation Request Models (POST)
export interface CreateEvaluationRequest {
  applicationId: string;
  influencerId: string;
  serviceSatisfaction: number; // 1-5
  collaborationEffectiveness: number; // 1-5
  agreementAdherence: "yes" | "no";
  agreementExplanation?: string;
  effects: {
    followerIncrease: boolean;
    similarCollaborations: boolean;
    likeIncrease: boolean;
    viewIncrease: boolean;
  };
}

// Evaluation Response Models (GET)
export interface Evaluation {
  id: string;
  applicationId: string;
  influencerId: string;
  serviceSatisfaction: number; // 1-5
  collaborationEffectiveness: number; // 1-5
  agreementAdherence: "yes" | "no";
  agreementExplanation?: string;
  effects: {
    followerIncrease: boolean;
    similarCollaborations: boolean;
    likeIncrease: boolean;
    viewIncrease: boolean;
  };
  createDate: string; // ISO 8601 date format
  updateDate?: string; // ISO 8601 date format (optional)
}

// Create Evaluation Response Models (POST)
export interface CreateEvaluationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    applicationId: string;
    influencerId: string;
  };
}

// Get Evaluation Response Models (GET)
export interface GetEvaluationResponse {
  success: boolean;
  data: Evaluation;
  message?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

