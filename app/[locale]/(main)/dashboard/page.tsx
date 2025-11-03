import InfoCards from "@/components/dashboard/infoCards";
import ApplicationList from "@/components/dashboard/applications";
import Shortcuts from "@/components/dashboard/shortcuts";
import MostPreferredList from "@/components/dashboard/mostPreferredList";
import PendingReviewList from "@/components/dashboard/pendingReviewList";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  
  return (
    <div className="p-4 bg-[#F7F6F9] min-h-screen">
      {/* Main Grid: 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Section: col-span-8 */}
        <div className="lg:col-span-8 grid grid-cols-12 gap-4">
          {/* Info Cards: col-span-12 */}
          <div className="col-span-12">
            <InfoCards />
          </div>

          {/* Bottom row */}
          <div className="col-span-12 grid grid-cols-12 gap-4">
            {/* Son Gelen Başvurular: col-span-8 */}
            <div className="col-span-12 lg:col-span-8">
              <ApplicationList />
            </div>

             <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
               <div className="col-span-1">
                <Shortcuts />
              </div>

               <div className="col-span-1">
                <MostPreferredList />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: col-span-4 */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Reklam Alanı: col-span-1 - flex-1 ile kalan boşluğu doldurur */}
          <div className="flex-1">
            <div className="bg-gray-200 rounded-lg shadow-sm p-6 flex items-center justify-center h-full min-h-[200px]">
              <span className="text-lightGray text-base font-semibold">{t("adArea")}</span>
            </div>
          </div>

          {/* Bekleyen Değerlendirmeler: col-span-1 */}
          <div>
            <PendingReviewList />
          </div>
        </div>
      </div>
    </div>
  );
}

