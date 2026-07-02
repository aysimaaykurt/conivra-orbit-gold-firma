/**
 * Application Status Enum
 * Başvuru durumu enum'u
 */
export enum ApplicationStatus {
  PENDING = 1,              // Bekliyor
  APPROVED = 2,             // Onaylandı
  REJECTED = 3,             // Reddedildi
  REVISION_REQUESTED = 4,   // Revizyon İstendi
  WITHDRAWN = 5,            // Geri Çekildi
  COMPLETED = 6,            // Tamamlandı
}

/**
 * Application Status Labels
 * Başvuru durumu etiketleri
 */
export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "Bekliyor",
  [ApplicationStatus.APPROVED]: "Onaylandı",
  [ApplicationStatus.REJECTED]: "Reddedildi",
  [ApplicationStatus.REVISION_REQUESTED]: "Revizyon İstendi",
  [ApplicationStatus.WITHDRAWN]: "Geri Çekildi",
  [ApplicationStatus.COMPLETED]: "Tamamlandı",
};

