import { useState } from "react";
import { Check, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopySoapLink({
  appointmentId,
  className,
}: {
  appointmentId: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const baseUrl =
      process.env.NEXT_PUBLIC_SOAP_BASE_URL || "https://karpis.fisiohome.id";
    const url = `${baseUrl}/bookings/${appointmentId}/soap`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("h-8 text-xs", className)}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
      ) : (
        <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
      )}
      {copied ? "Link Tersalin" : "Copy Link SOAP"}
    </Button>
  );
}
