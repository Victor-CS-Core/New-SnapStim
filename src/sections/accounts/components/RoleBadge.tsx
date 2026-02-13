import { Badge } from "@/components/ui/badge";
import type { UserRole } from "../../../../product-plan/sections/accounts/types";

interface RoleBadgeProps {
  role: UserRole;
}

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  BCBA: {
    label: "BCBA",
    className:
      "bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-400",
  },
  RBT: {
    label: "RBT",
    className:
      "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
  },
  Caregiver: {
    label: "Caregiver",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400",
  },
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
