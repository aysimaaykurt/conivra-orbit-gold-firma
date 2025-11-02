export interface ProfileStats {
  activeAds?: number;
  totalApplications?: number;
  favoriteInfluencers?: number;
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  cancelledJobs: number;
}

export interface ProfileFormValues {
  companyName: string;
  aboutCompany?: string;
  city: string;
  district: string;
  address: string;
  sector: string;
}

export const cityOptions = [
  { label: "İstanbul", value: "istanbul" },
  { label: "Ankara", value: "ankara" },
  { label: "İzmir", value: "izmir" },
  { label: "Bursa", value: "bursa" },
  { label: "Antalya", value: "antalya" },
];

export const districtOptions: Record<string, Array<{ label: string; value: string }>> = {
  istanbul: [
    { label: "Kadıköy", value: "kadikoy" },
    { label: "Beşiktaş", value: "besiktas" },
    { label: "Şişli", value: "sisli" },
    { label: "Beyoğlu", value: "beyoglu" },
  ],
  ankara: [
    { label: "Çankaya", value: "cankaya" },
    { label: "Keçiören", value: "kecioren" },
    { label: "Yenimahalle", value: "yenimahalle" },
  ],
  izmir: [
    { label: "Konak", value: "konak" },
    { label: "Karşıyaka", value: "karsiyaka" },
    { label: "Bornova", value: "bornova" },
  ],
  bursa: [
    { label: "Osmangazi", value: "osmangazi" },
    { label: "Nilüfer", value: "nilufer" },
  ],
  antalya: [
    { label: "Muratpaşa", value: "muratpasa" },
    { label: "Konyaaltı", value: "konyaalti" },
  ],
};

export const sectorOptions = [
  { label: "Restoran / Cafe / Bar / Beach", value: "restaurant" },
  { label: "Teknoloji", value: "technology" },
  { label: "Sağlık", value: "healthcare" },
  { label: "Eğitim", value: "education" },
  { label: "Moda", value: "fashion" },
  { label: "Turizm", value: "tourism" },
];

