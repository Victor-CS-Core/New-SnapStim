import { Badge } from "@/components/ui/badge";
import type { AlertSeverity } from "../../../../product-plan/sections/clients/types";

interface SeverityBadgeProps {
  severity: AlertSeverity;
}

const severityConfig: Record<AlertSeverity, { label: string; className: string }> =
  {
    info: {
      label: "Info",
      className:
        "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
    },
    warning: {
      label: "Warning",
      className:
        "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
    },
    critical: {
      label: "Critical",
      className:
        "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400",
    },
  };

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
