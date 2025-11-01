"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import { registerSchema } from "@/src/yups/auth";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
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

export default function RegisterPage() {
  const formik = useFormik({
    initialValues: {
      company: "",
      sector: "",
      fullName: "",
      email: "",
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
    onSubmit: (values) => {
      console.log("register", values);
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
        <div className="w-full max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-center">Kayıt Ol</h1>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate className="grid gap-x-4 gap-y-2 grid-cols-1 md:grid-cols-2">
            <Input label="Firma" name="company" value={values.company} onChange={handleChange} onBlur={handleBlur} error={touched.company ? errors.company : undefined} />
            <Dropdown 
              label="Sektör" 
              name="sector" 
              value={values.sector} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              error={touched.sector ? errors.sector : undefined}
              options={sectorOptions}
              className="h-12"
            />

            <Input label="Ad Soyad" name="fullName" value={values.fullName} onChange={handleChange} onBlur={handleBlur} error={touched.fullName ? errors.fullName : undefined} />
            <Input label="Mail" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email ? errors.email : undefined} />

            <Input label="Doğum Tarihi" name="birthDate" type="date" value={values.birthDate} onChange={handleChange} onBlur={handleBlur} error={touched.birthDate ? (errors.birthDate as string | undefined) : undefined} />
            <Input label="Cinsiyet" name="gender" value={values.gender} onChange={handleChange} onBlur={handleBlur} error={touched.gender ? errors.gender : undefined} />

            <Input label="İl" name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} error={touched.city ? errors.city : undefined} />
            <Input label="İlçe" name="district" value={values.district} onChange={handleChange} onBlur={handleBlur} error={touched.district ? errors.district : undefined} />

            <Input label="Şifre" name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} error={touched.password ? errors.password : undefined} />
            <Input label="Referans Kodu" name="referral" value={values.referral} onChange={handleChange} onBlur={handleBlur} error={touched.referral ? (errors.referral as string | undefined) : undefined} />

            <div className="md:col-span-2 space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="branchConfirm" checked={values.branchConfirm} onChange={handleChange} />
                <span>Referans Kodunu Girmiş Olduğum Firmanın Bir Şubesiyim</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="kvkk" checked={values.kvkk} onChange={handleChange} />
                <span>Kişisel Verilerimin <a className="text-primary" href="#">Aydınlatma Metni</a> kapsamında işlenmesini kabul ediyorum.</span>
              </label>
              {touched.kvkk && errors.kvkk ? (
                <p className="text-error">{errors.kvkk as string}</p>
              ) : null}
            </div>

            <div className="md:col-span-2 mt-16">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary border-primary hover:bg-primary/90 hover:border-primary/90 text-white"
              >
                Kaydol
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            Hesabın var mı? <Link href="/login" className="text-primary font-semibold">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


