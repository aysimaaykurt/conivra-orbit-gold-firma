"use client";

import { shortcuts, type ShortcutItem } from "@/src/mocks/dashboard";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

 
export default function Shortcuts() {
  const t = useTranslations("dashboard");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-bold text-dark mb-8">{t("shortcuts")}</h2>
      <div className="space-y-6">
        {shortcuts.map((shortcut) => (
          <ShortcutItemComponent key={shortcut.id} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
}

function ShortcutItemComponent({ shortcut }: { shortcut: ShortcutItem }) {
  const t = useTranslations("dashboard.shortcutItems");
  const router = useRouter();

  const handleNavigation = () => {
    switch (shortcut.id) {
      case "create-ad":
        router.push("/ad-management");
        break;
      case "go-to-favorites":
        router.push("/favorites");
        break;
      case "search-influencer":
        router.push("/influencers");
        break;
      case "go-to-applications":
        router.push("/applications");
        break;
      default:
        break;
    }
  };
  
  return (
    <div onClick={handleNavigation} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: shortcut.bgColor }}
      >
        <i 
          className={`${shortcut.iconClass} text-xl`} 
          style={{ color: shortcut.iconColor }}
        ></i>
      </div>
      <span className="text-dark text-base font-medium">{t(shortcut.id)}</span>
    </div>
  );
}

