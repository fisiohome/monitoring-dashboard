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
    <div className="space-y-1">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={(e) => onCommit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit((e.target as HTMLInputElement).value);
        }}
        className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition placeholder:text-slate-300"
      />
    </div>
  );
}
