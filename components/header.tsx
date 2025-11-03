"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/src/navigation";
import goldStatue from "@/src/images/goldStatue.png";
import { mockCompany, type CompanyProfile } from "@/src/mocks/user";

const mockReferralCode = "REF123456";

export default function Header() {
  const company = mockCompany;
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");
  const [notificationCount] = useState(4);

  function getStatusLabel(status: CompanyProfile["status"]) {
    switch (status) {
      case "Gold":
        return t("status.gold");
      case "Silver":
        return t("status.silver");
      case "Bronze":
        return t("status.bronze");
      default:
        return t("status.standard");
    }
  }

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
      // Navigate to the same pathname but with new locale
      // usePathname from next-intl already returns pathname without locale
      router.replace(pathname || '/', { locale: newLocale });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(mockReferralCode);
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white" style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
       <div className="absolute left-0 top-0 h-full w-5 bg-primary"></div>
      
      <div className="ml-5 flex h-16 items-center justify-between px-6">
         <div className="flex items-center gap-3">
          <Image src={goldStatue} alt="Gold Statue" width={32} height={32} className="object-contain" />
          <span className="text-sm font-semibold" style={{ color: "#D99B2B" }}>
            {getStatusLabel(company.status)}
          </span>
        </div>

         <div className="flex items-center gap-3">
           <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors overflow-visible">
            <i className="pi pi-bell text-xl text-lightGray relative z-0"></i>
            {notificationCount > 0 && (
              <span 
                className="absolute top-1 right-1 bg-error text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none z-20 pointer-events-none"
                style={{ 
                  transform: "translate(30%, -30%)",
                  backgroundColor: "#E53935",
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>

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
            className="header-language-dropdown !border-lightGray rounded-full"
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

           <button
            onClick={copyReferralCode}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-lightGray rounded-full hover:bg-gray-50 transition-colors"
            style={{ 
              borderWidth: "0.5px",
              height: "40px",
            }}
          >
            <i className="pi pi-link text-primary text-base"></i>
            <span className="text-sm font-semibold text-dark">{t("referralCode")}</span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded transition-colors">
            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
              <i className="pi pi-user text-dark text-xs"></i>
            </div>
            <span className="text-sm font-semibold text-dark">
              {company.companyName}
            </span>
            <i className="pi pi-chevron-down text-[10px] text-lightGray"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
