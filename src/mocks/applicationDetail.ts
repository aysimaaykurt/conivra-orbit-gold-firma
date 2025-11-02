export type StatusType = "bronz" | "gümüş" | "altın" | "platin";

export interface ApplicationDetail {
  profileImageSrc?: string;
  fullName: string;
  category: string;
  rating: number;
  status: StatusType;
}

export interface SocialMediaLinks {
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
}

export interface PortfolioItem {
  id: string;
  url: string;
}

export interface Evaluation {
  id: string;
  reviewerImageSrc?: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

export interface ContactInfo {
  address: string;
  email: string;
}

export const mockApplicationDetail: ApplicationDetail = {
  profileImageSrc: "/images/profil.png",
  fullName: "Derya Sevin",
  category: "Güzellik / Kişisel Bakım",
  rating: 4.5,
  status: "bronz",
};

export const mockSocialMediaLinks: SocialMediaLinks = {
  instagram: "https://instagram.com/derya.sevin",
  linkedin: "https://linkedin.com/in/derya-sevin",
  tiktok: "https://tiktok.com/@derya.sevin",
  youtube: "https://youtube.com/@derya-sevin",
};

export const mockPortfolio: PortfolioItem[] = [
  { id: "1", url: "instagram.com/derya.sevin/reels#3791493186419r" },
  { id: "2", url: "instagram.com/derya.sevin/reels#3791493186419r" },
  { id: "3", url: "instagram.com/derya.sevin/reels#3791493186419r" },
  { id: "4", url: "instagram.com/derya.sevin/reels#3791493186419r" },
  { id: "5", url: "instagram.com/derya.sevin/reels#3791493186419r" },
];

export const mockEvaluations: Evaluation[] = [
  {
    id: "1",
    reviewerName: "Sevda Uslu",
    rating: 5,
    comment: "Derya Hanım işinde gayet profesyonel, isteklerimizi anlayarak ve destek olarak işimizi başarıyla tamamladı.",
  },
  {
    id: "2",
    reviewerName: "Sevda Uslu",
    rating: 5,
    comment: "Derya Hanım işinde gayet profesyonel, isteklerimizi anlayarak ve destek olarak işimizi başarıyla tamamladı.",
  },
  {
    id: "3",
    reviewerName: "Sevda Uslu",
    rating: 5,
    comment: "Derya Hanım işinde gayet profesyonel, isteklerimizi anlayarak ve destek olarak işimizi başarıyla tamamladı.",
  },
  {
    id: "4",
    reviewerName: "Sevda Uslu",
    rating: 5,
    comment: "Derya Hanım işinde gayet profesyonel, isteklerimizi anlayarak ve destek olarak işimizi başarıyla tamamladı.",
  },
  {
    id: "5",
    reviewerName: "Sevda Uslu",
    rating: 5,
    comment: "Derya Hanım işinde gayet profesyonel, isteklerimizi anlayarak ve destek olarak işimizi başarıyla tamamladı.",
  },
];

export const mockContactInfo: ContactInfo = {
  address: "Konak /İzmir",
  email: "deryasevin@gmail.com",
};

