import { PersistentSidebarProvider } from "@/components/PersistentSidebarProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistentSidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-svh w-full overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-8 bg-[#F8FAFC] overflow-y-auto">
          {children}
        </main>
      </div>
    </PersistentSidebarProvider>
  );
}
