"use client";

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

const SIDEBAR_STORAGE_KEY = "fisiohome_sidebar_open";

export function PersistentSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      setOpen(stored === "true");
    }
    setMounted(true);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newOpen));
  };

  // Avoid hydration mismatch — render nothing until we know client state
  if (!mounted) {
    return (
      <SidebarProvider defaultOpen={true}>
        {children}
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider open={open} onOpenChange={handleOpenChange}>
      {children}
    </SidebarProvider>
  );
}
