import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  MessageSquare,
  LogOut,
  FileText, // <-- Tambahkan icon FileText untuk drafts
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
      { icon: Calendar, label: "Reminders", href: "/dashboard/reminders" },
    ],
  },
  {
    group: "Orders",
    items: [
      { icon: CheckSquare, label: "Orders", href: "/dashboard/orders" },
      { icon: Users, label: "Appointments", href: "/dashboard/appointments" },
      // 👇 INI MENU BARU YANG DITAMBAHKAN DENGAN URL YANG BENAR 👇
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