"use client";

import { useEffect } from "react";
import { addLocale, locale } from "primereact/api";

export default function PrimeReactInitializer() {
  useEffect(() => {
    addLocale("tr", {
      firstDayOfWeek: 1,
      dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
      dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
      dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
      monthNames: [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
      ],
      monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
      today: "Bugün",
      clear: "Temizle"
    });
    locale("tr");
  }, []);

  return null;
}
