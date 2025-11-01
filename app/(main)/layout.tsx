import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#F7F6F9]">
        <Header />
        {children}
      </main>
    </div>
  );
}

