import {
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgramStatusBadge from "./ProgramStatusBadge";
import type { Program } from "../../../../product-plan/sections/clients/types";

interface ProgramCardProps {
  program: Program;
  onStartSession?: (programId: string) => void;
  onViewDetails?: (programId: string) => void;
}

const trendIcons: Record<string, React.ElementType> = {
  improving: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};

const trendColors: Record<string, string> = {
  improving: "text-emerald-600 dark:text-emerald-400",
  stable: "text-stone-500 dark:text-stone-400",
  declining: "text-red-600 dark:text-red-400",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ProgramCard({
  program,
  onStartSession,
  onViewDetails,
}: ProgramCardProps) {
  const TrendIcon = trendIcons[program.performance.trend];
  const trendColor = trendColors[program.performance.trend];

  const borderColor =
    program.status === "mastered"
      ? "border-green-500"
      : program.status === "paused"
      ? "border-amber-500"
      : program.performance.trend === "declining"
      ? "border-red-400"
      : program.performance.needs_review
      ? "border-amber-400"
      : "border-emerald-500";

  const accuracyColor =
    program.performance.accuracy_percent >= program.mastery_threshold
      ? "text-emerald-600 dark:text-emerald-400"
      : program.performance.accuracy_percent >= program.mastery_threshold - 10
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <Card
      className={`border-l-4 ${borderColor} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onViewDetails?.(program.program_id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              {program.program_name}
            </CardTitle>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {program.category} • {program.current_phase}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {program.status === "mastered" && (
              <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
            {program.performance.needs_review && (
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
            <ProgramStatusBadge status={program.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className={`text-lg font-bold ${accuracyColor}`}>
              {program.performance.accuracy_percent}%
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 uppercase">
              Accuracy
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <span className={`text-sm font-medium ${trendColor}`}>
                {program.performance.trend}
              </span>
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 uppercase">
              Trend
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-stone-700 dark:text-stone-300">
              {program.performance.total_trials}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 uppercase">
              Trials
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-stone-500 dark:text-stone-400">
              Mastery: {program.mastery_threshold}%
            </span>
            <span className="text-stone-500 dark:text-stone-400">
              {program.performance.consecutive_mastery_sessions} sessions
            </span>
          </div>
          <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                program.performance.accuracy_percent >= program.mastery_threshold
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (program.performance.accuracy_percent / program.mastery_threshold) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Last run: {formatDate(program.last_run_date)}
          </span>
          {program.status === "active" && (
            <Button
              size="sm"
              variant="default"
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onStartSession?.(program.program_id);
              }}
            >
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
