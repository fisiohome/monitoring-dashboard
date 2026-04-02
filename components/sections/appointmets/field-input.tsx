import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FieldInput({
  label,
  placeholder,
  defaultValue,
  type = "text",
  onCommit,
}: {
  label: string;
  placeholder?: string;
  defaultValue: string;
  type?: string;
  onCommit: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-500 font-medium">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={(e) => onCommit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit((e.target as HTMLInputElement).value);
        }}
        className="w-full h-9 bg-white"
      />
    </div>
  );
}
