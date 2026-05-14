export enum SupportStatus {
  PENDING = "beklemede",      // Beklemede
  IN_PROGRESS = "işlemde",    // İşlemde
  ANSWERED = "cevaplandı",    // Cevaplandı
  RESOLVED = "çözüldü",       // Çözüldü
  CANCELLED = "iptal",        // İptal
}

export const SupportStatusLabels: Record<SupportStatus, string> = {
  [SupportStatus.PENDING]: "Beklemede",
  [SupportStatus.IN_PROGRESS]: "İşlemde",
  [SupportStatus.ANSWERED]: "Cevaplandı",
  [SupportStatus.RESOLVED]: "Çözüldü",
  [SupportStatus.CANCELLED]: "İptal",
};

