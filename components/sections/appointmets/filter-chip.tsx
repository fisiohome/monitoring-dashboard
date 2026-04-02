import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium border border-transparent pointer-events-auto">
      {label}
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-700 outline-none transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </Badge>
  );
}
