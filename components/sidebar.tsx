"use client";

import { Link } from "@/src/navigation";
import Image from "next/image";
import { usePathname } from "@/src/navigation";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import activeTabImage from "@/src/images/ActiveTab.png";

type MenuItemBase = {
  labelKey: string;
  href: string;
  icon: string;
};

type MenuItem = MenuItemBase & {
  label: string;
};

const menuItems: MenuItemBase[] = [
  { labelKey: "dashboard", href: "/dashboard", icon: "pi pi-home" },
  { labelKey: "adManagement", href: "/ad-management", icon: "pi pi-list" },
  { labelKey: "applications", href: "/applications", icon: "pi pi-calendar" },
  { labelKey: "projects", href: "/projects", icon: "pi pi-check" },
  { labelKey: "profile", href: "/profile", icon: "pi pi-id-card" },
  { labelKey: "support", href: "/support", icon: "pi pi-headphones" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const translatedMenuItems = useMemo<MenuItem[]>(
    () =>
      menuItems.map((item) => ({
        ...item,
        label: t(item.labelKey),
      })),
    [t]
  );

  return (
    <div className={`h-screen bg-primary flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`} style={{ backgroundColor: '#4C226A' }}>
       <div className="flex items-center justify-between p-6 ">
        {!isCollapsed && (
          <h1 className="text-white text-xl font-bold uppercase tracking-wider">CONIVRA</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-white/10 p-2 rounded transition-colors"
          aria-label="Toggle sidebar"
        >
          <i className="pi pi-bars text-xl"></i>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 pl-2">
        <ul className="space-y-2">
          {translatedMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 transition-all duration-200 relative z-10 min-h-[48px]
                    ${isActive
                      ? 'text-primary'
                      : 'text-white hover:bg-white/10'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 -left-2 right-0 z-0 overflow-hidden">
                      <Image
                        src={activeTabImage}
                        alt="Active tab background"
                        fill
                        className="object-cover w-full h-full"
                        sizes="(max-width: 256px) 100vw, 256px"
                        priority
                      />
                    </div>
                  )}
                  <i className={`${item.icon} ${isActive ? 'text-primary' : 'text-white'} text-xl relative z-10`}></i>
                  {!isCollapsed && (
                    <span className={`font-medium ${isActive ? 'text-primary' : 'text-white'} relative z-10`}>{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

