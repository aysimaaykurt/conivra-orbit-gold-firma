"use client";

import Image from "next/image";
import { useMemo, useState, useRef, useEffect } from "react";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { Menu } from "primereact/menu";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/src/navigation";
import goldStatue from "@/src/images/goldStatue.png";
import { logout } from "@/src/api/auth/auth.service";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");
  const [notificationCount] = useState(4); // Bildirimler ileride dinamik yapılabilir
  const profileMenu = useRef<Menu>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedOrgs = localStorage.getItem("organizations");
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (storedOrgs) {
        const orgs = JSON.parse(storedOrgs);
        if (orgs && orgs.length > 0) {
          setOrganization(orgs[0]);
        }
      }
    }
  }, []);

  const profileItems = [
    {
      label: 'Profilim',
      icon: 'pi pi-user',
      command: () => {
        router.push('/profile');
      },
      template: (item: any, options: any) => (
        <button onClick={(e) => options.onClick(e)} className="w-full flex items-center px-3 py-2 text-sm font-semibold rounded transition-colors cursor-pointer text-gray-700 hover:bg-gray-50 mb-1">
          <i className={`${item.icon} text-xs mr-2`}></i>
          <span>{item.label}</span>
        </button>
      )
    },
    {
      label: 'Çıkış Yap',
      icon: 'pi pi-sign-out',
      command: () => {
        logout();
        router.push('/login');
      },
      template: (item: any, options: any) => (
        <button onClick={(e) => options.onClick(e)} className="w-full flex items-center px-3 py-2 text-sm font-semibold rounded transition-colors cursor-pointer text-red-600 hover:bg-red-50 border-t border-gray-100">
          <i className={`${item.icon} text-xs mr-2`}></i>
          <span>{item.label}</span>
        </button>
      )
    }
  ];

  function getStatusLabel(status: string | null | undefined) {
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
      router.replace(pathname || '/', { locale: newLocale });
    }
  };

  const copyReferralCode = () => {
    if (organization?.code) {
      navigator.clipboard.writeText(organization.code);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white" style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>

      <div className="ml-1 md:ml-5 flex h-16 items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            className="md:hidden p-2 text-dark hover:bg-gray-50 rounded-lg transition-colors"
            onClick={(e) => {
              // Menüyü kapat, ki sidebar açılınca üst üste binmesin
              if (profileMenu.current) {
                profileMenu.current.hide(e);
              }
              if (typeof document !== "undefined") {
                document.dispatchEvent(new CustomEvent("toggleSidebar"));
              }
            }}
            aria-label="Toggle Menu"
          >
            <i className="pi pi-bars text-xl"></i>
          </button>
          <Image src={goldStatue} alt="Gold Statue" width={32} height={32} className="object-contain" />
          <span className="hidden sm:inline text-sm font-semibold" style={{ color: "#D99B2B" }}>
            {getStatusLabel(user?.subscriptionStatus)}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="relative p-1.5 md:p-2 hover:bg-gray-50 rounded-lg transition-colors overflow-visible">
            <i className="pi pi-bell text-lg md:text-xl text-lightGray relative z-0"></i>
            {notificationCount > 0 && (
              <span
                className="absolute top-1 right-1 bg-error text-white text-[10px] md:text-xs font-bold rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center leading-none z-20 pointer-events-none"
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
            value={locale}
            onChange={(e) => handleLanguageChange(e.value)}
            options={languageOptions}
            optionLabel="label"
            optionValue="value"
            itemTemplate={(option) => (
              <div className="flex items-center gap-2 py-1">
                <span className="text-base">{option.flag}</span>
                <span className="font-semibold text-sm" style={{ color: '#202020' }}>{option.label}</span>
              </div>
            )}
            valueTemplate={(option, props) => {
              const currentOption = option || languageOptions.find(opt => opt.value === props.value) || languageOptions[0];
              if (!currentOption) return null;
              
              return (
                <div className="flex items-center gap-1 md:gap-2 px-1">
                  <span className="text-base">{currentOption.flag}</span>
                  <span className="hidden sm:inline font-semibold text-xs md:text-sm" style={{ color: '#202020' }}>{currentOption.label}</span>
                </div>
              );
            }}
            className="header-language-dropdown !border-lightGray rounded-full !w-[80px] sm:!w-[100px] md:!w-[140px]"
            panelClassName="rounded-lg shadow-lg border border-lightGray/20"
            appendTo="self"
            style={{
              backgroundColor: "white",
              borderColor: "#A5A5A5",
              borderWidth: "0.5px",
              height: "40px",
            }}
          />

          <button
            onClick={copyReferralCode}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-white border border-lightGray rounded-full hover:bg-gray-50 transition-colors"
            style={{
              borderWidth: "0.5px",
              height: "40px",
            }}
            title={organization?.code ? t("referralCode") : "Referans kodu yok"}
          >
            <i className="pi pi-link text-primary text-sm md:text-base"></i>
            <span className="hidden lg:inline text-sm font-semibold text-dark">
              {organization?.code || t("referralCode")}
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <Menu 
              model={profileItems} 
              popup 
              popupAlignment="right"
              ref={profileMenu} 
              id="popup_profile_menu"
              className="w-40 mt-1 shadow-lg border border-lightGray/20 rounded-lg"
              pt={{
                root: { className: "p-1" }
              }}
            />
            <button 
              onClick={(event) => profileMenu.current?.toggle(event)}
              aria-controls="popup_profile_menu"
              aria-haspopup
              className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1.5 hover:bg-gray-50 rounded transition-colors"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
                <i className="pi pi-user text-dark text-xs"></i>
              </div>
              <span className="hidden sm:inline text-xs md:text-sm font-semibold text-dark truncate max-w-[100px] md:max-w-[150px]">
                {organization?.name || (user ? `${user.firstName} ${user.lastName}` : "Yükleniyor...")}
              </span>
              <i className="pi pi-chevron-down text-[8px] md:text-[10px] text-lightGray"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
