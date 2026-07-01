"use client";

import Image from "next/image";
import { Link, useRouter } from "@/src/navigation";
import { useFormik } from "formik";
import { registerSchema } from "@/src/yups/auth";
import { register } from "@/src/api/auth/auth.service";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Calendar } from "primereact/calendar";
import { useRef, useState } from "react";
import circles from "@/src/images/circles.png";

const sectorOptions = [
  { label: "Teknoloji", value: "technology" },
  { label: "Sağlık", value: "healthcare" },
  { label: "Eğitim", value: "education" },
  { label: "Finans", value: "finance" },
  { label: "İnşaat", value: "construction" },
  { label: "Perakende", value: "retail" },
  { label: "Üretim", value: "manufacturing" },
  { label: "Turizm", value: "tourism" },
  { label: "Gıda", value: "food" },
  { label: "Enerji", value: "energy" },
  { label: "Medya", value: "media" },
  { label: "Danışmanlık", value: "consulting" },
  { label: "Ulaştırma", value: "transportation" },
  { label: "Emlak", value: "real-estate" },
  { label: "Diğer", value: "other" },
];

const genderOptions = [
  { label: "Kadın", value: "kadın" },
  { label: "Erkek", value: "erkek" },
  { label: "Belirtmek İstemiyorum", value: "belirtmek-istemiyorum" },
];

const companyTypeOptions = [
  { label: "Bireysel", value: "Bireysel" },
  { label: "Kurumsal", value: "Kurumsal" },
];

