import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email("Geçerli bir e-posta giriniz").required("E-posta zorunludur"),
  password: Yup.string().min(6, "En az 6 karakter").required("Şifre zorunludur"),
});

export const registerSchema = Yup.object({
  company: Yup.string().required("Firma adı zorunludur"),
  sector: Yup.string().required("Sektör zorunludur"),
  fullName: Yup.string().required("Ad Soyad zorunludur"),
  email: Yup.string().email("Geçerli bir e-posta giriniz").required("E-posta zorunludur"),
  gender: Yup.string().required("Cinsiyet zorunludur"),
  birthDate: Yup.date().typeError("Tarih geçersiz").required("Doğum tarihi zorunludur"),
  city: Yup.string().required("İl zorunludur"),
  district: Yup.string().required("İlçe zorunludur"),
  password: Yup.string().min(6, "En az 6 karakter").required("Şifre zorunludur"),
  referral: Yup.string().optional(),
  branchConfirm: Yup.boolean(),
  kvkk: Yup.boolean().oneOf([true], "KVKK metnini onaylamanız gerekir"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email("Geçerli bir e-posta giriniz").required("E-posta zorunludur"),
  oldPassword: Yup.string().required("Eski şifre zorunludur"),
});

export const resetPasswordSchema = Yup.object({
  verificationCode: Yup.string().length(6, "Doğrulama kodu 6 haneli olmalıdır").required("Doğrulama kodu zorunludur"),
  newPassword: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Yeni şifre zorunludur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});


