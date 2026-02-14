import {
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  ReviewAnalytics as ReviewAnalyticsType,
  ReviewAction,
  RejectionReason,
} from "../../../../product-plan/sections/review/types";

interface ReviewAnalyticsProps {
  analytics: ReviewAnalyticsType;
  recentActions: ReviewAction[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string; positive?: boolean };
  urgent?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  urgent,
}: StatCardProps) {
  return (
    <Card className={urgent ? "border-amber-500 dark:border-amber-400" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-400">
          {title}
        </CardTitle>
        <div className={urgent ? "text-amber-500" : "text-primary"}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${urgent ? "text-amber-600 dark:text-amber-400" : "text-stone-900 dark:text-stone-100"}`}
        >
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp
              className={`h-3 w-3 ${trend.positive ? "text-emerald-500" : "text-red-500"}`}
            />
            <span
              className={`text-xs ${trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const programTypeLabels: Record<string, string> = {
  expressive_labeling: "Expressive Labeling",
  receptive_identification: "Receptive ID",
  intraverbal: "Intraverbal",
  listener_responding: "Listener Responding",
};

const rejectionReasonLabels: Record<RejectionReason, string> = {
  too_complex: "Too Complex",
  image_quality: "Image Quality",
  incorrect_content: "Incorrect Content",
  not_age_appropriate: "Not Age-Appropriate",
  too_simple: "Too Simple",
  copyright_concerns: "Copyright Concerns",
  other: "Other",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

export default function ReviewAnalytics({
  analytics,
  recentActions,
}: ReviewAnalyticsProps) {
  const {
    summary,
    by_program_type,
    rejection_reasons,
    confidence_score_distribution,
  } = analytics;

  const pendingUrgent = summary.pending_review_count > 50;

  // Calculate rejection reasons with counts > 0
  const activeRejectionReasons = Object.entries(rejection_reasons)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const totalRejections = Object.values(rejection_reasons).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Generated"
          value={summary.total_stimuli_generated}
          subtitle="All time"
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Review"
          value={summary.pending_review_count}
          subtitle={`${summary.batches_pending} batches waiting`}
          icon={
            pendingUrgent ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )
          }
          urgent={pendingUrgent}
        />
        <StatCard
          title="Approval Rate"
          value={`${summary.approval_rate}%`}
          subtitle={`${summary.approved_count} approved`}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{ value: 2.5, label: "vs last week", positive: true }}
        />
        <StatCard
          title="Avg Review Time"
          value={formatDuration(
            Math.round(summary.average_review_time_seconds),
          )}
          subtitle="Per stimulus"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval by Program Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Approval by Program Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(by_program_type).map(([type, stats]) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    {programTypeLabels[type] || type}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {stats.approved}/{stats.total} ({stats.approval_rate}%)
                  </span>
                </div>
                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${stats.approval_rate}%` }}
                  />
                </div>
                <div className="flex gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    {stats.approved} approved
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {stats.rejected} rejected
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    {stats.pending} pending
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rejection Reasons & Confidence */}
        <div className="space-y-6">
          {/* Rejection Reasons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Rejection Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeRejectionReasons.length > 0 ? (
                <div className="space-y-3">
                  {activeRejectionReasons.map(([reason, count]) => (
                    <div
                      key={reason}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-stone-700 dark:text-stone-300">
                        {rejectionReasonLabels[reason as RejectionReason]}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{
                              width: `${(count / Math.max(totalRejections, 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                  No rejections recorded yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Confidence Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Confidence Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {confidence_score_distribution.high}
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300">
                    High
                  </div>
                </div>
                <div className="flex-1 text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {confidence_score_distribution.medium}
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    Medium
                  </div>
                </div>
                <div className="flex-1 text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {confidence_score_distribution.low}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">
                    Low
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Review Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700">
                    <th className="text-left py-2 px-3 font-medium text-stone-500 dark:text-stone-400">
                      Time
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-stone-500 dark:text-stone-400">
                      Reviewer
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-stone-500 dark:text-stone-400">
                      Stimulus
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-stone-500 dark:text-stone-400">
                      Decision
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-stone-500 dark:text-stone-400">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActions.slice(0, 10).map((action) => (
                    <tr
                      key={action.action_id}
                      className="border-b border-stone-100 dark:border-stone-800"
                    >
                      <td className="py-2 px-3 text-stone-500 dark:text-stone-400">
                        {formatDate(action.timestamp)}
                      </td>
                      <td className="py-2 px-3 text-stone-700 dark:text-stone-300">
                        {action.reviewer_name}
                      </td>
                      <td className="py-2 px-3 font-mono text-xs text-stone-500 dark:text-stone-400">
                        {action.stimulus_id}
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          variant="secondary"
                          className={
                            action.action_type === "approve"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {action.action_type === "approve" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {action.action_type}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-right text-stone-500 dark:text-stone-400">
                        {formatDuration(action.time_spent_seconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-8">
              No review activity recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
