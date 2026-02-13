import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "../../../../product-plan/sections/accounts/types";

interface StatusBadgeProps {
  status: UserStatus;
}

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  Active: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
  Inactive: {
    label: "Inactive",
    className:
      "bg-stone-100 text-stone-600 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-400",
  },
  Pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
