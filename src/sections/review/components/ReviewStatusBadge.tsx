import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReviewStatus } from "../../../../product-plan/sections/review/types";

interface ReviewStatusBadgeProps {
  status: ReviewStatus;
}

const statusConfig: Record<
  ReviewStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    icon: <Clock className="h-3 w-3" />,
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: <XCircle className="h-3 w-3" />,
  },
};

export default function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={`gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
