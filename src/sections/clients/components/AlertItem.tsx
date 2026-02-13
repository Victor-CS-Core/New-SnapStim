import {
  AlertTriangle,
  AlertCircle,
  Trophy,
  Clock,
  TrendingDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import SeverityBadge from "./SeverityBadge";
import type { Alert } from "../../../../product-plan/sections/clients/types";

interface AlertItemProps {
  alert: Alert;
  onDismiss?: (alertId: string) => void;
}

const alertTypeIcons: Record<string, React.ElementType> = {
  performance_drop: TrendingDown,
  inactivity: Clock,
  review_due: AlertCircle,
  mastery_ready: Trophy,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AlertItem({ alert }: AlertItemProps) {
  const Icon = alertTypeIcons[alert.alert_type] || AlertTriangle;
  
  const borderColor = {
    info: "border-l-blue-500",
    warning: "border-l-amber-500",
    critical: "border-l-red-500",
  }[alert.severity];

  return (
    <Card
      className={`p-3 border-l-4 ${borderColor} bg-white dark:bg-stone-900`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full shrink-0 ${
            alert.severity === "critical"
              ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
              : alert.severity === "warning"
              ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={alert.severity} />
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {formatDate(alert.triggered_date)}
            </span>
          </div>
          <p className="text-sm text-stone-700 dark:text-stone-300">
            {alert.message}
          </p>
        </div>
      </div>
    </Card>
  );
}
