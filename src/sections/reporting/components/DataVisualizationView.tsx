import { TrendingUp, Users, Target, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartCard from "./ChartCard";
import reportingData from "../../../../product-plan/sections/reporting/data.json";
import type { DashboardMetrics } from "../../../../product-plan/sections/reporting/types";

const metrics = reportingData.dashboardMetrics as DashboardMetrics;

export default function DataVisualizationView() {
  // Mock chart data
  const accuracyTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Fruit Identification",
        data: [60, 70, 85, 100],
        color: "#10b981",
      },
      {
        label: "Body Parts",
        data: [55, 65, 75, 85],
        color: "#6366f1",
      },
    ],
  };

  const sessionVolumeData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Sessions",
        data: [3, 2, 4, 3, 3],
        color: "#f59e0b",
      },
    ],
  };

  const responseTypeData = {
    labels: ["Correct", "Incorrect", "Prompted", "No Response"],
    data: [75, 15, 8, 2],
    colors: ["#10b981", "#ef4444", "#f59e0b", "#6b7280"],
  };

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
        <ChartCard
          title="Accuracy Trends"
          description="Performance over time by program"
          chartType="line"
          data={accuracyTrendData}
        />

        <ChartCard
          title="Session Volume"
          description="Sessions completed by day"
          chartType="bar"
          data={sessionVolumeData}
        />

        <ChartCard
          title="Response Type Distribution"
          description="Breakdown of trial responses"
          chartType="pie"
          data={responseTypeData}
        />

        <ChartCard
          title="Mastery Progress"
          description="Programs nearing mastery criteria"
          chartType="progress"
          data={{
            programs: [
              { name: "Fruit Identification", progress: 100, status: "mastered" },
              { name: "Body Parts", progress: 85, status: "close" },
              { name: "Colors", progress: 60, status: "in-progress" },
              { name: "Emotions", progress: 100, status: "mastered" },
            ],
          }}
        />
      </div>
    </div>
  );
}
