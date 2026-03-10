"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  className?: string;
  onCopy?: () => void;
}

export function CopyButton({ value, className, onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Berhasil disalin!");
        if (onCopy) onCopy();
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error("Clipboard API tidak didukung");
      }
    } catch (err) {
      toast.error("Gagal menyalin teks");
    }
  };

  if (!value) return null;

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-[#6200EE] transition-all focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 shrink-0",
        className,
      )}
      title="Salin ke clipboard"
      type="button"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
