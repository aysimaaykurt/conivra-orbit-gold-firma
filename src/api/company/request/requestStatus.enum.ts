export enum RequestStatus {
  PENDING = "beklemede",      // Beklemede
  IN_PROGRESS = "işlemde",    // İşlemde
  RESOLVED = "çözüldü",       // Çözüldü
  CANCELLED = "iptal",        // İptal
}

export const RequestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: "Beklemede",
  [RequestStatus.IN_PROGRESS]: "İşlemde",
  [RequestStatus.RESOLVED]: "Çözüldü",
  [RequestStatus.CANCELLED]: "İptal",
};

