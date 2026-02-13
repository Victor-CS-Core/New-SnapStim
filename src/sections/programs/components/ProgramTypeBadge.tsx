import { Badge } from "@/components/ui/badge";
import type { ProgramType } from "../../../../product-plan/sections/programs/types";

interface ProgramTypeBadgeProps {
  type: ProgramType;
}

const typeConfig: Record<ProgramType, { label: string; className: string }> = {
  receptive_identification: {
    label: "Receptive ID",
    className:
      "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
  },
  expressive_labeling: {
    label: "Expressive",
    className:
      "bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-400",
  },
  intraverbal: {
    label: "Intraverbal",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  },
  listener_responding: {
    label: "Listener",
    className:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
};

export default function ProgramTypeBadge({ type }: ProgramTypeBadgeProps) {
  const config = typeConfig[type];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
