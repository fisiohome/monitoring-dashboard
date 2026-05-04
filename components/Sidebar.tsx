<<<<<<< HEAD
"use client";

import { SidebarContent } from "@/components/SidebarContent";

export function Sidebar() {
  return (
    <aside
      suppressHydrationWarning
      className="w-56 bg-white border-r border-slate-100 hidden md:flex flex-col fixed h-full z-10 transition-all duration-300"
    >
      <SidebarContent />
    </aside>
  );
}
=======
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  MessageSquare,
  LogOut,
  FileText, // <-- Tambahan icon untuk draft
} from "lucide-react";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  {
    group: "Monitoring",
    items: [
      { icon: LayoutGrid, label: "Overview", href: "/dashboard" },
      { icon: BarChart2, label: "Funnel", href: "/dashboard/funnel" },
    ],
  },
  {
    group: "Orders",
    items: [
      { icon: CheckSquare, label: "Orders", href: "/dashboard/orders" },
      { icon: Users, label: "Appointments", href: "/dashboard/appointments" },
      // 👇 INI LINK YANG SUDAH DIPERBAIKI (Tidak pakai /appointments/) 👇
      { icon: FileText, label: "Appointment Drafts", href: "/dashboard/appointment-drafts" },
      { icon: MessageSquare, label: "Feedback", href: "/dashboard/feedbacks" },
      { icon: Calendar, label: "Reschedule", href: "/dashboard/reschedule" },
    ],
  },
  {
    group: "Finance",
    items: [
      { icon: CheckSquare, label: "Payments", href: "/dashboard/payments" },
    ],
  },
];

export default menuItems;
>>>>>>> db49d30 (nambahkan detail appoinment draft)
