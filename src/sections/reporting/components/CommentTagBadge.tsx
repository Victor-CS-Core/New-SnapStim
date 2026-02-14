import { Badge } from "@/components/ui/badge";
import type { CommentTag } from "../../../../product-plan/sections/reporting/types";

interface CommentTagBadgeProps {
  tag: CommentTag;
}

export default function CommentTagBadge({ tag }: CommentTagBadgeProps) {
  const config = {
    urgent: {
      label: "Urgent",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    question: {
      label: "Question",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    recommendation: {
      label: "Recommendation",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    review_needed: {
      label: "Review Needed",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    resolved: {
      label: "Resolved",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
  };

  const { label, className } = config[tag] || config.question;

  return <Badge className={className}>{label}</Badge>;
}
