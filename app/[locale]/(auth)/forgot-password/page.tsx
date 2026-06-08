"use client";

import Image from "next/image";
import { Link, useRouter } from "@/src/navigation";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "@/src/yups/auth";
import { sendPasswordMail } from "@/src/api/auth/auth.service";
import circles from "@/src/images/circles.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toastRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", oldPassword: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await sendPasswordMail({
          email: values.email,
          oldPassword: values.oldPassword,
        });

        if (response.success) {
          // Toast göster
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Doğrulama kodu gönderildi",
            life: 3000,
          });

          // 1.5 saniye sonra reset-password sayfasına yönlendir
          setTimeout(() => {
            router.push("/reset-password");
          }, 1500);
        }
      } catch (error: any) {
        // Hata durumunda toast göster
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Doğrulama kodu gönderilirken bir hata oluştu",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

  return (
    <>
      <Toast ref={toastRef} />
      <div className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-slate-50 to-indigo-50/70 border-r border-slate-200/60 dark:border-zinc-800">
        <div className="max-w-[520px] w-full px-8">
          <div className="mb-8">
            <div className="text-3xl font-bold text-primary">Conivra Orbit Gold</div>
            <p className="mt-4 text-lg text-slate-700">Conivra Orbit Gold ile erişimi, etkileşimi ve iş akışınızı tek ekranda yönetin</p>
          </div>
          <Image src={circles} alt="circles" className="w-full h-auto opacity-90" priority />
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-white dark:bg-zinc-900">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-3xl font-bold text-center text-slate-900 dark:text-white">Şifre Sıfırlama</h1>
          <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">Şifrenizi yenilemek için kayıtlı e-posta adresinizi ve eski şifrenizi girin.</p>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate className="space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
            />

            <Input
              label="Eski Şifre"
              name="oldPassword"
              type="password"
              placeholder="Eski Şifre"
              value={values.oldPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.oldPassword ? errors.oldPassword : undefined}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting || isLoading}
              className="w-full h-10 bg-primary dark:bg-purple-700 hover:bg-primary/90 dark:hover:bg-purple-600 text-white rounded-lg font-medium shadow-md shadow-purple-500/10 transition-all cursor-pointer flex items-center justify-center"
            >
              {isLoading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Şifreni mi hatırladın? <Link href="/login" className="text-primary dark:text-purple-400 font-semibold hover:underline">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

