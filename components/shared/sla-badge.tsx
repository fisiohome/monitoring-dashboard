import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SlaBadge({
  minutes,
  label,
}: {
  minutes: number | null | undefined;
  label?: string;
}) {
  if (minutes === null || minutes === undefined) return null;

  const isLate = minutes > 0;
  const isExact = minutes === 0;
  const absMinutes = Math.abs(minutes);

  let timeStr = "";
  if (absMinutes < 60) {
    // only minutes
    timeStr = `${absMinutes} menit`;
  } else {
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;
    timeStr = mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
  }

  let textStr = "";
  if (isExact) {
    textStr = "Tepat Waktu";
  } else if (isLate) {
    textStr = `${timeStr} setelah jadwal visit`;
  } else {
    textStr = `${timeStr} sebelum jadwal visit`;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] uppercase tracking-wider font-bold px-2 py-0 h-5 border ml-2 shrink-0",
        isLate
          ? "bg-rose-50 text-rose-600 border-rose-200"
          : "bg-emerald-50 text-emerald-600 border-emerald-200",
      )}
      title={label ? `SLA ${label}` : undefined}
    >
      {textStr}
    </Badge>
  );
}
