"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import menuItems from "@/lib/constants/sidebar";

interface SidebarContentProps {
  className?: string;
  onNavClick?: () => void;
}

import { handleLogout as performLogout } from "@/lib/api/client";

export function SidebarContent({ className, onNavClick }: SidebarContentProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await performLogout();
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white text-slate-900 border-r border-slate-100",
        className,
      )}
    >
      <div className="p-4 flex items-center gap-2 border-b border-slate-100">
        <div className="relative w-28 h-8">
          <Image
            src="/logo.png"
            alt="Fisiohome"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        {menuItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavClick}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 relative overflow-hidden group/item ${
                        isActive
                          ? "bg-linear-to-r from-[#6200EE] to-[#8B5CF6] text-white shadow-lg shadow-purple-500/20 translate-x-1"
                          : "text-slate-500 hover:bg-slate-50 hover:text-[#6200EE] hover:translate-x-1"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover/item:text-[#6200EE]"}`}
                      />
                      <span className="relative z-10">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-[9px] px-1.5 py-px rounded-full shadow-sm shadow-red-200">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Log out
        </Button>
      </div>
    </div>
  );
}
