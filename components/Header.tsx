"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { handleLogout as performLogout } from "@/lib/api/client";

const routeLabels: Record<string, string> = {
  dashboard: "Overview",
  orders: "Orders",
  appointments: "Appointments",
  reschedule: "Reschedule",
  feedbacks: "Feedback",
  payments: "Payments",
  funnel: "Funnel",
};

function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const visibleSegments = segments.filter(
    (seg) => !/^\d+$/.test(seg) && seg.length < 30
  );

  return (
    <nav className="flex items-center gap-1.5 text-[13px] min-w-0 font-medium">
      {visibleSegments.map((seg, idx) => {
        const isLast = idx === visibleSegments.length - 1;
        const label = routeLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
        return (
          <span key={`${seg}-${idx}`} className="flex items-center gap-2 min-w-0">
            {idx > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            )}
            <span
              className={
                isLast
                  ? "font-semibold text-slate-900 truncate tracking-tight transition-colors"
                  : "text-slate-500 hover:text-slate-700 truncate tracking-tight transition-colors cursor-default"
              }
            >
              {label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}

export function Header() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const email = Cookies.get("user_email") || "";
    setUserEmail(email);
    if (email) {
      const namePart = email.split("@")[0];
      const formattedName = namePart
        .replace(/[._]/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setUserName(formattedName);
    } else {
      setUserName("Admin");
    }
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await performLogout();
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 bg-white/75 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-6 transition-all duration-300">
      {/* Left: Sidebar toggle + Divider + Breadcrumb */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <SidebarTrigger className="shrink-0 h-8 w-8 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200" />

        <div className="h-5 w-px bg-slate-200 shrink-0 hidden md:block" />

        <div className="hidden md:flex min-w-0">
          <Breadcrumb />
        </div>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200"
          >
            <Bell className="h-4 w-4" />
          </Button>
          {/* Animated badge */}
          <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF3B30] ring-2 ring-white" />
          </span>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-2xl pl-1.5 pr-3 py-1.5 hover:bg-slate-100/80 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#6200EE]/50 group">
              <Avatar className="h-7 w-7 ring-2 ring-slate-100 shrink-0 transition-all duration-300 group-hover:ring-[#6200EE]/30 group-hover:scale-105 shadow-sm">
                <AvatarFallback className="bg-linear-to-br from-[#6200EE] to-[#9333EA] text-white text-[10px] font-bold">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start translate-y-px">
                <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] font-medium text-slate-500 leading-tight truncate max-w-35 mt-0.5">
                  {userEmail}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-60 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xl shadow-black/4 p-2 overflow-hidden"
          >
            <DropdownMenuLabel className="px-3 py-2 rounded-xl">
              <p className="text-[13px] font-semibold text-slate-900 tracking-tight">{userName}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                {userEmail}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem className="rounded-xl gap-2.5 px-3 py-2 cursor-pointer text-[12px] font-medium text-slate-600 hover:text-slate-900 focus:text-slate-900 hover:bg-slate-50 focus:bg-slate-50 transition-colors">
              <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              Profile settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl gap-2.5 px-3 py-2 cursor-pointer text-[12px] font-medium text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 focus:bg-red-50 transition-colors group"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0 text-red-500 group-hover:text-red-600 group-focus:text-red-600" />
              Log out securely
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
