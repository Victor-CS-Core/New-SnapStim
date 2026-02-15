import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAccuracyTrends,
  useDashboardMetrics,
  useMasteryProgress,
  useResponseDistribution,
  useSessionVolume,
} from "@/hooks/useReporting";
import { Activity, Target, TrendingUp, Users } from "lucide-react";
import ChartCard from "./ChartCard";

export default function DataVisualizationView() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: accuracyTrends, isLoading: trendsLoading } =
    useAccuracyTrends();
  const { data: sessionVolume, isLoading: volumeLoading } = useSessionVolume();
  const { data: responseDistribution, isLoading: distributionLoading } =
    useResponseDistribution();
  const { data: masteryProgress, isLoading: masteryLoading } =
    useMasteryProgress();

  if (metricsLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 dark:text-stone-400">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Data Analytics</CardTitle>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Visual analysis of performance trends and session data
          </p>
        </CardHeader>
      </Card>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                  Total Sessions
                </p>
                <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {metrics.total_sessions_this_month}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  This month
                </p>
              </div>
              <Activity className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                  Average Accuracy
                </p>
                <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {metrics.average_accuracy_all_programs}%
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  All programs
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                  Mastery Programs
                </p>
                <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {metrics.programs_at_mastery}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Achieved
                </p>
              </div>
              <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                  Active Programs
                </p>
                <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {metrics.active_programs}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  In progress
                </p>
              </div>
              <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!trendsLoading && accuracyTrends && (
          <ChartCard
            title="Accuracy Trends"
            description="Performance over time by program"
            chartType="line"
            data={accuracyTrends}
          />
        )}

        {!volumeLoading && sessionVolume && (
          <ChartCard
            title="Session Volume"
            description="Sessions completed by day"
            chartType="bar"
            data={sessionVolume}
          />
        )}

        {!distributionLoading && responseDistribution && (
          <ChartCard
            title="Response Type Distribution"
            description="Breakdown of trial responses"
            chartType="pie"
            data={responseDistribution}
          />
        )}

        {!masteryLoading && masteryProgress && (
          <ChartCard
            title="Mastery Progress"
            description="Programs nearing mastery criteria"
            chartType="progress"
            data={masteryProgress}
          />
        )}
      </div>
    </div>
  );
}
