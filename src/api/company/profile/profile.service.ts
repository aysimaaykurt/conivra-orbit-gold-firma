import apiClient from '../../axios';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  GetProfileResponse,
  ApiErrorResponse,
} from './profile.models';

/**
 * Update Profile Service (POST - Create or Update)
 * POST company/profile
 */
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  // Şimdilik API bağlantısı iptal edildi, doğrudan başarılı simüle ediliyor
  return {
    success: true,
    message: "Profil başarıyla güncellendi (Kontrol Modu)",
    data: {
      id: "prof-mock",
      companyName: data.companyName,
    },
  };
};

/**
 * Update Profile Service (PUT - Update by ID)
 * PUT company/profile/:id
 */
export const updateProfileById = async (
  id: string,
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  return {
    success: true,
    message: "Profil başarıyla güncellendi",
    data: { id, companyName: data.companyName },
  };
};

/**
 * Get Profile Service
 * GET company/profile
 */
export const getProfile = async (): Promise<GetProfileResponse> => {
  // Arayüzün sorunsuz açılması için mock veri dönülüyor
  return {
    success: true,
    data: {
      id: "prof-mock",
      companyName: "Conivra Orbit Gold Firma",
      aboutCompany: "Eşsiz lezzetlerimiz ve kaliteli kahve sunumlarımızla öne çıkan premium mekanımız için içerik üreticileriyle iş birliği yapıyoruz.",
      city: "izmir",
      district: "konak",
      address: "Kültür Mah. Şehitler Cad. No: 42 Alsancak",
      sector: "restaurant",
      createDate: new Date().toISOString(),
    },
    message: "Başarılı",
  };
};

