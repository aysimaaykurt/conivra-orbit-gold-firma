export interface InfoCard {
  id: string;
  title: string;
  description: string;
  value: number;
  icon: string; // PrimeIcon class name
  color: string; // Badge color
}

export const infoCards: InfoCard[] = [
  {
    id: "active-jobs",
    title: "Aktif İlanlarım",
    description: "Oluşturduğum iş ilan sayısı",
    value: 12,
    icon: "pi pi-briefcase",
    color: "#17A2B8", // Teal/Cyan
  },
  {
    id: "applications",
    title: "Gelen Başvurular",
    description: "Gelen iş başvuru sayısı",
    value: 12,
    icon: "pi pi-file",
    color: "#3498DB", // Blue
  },
  {
    id: "favorite-influencers",
    title: "Favori Influencer",
    description: "Beğendiğim influencer sayısı",
    value: 12,
    icon: "pi pi-heart",
    color: "#E91E63", // Pink/Magenta
  },
];

export interface Application {
  id: string;
  email: string;
  title: string;
  description: string;
  timeAgo: string;
}

export const applications: Application[] = [
  {
    id: "1",
    email: "avtyazilim@mail.com",
    title: "Cafe Tanıtım / Influencer Arayışı",
    description: "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
    timeAgo: "24 dk önce",
  },
  {
    id: "2",
    email: "avtyazilim@mail.com",
    title: "Cafe Tanıtım / Influencer Arayışı",
    description: "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
    timeAgo: "32 dk önce",
  },
  {
    id: "3",
    email: "avtyazilim@mail.com",
    title: "Cafe Tanıtım / Influencer Arayışı",
    description: "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
    timeAgo: "45 dk önce",
  },
  {
    id: "4",
    email: "avtyazilim@mail.com",
    title: "Cafe Tanıtım / Influencer Arayışı",
    description: "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
    timeAgo: "1 saat önce",
  },
  {
    id: "5",
    email: "avtyazilim@mail.com",
    title: "Cafe Tanıtım / Influencer Arayışı",
    description: "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
    timeAgo: "1 saat önce",
  },
  {
    id: "6",
    email: "avtyazilim@mail.com",
    title: "Cafe Tanıtım / Influencer Arayışı",
    description: "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
    timeAgo: "2 saat önce",
  },
];

export interface ShortcutItem {
  id: string;
  label: string;
  iconClass: string; // PrimeIcon class name
  bgColor: string; // Background color hex
  iconColor: string; // Icon color hex or 'white'
}

export const shortcuts: ShortcutItem[] = [
  {
    id: "create-ad",
    label: "Yeni ilan oluştur",
    iconClass: "pi pi-chevron-up",
    bgColor: "#FCD34D", // Light orange/yellow
    iconColor: "white",
  },
  {
    id: "go-to-favorites",
    label: "Favorilere git",
    iconClass: "pi pi-heart",
    bgColor: "#C3B1E1", // Light purple/lavender
    iconColor: "#4C226A", // Primary purple
  },
  {
    id: "search-influencer",
    label: "Influencer ara",
    iconClass: "pi pi-angle-double-right",
    bgColor: "#A7F3D0", // Light green
    iconColor: "#A3E635", // Lime green/yellow
  },
  {
    id: "go-to-applications",
    label: "Başvurularıma git",
    iconClass: "pi pi-file",
    bgColor: "#B3D9FF", // Light blue
    iconColor: "#3498DB", // Blue
  },
];

export interface MostPreferredItem {
  id: string;
  name: string;
  status: string;
}

export const mostPreferred: MostPreferredItem[] = [
  {
    id: "1",
    name: "Angela Moss",
    status: "Marketing Manager",
  },
  {
    id: "2",
    name: "Andy Law",
    status: "Graphic Designer",
  },
  {
    id: "3",
    name: "Benny Kenn",
    status: "Software Engineer",
  },
  {
    id: "4",
    name: "Chynthia Lawra",
    status: "CEO",
  },
];

export interface PendingReviewItem {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  serviceDescription: string;
}

export const pendingReviews: PendingReviewItem[] = [
  {
    id: "1",
    reviewerName: "Derya Sevin",
    reviewerRole: "Instagram Influencer",
    serviceDescription: "Cafe Tanıtım / Influencer Arayışı",
  },
  {
    id: "2",
    reviewerName: "Derya Sevin",
    reviewerRole: "Instagram Influencer",
    serviceDescription: "Cafe Tanıtım / Influencer Arayışı",
  },
  {
    id: "3",
    reviewerName: "Derya Sevin",
    reviewerRole: "Instagram Influencer",
    serviceDescription: "Cafe Tanıtım / Influencer Arayışı",
  },
  {
    id: "4",
    reviewerName: "Derya Sevin",
    reviewerRole: "Instagram Influencer",
    serviceDescription: "Cafe Tanıtım / Influencer Arayışı",
  },
];

