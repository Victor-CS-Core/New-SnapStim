import {
  X,
  Play,
  Edit,
  Calendar,
  Target,
  Sparkles,
  Clock,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProgramTypeBadge from "./ProgramTypeBadge";
import ProgramStatusBadge from "./ProgramStatusBadge";
import TrendIndicator from "./TrendIndicator";
import type { Program } from "../../../../product-plan/sections/programs/types";

interface ProgramDetailProps {
  program: Program;
  onClose: () => void;
  onStartSession?: () => void;
  onEdit?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProgramDetail({
  program,
  onClose,
  onStartSession,
  onEdit,
}: ProgramDetailProps) {
  const progressPercent = Math.min(
    100,
    (program.performance.accuracy_percent / program.mastery_threshold) * 100,
  );

  const masteryProgress =
    program.performance.consecutive_mastery_sessions /
    program.consecutive_sessions_for_mastery;

  // Keyboard navigation: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="program-detail-title"
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle id="program-detail-title" className="text-xl">{program.program_name}</CardTitle>
              <ProgramStatusBadge status={program.status} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <ProgramTypeBadge type={program.program_type} />
              <Badge variant="outline">{program.category}</Badge>
              <Badge variant="outline" className="capitalize">
                {program.mode}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close program details panel">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <p className="text-stone-600 dark:text-stone-400">
            {program.description}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase">
                  Accuracy
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  program.performance.accuracy_percent >=
                  program.mastery_threshold
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {program.performance.accuracy_percent}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase">Trials</span>
              </div>
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {program.performance.total_trials}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase">
                  Sessions
                </span>
              </div>
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {program.performance.sessions_to_date}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase">Trend</span>
              </div>
              <TrendIndicator trend={program.performance.trend} />
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone-600 dark:text-stone-400">
                  Accuracy Progress
                </span>
                <span className="text-stone-500 dark:text-stone-400">
                  {program.performance.accuracy_percent}% /{" "}
                  {program.mastery_threshold}%
                </span>
              </div>
              <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    progressPercent >= 100 ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone-600 dark:text-stone-400">
                  Mastery Sessions
                </span>
                <span className="text-stone-500 dark:text-stone-400">
                  {program.performance.consecutive_mastery_sessions} /{" "}
                  {program.consecutive_sessions_for_mastery}
                </span>
              </div>
              <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    masteryProgress >= 1 ? "bg-green-500" : "bg-primary"
                  }`}
                  style={{ width: `${masteryProgress * 100}%` }}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Generation Stats */}
          <div>
            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Stimulus Generation
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
                <div className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {program.ai_metadata.stimuli_generated}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">Generated</div>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {program.ai_metadata.stimuli_approved}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">Approved</div>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {program.ai_metadata.stimuli_rejected}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">Rejected</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Teaching Instructions */}
          <div>
            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Teaching Instructions
            </h4>
            <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800 text-sm text-stone-600 dark:text-stone-400">
              {program.teaching_instructions}
            </div>
          </div>

          {/* Rerun Policy */}
          <div>
            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Session Settings
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {program.rerun_policy.error_correction ? (
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                ) : (
                  <X className="h-3 w-3 text-stone-400" />
                )}
                Error Correction
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {program.rerun_policy.immediate_rerun_on_error ? (
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                ) : (
                  <X className="h-3 w-3 text-stone-400" />
                )}
                Immediate Rerun
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {program.rerun_policy.mastery_maintenance ? (
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                ) : (
                  <X className="h-3 w-3 text-stone-400" />
                )}
                Mastery Maintenance
              </Badge>
              <Badge variant="outline">
                {program.rerun_policy.trial_count} trials/session
              </Badge>
            </div>
          </div>

          {/* Dates */}
          <div className="text-xs text-stone-500 dark:text-stone-400 space-y-1">
            <p>Created: {formatDate(program.created_date)}</p>
            <p>Last Run: {formatDate(program.last_run_date)}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {program.status === "active" && (
              <Button className="flex-1" onClick={onStartSession}>
                <Play className="mr-2 h-4 w-4" />
                Start Session
              </Button>
            )}
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Program
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
