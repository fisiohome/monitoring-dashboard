import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  MessageSquare,
  LogOut,
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
      { icon: Calendar, label: "Reschedule", href: "/dashboard/reschedule" },
      { icon: MessageSquare, label: "Feedback", href: "/dashboard/feedbacks" },
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
