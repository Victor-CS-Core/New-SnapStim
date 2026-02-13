import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import type { ProgramStatus } from "../../../../product-plan/sections/programs/types";

interface ProgramStatusBadgeProps {
  status: ProgramStatus;
}

const statusConfig: Record<ProgramStatus, { label: string; className: string }> =
  {
    active: {
      label: "Active",
      className:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
    },
    paused: {
      label: "Paused",
      className:
        "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
    },
    mastered: {
      label: "Mastered",
      className:
        "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400",
    },
    archived: {
      label: "Archived",
      className:
        "bg-stone-100 text-stone-600 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-400",
    },
  };

export default function ProgramStatusBadge({ status }: ProgramStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={`${config.className} inline-flex items-center gap-1`}>
      {status === "mastered" && <Trophy className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
