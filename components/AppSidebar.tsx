"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import menuItems from "@/lib/constants/sidebar";
import { handleLogout as performLogout } from "@/lib/api/client";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    await performLogout();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/60 bg-white/50 backdrop-blur-3xl"
    >
      {/* ── Logo Header ── */}
      <SidebarHeader
        className={cn(
          "py-4 transition-all duration-300",
          isCollapsed ? "px-0" : "px-4",
        )}
      >
        <div className="flex flex-col items-center justify-center overflow-hidden">
          {/* Logo icon — always visible */}
          <div
            className={cn(
              "relative shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center transition-all duration-300",
              isCollapsed ? "w-6 h-6" : "w-10 h-10 mb-1",
            )}
          >
            <Image
              src="/Fisiohome.png"
              alt="Fisiohome"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          {/* Name — hidden when collapsed */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out text-center flex flex-col justify-center",
              isCollapsed
                ? "max-h-0 w-0 opacity-0"
                : "max-h-12.5 w-auto opacity-100",
            )}
          >
            <p className="text-[10px] font-medium text-slate-500 tracking-tight leading-tight whitespace-nowrap">
              Monitoring Dashboard
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-slate-100 mx-0" />

      {/* ── Navigation ── */}
      <SidebarContent
        className={cn("py-3 gap-0", isCollapsed ? "px-2" : "px-3")}
      >
        {menuItems.map((group, groupIdx) => (
          <SidebarGroup key={group.group} className="p-0 mb-3">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 h-5">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={{
                          children: item.label,
                          className: "font-medium text-[13px]",
                        }}
                        size="sm"
                        className={cn(
                          "relative rounded-xl h-8 gap-2.5 transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-[#6200EE]/50",
                          isActive
                            ? "bg-[#6200EE]/6 text-[#6200EE] font-semibold"
                            : "text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-100/60",
                          isCollapsed ? "justify-center px-0" : "",
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors duration-200",
                              isActive
                                ? "text-[#6200EE]"
                                : "text-slate-400 group-hover:text-slate-600",
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs tracking-tight transition-all duration-200",
                              isCollapsed
                                ? "w-0 opacity-0 hidden"
                                : "w-auto opacity-100",
                            )}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={cn(
                                "ml-auto bg-[#FF3B30] text-white text-[9px] font-bold px-1.5 py-px rounded-full leading-none shadow-sm shadow-red-500/20 transition-all",
                                isCollapsed
                                  ? "w-0 opacity-0 hidden"
                                  : "opacity-100",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {groupIdx < menuItems.length - 1 && !isCollapsed && (
              <div className="mt-1" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer / Logout ── */}
      <SidebarFooter className="px-3 pb-6 border-t border-slate-100/80 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{
                children: "Log out",
                className: "font-medium text-[13px]",
              }}
              size="sm"
              onClick={handleLogout}
              className={cn(
                "rounded-xl h-8 gap-2.5 text-red-500 hover:text-red-600 hover:bg-red-50/80 font-medium cursor-pointer transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
                isCollapsed ? "justify-center px-0" : "",
              )}
            >
              <LogOut className="h-4 w-4 shrink-0 text-red-500/80 group-hover:text-red-600" />
              <span
                className={cn(
                  "text-xs tracking-tight transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0 hidden" : "",
                )}
              >
                Log out securely
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-slate-200" />
    </Sidebar>
  );
}
