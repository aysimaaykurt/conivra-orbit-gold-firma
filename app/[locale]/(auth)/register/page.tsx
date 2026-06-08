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

export default function RegisterPage() {
  const router = useRouter();
  const toastRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      company: "",
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
        <div className="w-full max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold text-center text-slate-900 dark:text-white">Kayıt Ol</h1>
          <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">Yeni bir hesap oluşturmak için formu doldurun.</p>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate className="grid gap-x-4 gap-y-4 grid-cols-1 md:grid-cols-2">
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
                // Enforce starting with +90
                if (!val.startsWith("+90")) {
                  const digits = val.replace(/\D/g, "");
                  val = `+90${digits}`;
                } else {
                  const suffix = val.substring(3).replace(/\D/g, "");
                  val = `+90${suffix}`;
                }
                // Enforce max length 13 (+90 + 10 digits)
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
                className="w-full h-10 bg-primary dark:bg-purple-700 hover:bg-primary/90 dark:hover:bg-purple-600 text-white rounded-lg font-medium shadow-md shadow-purple-500/10 transition-all cursor-pointer flex items-center justify-center"
              >
                {isLoading ? "Kaydediliyor..." : "Kaydol"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Hesabın var mı? <Link href="/login" className="text-primary dark:text-purple-400 font-semibold hover:underline">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}