export default function RegisterPage() {
  const router = useRouter();
  const toastRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      company: "",
      companyType: "",
      sector: "",
      fullName: "",
      email: "",
      phone: "+90",
      gender: "",
      birthDate: "",
      city: "",
      district: "",
      password: "",
      referral: "",
      branchConfirm: false,
      kvkk: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await register({
          company: values.company,
          companyType: values.companyType,
          sector: values.sector,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          gender: values.gender,
          birthDate: values.birthDate,
          city: values.city,
          district: values.district,
          password: values.password,
          referral: values.referral || undefined,
          branchConfirm: values.branchConfirm,
          kvkk: values.kvkk,
        });

        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Kayıt başarılı",
            life: 3000,
          });

          // Kayıt başarılı olduğunda daima login sayfasına yönlendir
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        }
      } catch (error: any) {
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Kayıt yapılırken bir hata oluştu",
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

          <div className="w-full max-w-[600px] xl:max-w-[700px] relative z-10">
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
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Kayıt Ol</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Yeni bir hesap oluşturmak için formu doldurun.
                  </p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" noValidate className="grid gap-x-4 gap-y-4 grid-cols-1 md:grid-cols-2">
                  <Dropdown 
                    label="Firma Tipi" 
                    name="companyType" 
                    value={values.companyType} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                    error={touched.companyType ? errors.companyType : undefined}
                    options={companyTypeOptions}
                  />
                  <Input label="Firma" name="company" value={values.company} onChange={handleChange} onBlur={handleBlur} error={touched.company ? errors.company : undefined} />
                  <Dropdown 
                    label="Sektör" 
                    name="sector" 
                    value={values.sector} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                    error={touched.sector ? errors.sector : undefined}
                    options={sectorOptions}
                  />

                  <Input label="Ad Soyad" name="fullName" value={values.fullName} onChange={handleChange} onBlur={handleBlur} error={touched.fullName ? errors.fullName : undefined} />
                  <Input label="Mail" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email ? errors.email : undefined} />

                  <Input 
                    label="Telefon Numarası" 
                    name="phone" 
                    placeholder="+905XX XXX XX XX" 
                    value={values.phone} 
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!val.startsWith("+90")) {
                        const digits = val.replace(/\D/g, "");
                        val = `+90${digits}`;
                      } else {
                        const suffix = val.substring(3).replace(/\D/g, "");
                        val = `+90${suffix}`;
                      }
                      if (val.length <= 13) {
                        formik.setFieldValue("phone", val);
                      }
                    }} 
                    onBlur={handleBlur} 
                    error={touched.phone ? errors.phone : undefined} 
                  />
                  <Dropdown 
                    label="Cinsiyet" 
                    name="gender" 
                    value={values.gender} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                    error={touched.gender ? errors.gender : undefined}
                    options={genderOptions}
                  />

                  <div className="flex flex-col">
                    <label htmlFor="birthDate" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Doğum Tarihi
                    </label>
                    <Calendar
                      id="birthDate"
                      name="birthDate"
                      value={values.birthDate ? new Date(values.birthDate) : null}
                      onChange={(e) => {
                        const date = e.value;
                        if (date instanceof Date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          formik.setFieldValue("birthDate", `${year}-${month}-${day}`);
                        } else {
                          formik.setFieldValue("birthDate", "");
                        }
                      }}
                      onBlur={handleBlur}
                      dateFormat="dd.mm.yy"
                      placeholder="Doğum tarihi seçin"
                      showIcon
                      className="w-full [&_.p-inputtext]:rounded-r-none [&_.p-inputtext]:border-r-0 [&_.p-inputtext]:h-9 [&_.p-datepicker-trigger]:rounded-l-none [&_.p-datepicker-trigger]:ml-0 [&_.p-datepicker-trigger]:h-9 [&_.p-datepicker-trigger]:py-0 [&_.p-datepicker-trigger]:px-3 [&_.p-datepicker-trigger]:!bg-primary [&_.p-datepicker-trigger]:!border-primary [&_.p-datepicker-trigger]:!text-white"
                      inputClassName={`w-full py-1.5 px-3 rounded-l-md border text-sm h-9 bg-white text-dark placeholder:text-lightGray ${
                        touched.birthDate && errors.birthDate
                          ? "border-error"
                          : values.birthDate
                          ? "border-primary"
                          : "border-lightGray/40"
                      }`}
                    />
                    {touched.birthDate && errors.birthDate && (
                      <p className="mt-1 text-xs" style={{ color: "#E53935" }}>
                        {errors.birthDate as string}
                      </p>
                    )}
                  </div>
                  <Input label="İl" name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} error={touched.city ? errors.city : undefined} />

                  <Input label="İlçe" name="district" value={values.district} onChange={handleChange} onBlur={handleBlur} error={touched.district ? errors.district : undefined} />
                  <Input label="Şifre" name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} error={touched.password ? errors.password : undefined} />

                  <Input label="Referans Kodu" name="referral" value={values.referral} onChange={handleChange} onBlur={handleBlur} error={touched.referral ? (errors.referral as string | undefined) : undefined} />

                  <div className="md:col-span-2 space-y-3 text-sm mt-2">
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" name="branchConfirm" checked={values.branchConfirm} onChange={handleChange} className="rounded border-slate-300 dark:border-zinc-700 text-primary focus:ring-primary dark:focus:ring-purple-500" />
                      <span>Referans Kodunu Girmiş Olduğum Firmanın Bir Şubesiyim</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" name="kvkk" checked={values.kvkk} onChange={handleChange} className="rounded border-slate-300 dark:border-zinc-700 text-primary focus:ring-primary dark:focus:ring-purple-500" />
                      <span>Kişisel Verilerimin <a className="text-primary dark:text-purple-400 hover:underline font-medium" href="#">Aydınlatma Metni</a> kapsamında işlenmesini kabul ediyorum.</span>
                    </label>
                    {touched.kvkk && errors.kvkk ? (
                      <p className="text-error mt-1 text-xs" style={{ color: "#E53935" }}>{errors.kvkk as string}</p>
                    ) : null}
                  </div>

                  <div className="md:col-span-2 mt-8">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || isLoading}
                      className="w-full h-12 mt-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-500 dark:hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 dark:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-base"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Kaydediliyor...</span>
                        </div>
                      ) : "Kaydol"}
                    </Button>
                  </div>
                </form>

                <div className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
                  Hesabın var mı?{' '}
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


