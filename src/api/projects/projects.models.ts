export interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  type: string;
  imageUrl?: string;
  applicantCount?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  sector?: string;
  platforms?: string;
  image?: string;
  [key: string]: any;
}

export interface GetProjectsParams {
  status?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

export interface GetProjectsResponse {
  success: boolean;
  message?: string;
  data: ProjectItem[] | { items: ProjectItem[]; totalCount: number } | any;
}
