"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cityOptions, districtOptions, ProfileFormValues, sectorOptions } from "@/src/mocks/profile";
 
interface ProfileFormProps {
  initialValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => void;
}

const validationSchema = Yup.object({
  companyName: Yup.string()
    .required("Firma adı gereklidir")
    .min(2, "Firma adı en az 2 karakter olmalıdır"),
  aboutCompany: Yup.string().optional(),
  city: Yup.string().required("İl seçilmelidir"),
  district: Yup.string().required("İlçe seçilmelidir"),
  address: Yup.string().required("Adres gereklidir"),
  sector: Yup.string().required("Sektör seçilmelidir"),
});

export default function ProfileForm({
  initialValues,
  onSubmit,
}: ProfileFormProps) {
  const formik = useFormik<ProfileFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="space-y-6">
           <div>
            <Input
              label="Firma Adı"
              name="companyName"
              id="companyName"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.companyName && formik.errors.companyName
                  ? formik.errors.companyName
                  : undefined
              }
              placeholder="Firma adı giriniz"
            />
          </div>

           <div>
            <Textarea
              label="Firma Hakkında"
              name="aboutCompany"
              id="aboutCompany"
              value={formik.values.aboutCompany}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.aboutCompany && formik.errors.aboutCompany
                  ? formik.errors.aboutCompany
                  : undefined
              }
              placeholder="Firma hakkında bilgileri giriniz"
              rows={6}
            />
          </div>
        </div>

         <div className="space-y-6">
           <div>
            <Dropdown
              label="İl"
              name="city"
              id="city"
              value={formik.values.city}
              onChange={(e) => {
                formik.setFieldValue("city", e.target.value);
              }}
              onBlur={() => formik.setFieldTouched("city", true)}
              error={
                formik.touched.city && formik.errors.city
                  ? formik.errors.city
                  : undefined
              }
              options={cityOptions}
              placeholder="İl seçiniz"
            />
          </div>

          <div>
            <Dropdown
              label="İlçe"
              name="district"
              id="district"
              value={formik.values.district}
              onChange={(e) => {
                formik.setFieldValue("district", e.target.value);
              }}
              onBlur={() => formik.setFieldTouched("district", true)}
              error={
                formik.touched.district && formik.errors.district
                  ? formik.errors.district
                  : undefined
              }
              options={formik.values.city ? districtOptions[formik.values.city] || [] : []}
              placeholder="İlçe seçiniz"
              disabled={!formik.values.city}
            />
          </div>

           <div>
            <Textarea
              label="Adres Bilgisi"
              name="address"
              id="address"
              rows={2}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.address && formik.errors.address
                  ? formik.errors.address
                  : undefined
              }
              placeholder="Adres bilgisi giriniz"
            />
          </div>

           <div>
            <Dropdown
              label="Sektör"
              name="sector"
              id="sector"
              value={formik.values.sector}
              onChange={(e) => {
                formik.setFieldValue("sector", e.target.value);
              }}
              onBlur={() => formik.setFieldTouched("sector", true)}
              error={
                formik.touched.sector && formik.errors.sector
                  ? formik.errors.sector
                  : undefined
              }
              options={sectorOptions}
              placeholder="Sektör seçiniz"
            />
          </div>
        </div>
      </div>

       <div className="flex justify-center pt-4">
        <Button
          type="submit"
          className="px-12 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#4C226A" }}
        >
          Profili Kaydet
        </Button>
      </div>
    </form>
  );
}

