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
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Doğrulama kodu gönderildi",
            life: 3000,
          });

          setTimeout(() => {
            router.push("/reset-password");
          }, 1500);
        }
      } catch (error: any) {
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
      <div className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-2 relative bg-white dark:bg-zinc-950 overflow-hidden">
        
        {/* Left Side: Branding & Visuals */}
        <div className="hidden md:flex flex-col items-center justify-center relative overflow-hidden border-r border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/30 dark:bg-zinc-950/30">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute top-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
            <div className="absolute -bottom-[20%] left-[10%] w-[80%] h-[80%] rounded-full bg-blue-300/20 dark:bg-blue-900/10 blur-[100px] animate-[pulse_12s_ease-in-out_infinite]" />
          </div>

          <div className="max-w-[560px] w-full px-12 relative z-10 flex flex-col items-center text-center">
            <div className="mb-16 transform transition-all duration-700 hover:scale-105">
              <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 tracking-tight drop-shadow-sm">
                Conivra Orbit Gold
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-[420px] mx-auto">
                Erişimi, etkileşimi ve iş akışınızı tek bir modern ekranda zahmetsizce yönetin.
              </p>
            </div>
            
            <div className="relative w-full max-w-[460px] drop-shadow-2xl hover:drop-shadow-[0_20px_50px_rgba(139,92,246,0.3)] transition-all duration-700">
              <Image 
                src={circles} 
                alt="Conivra abstract circles" 
                className="w-full h-auto object-contain opacity-95 dark:opacity-80" 
                priority 
              />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex items-center justify-center p-6 sm:p-12 relative z-10 bg-slate-50">

          <div className="w-full max-w-[440px] relative z-10">
            {/* Form Card Container */}
            <div className="relative overflow-hidden p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              
              {/* Form Div Animated Background Blobs matching Left Side */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[30%] -left-[20%] w-[100%] h-[100%] rounded-full bg-purple-200/50 dark:bg-purple-800/40 blur-[60px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute top-[20%] -right-[20%] w-[90%] h-[90%] rounded-full bg-indigo-200/50 dark:bg-indigo-800/40 blur-[60px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute -bottom-[20%] left-[10%] w-[100%] h-[100%] rounded-full bg-blue-200/40 dark:bg-blue-800/30 blur-[60px] animate-[pulse_12s_ease-in-out_infinite]" />
              </div>

              <div className="relative z-10">
                <div className="mb-10 text-center">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Şifre Sıfırlama</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Şifrenizi yenilemek için kayıtlı e-posta adresinizi ve eski şifrenizi girin.
                  </p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" noValidate className="space-y-6">
                  <div className="space-y-1">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email ? errors.email : undefined}
                    />
                  </div>

                  <div className="space-y-1">
                    <Input
                      label="Eski Şifre"
                      name="oldPassword"
                      type="password"
                      placeholder="••••••••"
                      value={values.oldPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.oldPassword ? errors.oldPassword : undefined}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isLoading}
                    className="w-full h-12 mt-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-500 dark:hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 dark:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-base"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Gönderiliyor...</span>
                      </div>
                    ) : "Doğrulama Kodu Gönder"}
                  </Button>
                </form>

                <div className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
                  Şifreni mi hatırladın?{' '}
                  <Link href="/login" className="text-primary dark:text-purple-400 font-bold hover:underline underline-offset-4 transition-all">
                    Giriş Yap
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

