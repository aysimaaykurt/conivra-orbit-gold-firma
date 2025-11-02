"use client";

import Image from "next/image";
import { Link, useRouter } from "@/src/navigation";
import { useRef } from "react";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "@/src/yups/auth";
import circles from "@/src/images/circles.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toastRef = useRef<any>(null);

  const formik = useFormik({
    initialValues: { email: "", oldPassword: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      // Doğrulama kodu gönderme işlemi
      console.log("forgot password", values);
      
      // Toast göster
      toastRef.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Doğrulama kodu gönderildi",
        life: 3000,
      });

      // 1.5 saniye sonra reset-password sayfasına yönlendir
      setTimeout(() => {
        router.push("/reset-password");
      }, 1500);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

  return (
    <>
      <Toast ref={toastRef} />
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
          <h1 className="mb-8 text-3xl font-bold text-center">Şifre Değiştir</h1>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate className="space-y-4">
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
              disabled={isSubmitting}
              className="w-full bg-primary border-primary hover:bg-primary/90 hover:border-primary/90 text-white"
            >
              Doğrulama Kodu Gönder
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            Şifreni Mi Hatırladın? <Link href="/login" className="text-primary font-semibold">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

