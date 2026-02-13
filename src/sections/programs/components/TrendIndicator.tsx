import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PerformanceTrend } from "../../../../product-plan/sections/programs/types";

interface TrendIndicatorProps {
  trend: PerformanceTrend;
  showLabel?: boolean;
}

const trendConfig: Record<
  PerformanceTrend,
  { icon: typeof TrendingUp; label: string; className: string }
> = {
  improving: {
    icon: TrendingUp,
    label: "Improving",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  stable: {
    icon: Minus,
    label: "Stable",
    className: "text-stone-500 dark:text-stone-400",
  },
  declining: {
    icon: TrendingDown,
    label: "Declining",
    className: "text-red-600 dark:text-red-400",
  },
};

export default function TrendIndicator({
  trend,
  showLabel = true,
}: TrendIndicatorProps) {
  const config = trendConfig[trend];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1 ${config.className}`}>
      <Icon className="h-4 w-4" />
      {showLabel && <span className="text-sm font-medium">{config.label}</span>}
    </div>
  );
}
