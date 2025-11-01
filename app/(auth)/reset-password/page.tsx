"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@/src/yups/auth";
import circles from "@/src/images/circles.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const formik = useFormik({
    initialValues: { verificationCode: "", newPassword: "", confirmPassword: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      // Şifre değiştirme işlemi
      console.log("reset password", values);
      // Şifre değiştirildikten sonra login sayfasına yönlendirilebilir
      // router.push("/login");
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

  return (
    <div className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col items-center justify-center bg-[#F7F6F9]">
        <div className="max-w-[520px] w-full px-8">
          <div className="mb-8">
            <div className="text-3xl font-bold text-primary">Conivra Orbit Gold</div>
            <p className="mt-4 text-lg text-lightGray">Conivra Orbit Gold ile erişimi, etkileşimi ve iş akışınızı tek ekranda yönetin</p>
          </div>
          <Image src={circles} alt="circles" className="w-full h-auto" priority />
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="mb-6">
            <Link href="/forgot-password" className="inline-flex items-center text-sm text-primary hover:underline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Geri Dön
            </Link>
          </div>

          <h1 className="mb-8 text-3xl font-bold text-center">Şifre Değiştir</h1>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate className="space-y-4">
            <Input
              label="Doğrulama Kodu"
              name="verificationCode"
              type="text"
              placeholder="6 haneli doğrulama kodunu gir"
              value={values.verificationCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.verificationCode ? errors.verificationCode : undefined}
              maxLength={6}
            />

            <Input
              label="Yeni Şifre"
              name="newPassword"
              type="password"
              placeholder="Yeni Şifre"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newPassword ? errors.newPassword : undefined}
            />

            <Input
              label="Yeni Şifre Tekrar"
              name="confirmPassword"
              type="password"
              placeholder="Yeni Şifre Tekrar"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary border-primary hover:bg-primary/90 hover:border-primary/90 text-white"
            >
              Şifre Değiştir
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            Şifreni Mi Hatırladın? <Link href="/login" className="text-primary font-semibold">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

