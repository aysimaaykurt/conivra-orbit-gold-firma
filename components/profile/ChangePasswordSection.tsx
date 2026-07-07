"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { sendPasswordMail, changePassword } from "@/src/api/auth/auth.service";

const step1Schema = Yup.object({
  email: Yup.string().email("Geçerli bir e-posta giriniz").required("E-posta zorunludur"),
  oldPassword: Yup.string().required("Mevcut şifre zorunludur"),
});

const step2Schema = Yup.object({
  verificationCode: Yup.string()
    .length(6, "Doğrulama kodu 6 haneli olmalıdır")
    .required("Doğrulama kodu zorunludur"),
  newPassword: Yup.string()
    .min(6, "Yeni şifre en az 6 karakter olmalıdır")
    .required("Yeni şifre zorunludur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});

export default function ChangePasswordSection() {
  const toastRef = useRef<any>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const step1 = useFormik({
    initialValues: { email: "", oldPassword: "" },
    validationSchema: step1Schema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await sendPasswordMail({
          email: values.email,
          oldPassword: values.oldPassword,
        });
        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Kod Gönderildi",
            detail: response.message || "Doğrulama kodu e-posta adresinize gönderildi",
            life: 3000,
          });
          setStep(2);
        }
      } catch (error: any) {
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Kod gönderilirken bir hata oluştu",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const step2 = useFormik({
    initialValues: { verificationCode: "", newPassword: "", confirmPassword: "" },
    validationSchema: step2Schema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await changePassword({
          verificationCode: values.verificationCode,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });
        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Şifreniz başarıyla değiştirildi",
            life: 3000,
          });
          step1.resetForm();
          step2.resetForm();
          setStep(1);
        }
      } catch (error: any) {
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Şifre değiştirilirken bir hata oluştu",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <Toast ref={toastRef} />
      <div className="mt-12 pt-8 border-t border-gray-200">

        {/* Başlık */}
        <h2 className="text-lg font-bold mb-6" style={{ color: "#4C226A" }}>
          Şifre Değiştir
        </h2>

        {/* Adım göstergesi */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={
              step === 1
                ? { backgroundColor: "#4C226A", color: "#fff" }
                : { backgroundColor: "#f3f4f6", color: "#9ca3af" }
            }
          >
            1. Doğrulama
          </span>
          <span className="text-gray-300 text-xs">›</span>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={
              step === 2
                ? { backgroundColor: "#4C226A", color: "#fff" }
                : { backgroundColor: "#f3f4f6", color: "#9ca3af" }
            }
          >
            2. Yeni Şifre
          </span>
        </div>

        {/* Adım 1 */}
        {step === 1 && (
          <form onSubmit={step1.handleSubmit} autoComplete="off" noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-6">
                <Input
                  label="E-posta Adresiniz"
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={step1.values.email}
                  onChange={step1.handleChange}
                  onBlur={step1.handleBlur}
                  error={step1.touched.email ? step1.errors.email : undefined}
                />
                <Input
                  label="Mevcut Şifre"
                  name="oldPassword"
                  type="password"
                  placeholder="••••••••"
                  value={step1.values.oldPassword}
                  onChange={step1.handleChange}
                  onBlur={step1.handleBlur}
                  error={step1.touched.oldPassword ? step1.errors.oldPassword : undefined}
                />
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="px-12 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#4C226A" }}
              >
                {isLoading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
              </Button>
            </div>
          </form>
        )}

        {/* Adım 2 */}
        {step === 2 && (
          <form onSubmit={step2.handleSubmit} autoComplete="off" noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-6">
                <div className="px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  Kod <strong>{step1.values.email}</strong> adresine gönderildi.
                </div>
                <Input
                  label="Doğrulama Kodu"
                  name="verificationCode"
                  type="text"
                  placeholder="6 haneli kod"
                  value={step2.values.verificationCode}
                  onChange={step2.handleChange}
                  onBlur={step2.handleBlur}
                  error={step2.touched.verificationCode ? step2.errors.verificationCode : undefined}
                  maxLength={6}
                />
                <Input
                  label="Yeni Şifre"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={step2.values.newPassword}
                  onChange={step2.handleChange}
                  onBlur={step2.handleBlur}
                  error={step2.touched.newPassword ? step2.errors.newPassword : undefined}
                />
                <Input
                  label="Yeni Şifre Tekrar"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={step2.values.confirmPassword}
                  onChange={step2.handleChange}
                  onBlur={step2.handleBlur}
                  error={step2.touched.confirmPassword ? step2.errors.confirmPassword : undefined}
                />
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => { setStep(1); step2.resetForm(); }}
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: "#4C226A" }}
              >
                ← Geri Dön
              </button>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-12 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#4C226A" }}
              >
                {isLoading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
