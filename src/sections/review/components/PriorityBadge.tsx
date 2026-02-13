import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BatchPriority } from "../../../../product-plan/sections/review/types";

interface PriorityBadgeProps {
  priority: BatchPriority;
}

const priorityConfig: Record<
  BatchPriority,
  { label: string; className: string; icon: React.ReactNode }
> = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    icon: <ArrowUp className="h-3 w-3" />,
  },
  low: {
    label: "Low",
    className:
      "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
    icon: <ArrowDown className="h-3 w-3" />,
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="secondary" className={`gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
