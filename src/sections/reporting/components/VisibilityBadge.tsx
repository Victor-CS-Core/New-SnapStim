import { Eye, EyeOff, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CommentVisibility } from "../../../../product-plan/sections/reporting/types";

interface VisibilityBadgeProps {
  visibility: CommentVisibility;
}

export default function VisibilityBadge({ visibility }: VisibilityBadgeProps) {
  const config = {
    public: {
      label: "Public",
      icon: Eye,
      className: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
    },
    clinical_team: {
      label: "Clinical Team",
      icon: EyeOff,
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    supervisor_only: {
      label: "Supervisor Only",
      icon: Lock,
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const { label, icon: Icon, className } = config[visibility];

  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}
