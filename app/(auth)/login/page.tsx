"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginSchema } from "@/src/yups/auth";
import circles from "@/src/images/circles.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      // submit handler placeholder
      console.log("login", values);
      // Giriş başarılı olduğunda dashboard'a yönlendir
      router.push("/dashboard");
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
              disabled={isSubmitting}
              className="w-full bg-primary border-lightGray/20 hover:bg-primary/90 hover:border-primary/90 text-white"
            >
              Giriş Yap
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            Hesabın yok mu? <Link href="/register" className="text-primary font-semibold">Kaydol</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


