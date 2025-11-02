export type ProjectStatus = "pending" | "ongoing" | "completed";
export type OverlayAction = "evaluate" | "view";

export interface Project {
  id: string;
  imageSrc: string;
  title: string;
  location: string;
  date: string;
  type: string;
  assignee?: string;
  socialMediaLink: string;
  status: ProjectStatus;
  showCheckmark?: boolean;
  overlayText?: string;
  overlayIcon?: "star-yellow" | "star-green";
  overlayAction?: OverlayAction;
}

export const mockProjects: Project[] = [
  // Bekleyen Projelerim
  {
    id: "1",
    imageSrc: "/soiree.png",
    title: "Soiree Menü Tanıtım",
    location: "İzmir",
    date: "25.08.2025",
    type: "Reklam",
    assignee: "Derya Sevin",
    socialMediaLink: "https://instagram.com/derya.sevin",
    status: "pending",
  },
  {
    id: "2",
    imageSrc: "/soiree.png",
    title: "Soiree Menü Tanıtım",
    location: "İzmir",
    date: "25.08.2025",
    type: "Reklam",
    assignee: "Derya Sevin",
    socialMediaLink: "https://instagram.com/derya.sevin",
    status: "pending",
  },
  // Devam Eden Projelerim
  {
    id: "3",
    imageSrc: "/soiree.png",
    title: "Soiree Menü Tanıtım",
    location: "İzmir",
    date: "25.08.2025",
    type: "Reklam",
    assignee: "Derya Sevin",
    socialMediaLink: "https://instagram.com/derya.sevin",
    status: "ongoing",
  },
  // Tamamlanan Projelerim
  {
    id: "4",
    imageSrc: "/soiree.png",
    title: "Soiree Menü Tanıtım",
    location: "İzmir",
    date: "25.08.2025",
    type: "Reklam",
    assignee: "Derya Sevin",
    socialMediaLink: "https://instagram.com/derya.sevin",
    status: "completed",
    showCheckmark: true,
    overlayText: "Influencer'ı Değerlendir",
    overlayIcon: "star-yellow",
    overlayAction: "evaluate",
  },
  {
    id: "5",
    imageSrc: "/soiree.png",
    title: "Soiree Menü Tanıtım",
    location: "İzmir",
    date: "25.08.2025",
    type: "Reklam",
    assignee: "Derya Sevin",
    socialMediaLink: "https://instagram.com/derya.sevin",
    status: "completed",
    showCheckmark: true,
    overlayText: "Değerlendirmeyi Gör",
    overlayIcon: "star-yellow",
    overlayAction: "view",
  },
];

export interface EvaluationData {
  serviceSatisfaction: number;
  collaborationEffectiveness: number;
  agreementAdherence: "yes" | "no" | null;
  agreementExplanation?: string;
  effects: {
    followerIncrease: boolean;
    similarCollaborations: boolean;
    likeIncrease: boolean;
    viewIncrease: boolean;
  };
}

export const mockEvaluation: EvaluationData = {
  serviceSatisfaction: 3,
  collaborationEffectiveness: 3,
  agreementAdherence: "no",
  agreementExplanation: "",
  effects: {
    followerIncrease: true,
    similarCollaborations: false,
    likeIncrease: true,
    viewIncrease: false,
  },
};

