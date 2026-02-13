import { Badge } from "@/components/ui/badge";
import type { ConfidenceLevel } from "../../../../product-plan/sections/review/types";

interface ConfidenceBadgeProps {
  score: number;
}

function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

const confidenceConfig: Record<
  ConfidenceLevel,
  { label: string; className: string }
> = {
  high: {
    label: "High",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  low: {
    label: "Low",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const level = getConfidenceLevel(score);
  const config = confidenceConfig[level];
  const percent = Math.round(score * 100);

  return (
    <Badge variant="secondary" className={config.className}>
      {percent}%
    </Badge>
  );
}

export function ConfidenceBar({ score }: ConfidenceBadgeProps) {
  const level = getConfidenceLevel(score);
  const percent = Math.round(score * 100);

  const barColor =
    level === "high"
      ? "bg-emerald-500"
      : level === "medium"
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-medium text-stone-600 dark:text-stone-400 w-10">
        {percent}%
      </span>
    </div>
  );
}
