import { ApplicationStatus } from "@/src/api/applications/applicationStatus.enum";

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

export const adTypeTabs: { id: AdType; label: string }[] = [
  { id: "soiree-menu", label: "Soiree Menü Reklamı" },
  { id: "beach-cocktail", label: "Beach Kokteyl Reklamı" },
  { id: "soiree-breakfast", label: "Soiree Kahvaltı Reklamı" },
];

export const applicationsList: ApplicationListItem[] = [
  {
    id: "1",
    adType: "soiree-menu",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.PENDING,
  },
  {
    id: "2",
    adType: "soiree-menu",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.APPROVED,
  },
  {
    id: "3",
    adType: "soiree-menu",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.REJECTED,
  },
  {
    id: "4",
    adType: "soiree-menu",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.PENDING,
  },
  {
    id: "5",
    adType: "soiree-menu",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.APPROVED,
  },
  {
    id: "6",
    adType: "soiree-menu",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.PENDING,
  },
  {
    id: "7",
    adType: "beach-cocktail",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.PENDING,
  },
  {
    id: "8",
    adType: "beach-cocktail",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.APPROVED,
  },
  {
    id: "9",
    adType: "beach-cocktail",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.REJECTED,
  },
  {
    id: "10",
    adType: "soiree-breakfast",
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.PENDING,
  },
  // Daha fazla veri için tekrarlananlar
  ...Array.from({ length: 36 }, (_, i) => ({
    id: `${11 + i}`,
    adType: "soiree-menu" as AdType,
    fullName: "Derya Sevin",
    followerCount: "13.5K",
    location: "İzmir",
    socialMedia: {
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    status: ApplicationStatus.PENDING,
  })),
];

