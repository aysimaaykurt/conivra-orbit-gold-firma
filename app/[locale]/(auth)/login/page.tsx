"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { Link, useRouter, usePathname } from "@/src/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useFormik } from "formik";
import { loginSchema } from "@/src/yups/auth";
import { login } from "@/src/api/auth/auth.service";
import circles from "@/src/images/circles.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useRef, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("header");
  const toastRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const languageOptions = useMemo(
    () => [
      { label: t("languages.turkish"), value: "tr", flag: "🇹🇷" },
      { label: t("languages.english"), value: "en", flag: "🇺🇸" },
      { label: t("languages.spanish"), value: "es", flag: "🇪🇸" },
    ],
    [t]
  );

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname || '/', { locale: newLocale });
    }
  };
  
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await login({
          email: values.email,
          password: values.password,
        });

        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Giriş başarılı",
            life: 3000,
          });

          // Giriş başarılı olduğunda dashboard'a yönlendir
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        }
      } catch (error: any) {
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Giriş yapılırken bir hata oluştu",
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
      <div className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-2 relative">
      {/* Language Dropdown - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <PrimeDropdown
          value={languageOptions.find((opt) => opt.value === locale) || languageOptions[0]}
          onChange={(e) => handleLanguageChange(e.value)}
          options={languageOptions}
          optionLabel="label"
          itemTemplate={(option) => (
            <div className="flex items-center gap-2 py-2">
              <span className="text-base">{option.flag}</span>
              <span className="font-semibold text-sm text-dark">{option.label}</span>
            </div>
          )}
          valueTemplate={(option) => {
            if (!option) return null;
            return (
              <div className="flex items-center gap-2 px-1">
                <span className="text-base">{option.flag}</span>
                <span className="font-semibold text-sm text-dark">{option.label}</span>
              </div>
            );
          }}
          className="!border-lightGray rounded-full"
          panelClassName="rounded-lg shadow-lg border border-lightGray/20"
          style={{ 
            backgroundColor: "white",
            borderColor: "#A5A5A5",
            borderWidth: "0.5px",
            width: "140px",
            maxWidth: "140px",
            height: "40px",
          }}
        />
      </div>

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
          <h1 className="mb-8 text-3xl font-bold text-center">Hoşgeldin!</h1>

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
              label="Password"
              name="password"
              type="password"
              placeholder="Şifrenizi giriniz"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : undefined}
            />

            <div className="text-right text-sm">
              <Link href="/forgot-password" className="text-primary">Şifremi Unuttum</Link>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || isLoading}
              className="w-full bg-primary border-lightGray/20 hover:bg-primary/90 hover:border-primary/90 text-white"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            Hesabın yok mu? <Link href="/register" className="text-primary font-semibold">Kaydol</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}


