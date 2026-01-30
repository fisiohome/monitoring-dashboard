import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden">
                <Header />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#F8FAFC]">
                    {children}
                </main>
            </div>
        </div>
    );
}
