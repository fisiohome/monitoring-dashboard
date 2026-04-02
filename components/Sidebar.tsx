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
