/**
 * Application Status Enum
 * Başvuru durumu enum'u
 */
export enum ApplicationStatus {
  PENDING = 1,      // Bekliyor
  APPROVED = 2,     // Onaylandı
  REJECTED = 3,     // Reddedildi
}

/**
 * Application Status Labels
 * Başvuru durumu etiketleri
 */
export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "Bekliyor",
  [ApplicationStatus.APPROVED]: "Onaylandı",
  [ApplicationStatus.REJECTED]: "Reddedildi",
};

