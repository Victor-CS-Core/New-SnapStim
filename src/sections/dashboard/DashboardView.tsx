import { useMemo } from "react";
import {
  Target,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  Play,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigation } from "@/lib/NavigationContext";
import { useClients } from "@/hooks/useClients";
import { usePrograms } from "@/hooks/usePrograms";
import { useSessions } from "@/hooks/useSessions";

import type { Client } from "../../../product-plan/sections/clients/types";
import type { Program } from "../../../product-plan/sections/programs/types";
import type { Session } from "../../../product-plan/sections/sessions/types";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  alert?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  alert,
}: StatCardProps) {
  return (
    <Card className={alert ? "border-amber-500 dark:border-amber-600" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-400">
          {title}
        </CardTitle>
        <div
          className={
            alert ? "text-amber-600 dark:text-amber-500" : "text-primary"
          }
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
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
              className={`h-3 w-3 ${trend.positive ? "text-emerald-500" : "text-red-500 rotate-180"}`}
            />
            <span
              className={`text-xs ${trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}% vs last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AlertItemProps {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  onClick?: () => void;
}

function AlertItem({ title, description, severity, onClick }: AlertItemProps) {
  const severityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  };

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="mt-0.5">
        <AlertTriangle
          className={`h-4 w-4 ${severity === "high" ? "text-red-500" : "text-amber-500"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
            {title}
          </span>
          <Badge
            variant="secondary"
            className={`text-[10px] ${severityColors[severity]}`}
          >
            {severity}
          </Badge>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          {description}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 text-stone-400 shrink-0 mt-1" />
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
}

function ActivityItem({ icon, title, subtitle, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 p-3">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
          {title}
        </p>
        <p className="text-xs text-stone-600 dark:text-stone-400">{subtitle}</p>
      </div>
      <span className="text-xs text-stone-500 dark:text-stone-400 shrink-0">
        {time}
      </span>
    </div>
  );
}

export default function DashboardView() {
  const { navigateTo } = useNavigation();
  
  // Load data from backend via React Query hooks
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();

  // Show loading state while data is fetching
  const isLoading = clientsLoading || programsLoading || sessionsLoading;

  // Calculate metrics
  const metrics = useMemo(() => {
    if (isLoading || !clients.length) {
      return {
        activeClientsCount: 0,
        clientsNeedingAttentionCount: 0,
        activeProgramsCount: 0,
        masteredProgramsCount: 0,
        improvingProgramsCount: 0,
        sessionsThisWeek: 0,
        avgAccuracy: 0,
        totalAIStimuli: 0,
        approvedStimuli: 0,
        aiApprovalRate: 0,
      };
    }

    const activeClients = clients.filter((c) => c.status === "active");
    const clientsNeedingAttention = activeClients.filter(
      (c) =>
        c.ai_insights?.intervention_suggested || c.ai_insights?.risk_score > 50,
    );

    const activePrograms = programs.filter((p) => p.status === "active");
    const masteredPrograms = programs.filter((p) => p.status === "mastered");
    const improvingPrograms = programs.filter(
      (p) => p.performance.trend === "improving",
    );

    // Get sessions from this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentSessions = sessions.filter((s) => {
      const sessionDate = new Date(s.start_time);
      return sessionDate >= oneWeekAgo && s.status === "completed";
    });

    // Calculate average accuracy across active programs
    const avgAccuracy =
      activePrograms.length > 0
        ? Math.round(
            activePrograms.reduce(
              (sum, p) => sum + p.performance.accuracy_percent,
              0,
            ) / activePrograms.length,
          )
        : 0;

    // Calculate total AI stimuli
    const totalAIStimuli = programs.reduce(
      (sum, p) => sum + p.ai_metadata.stimuli_generated,
      0,
    );
    const approvedStimuli = programs.reduce(
      (sum, p) => sum + p.ai_metadata.stimuli_approved,
      0,
    );

    return {
      activeClientsCount: activeClients.length,
      clientsNeedingAttentionCount: clientsNeedingAttention.length,
      activeProgramsCount: activePrograms.length,
      masteredProgramsCount: masteredPrograms.length,
      improvingProgramsCount: improvingPrograms.length,
      sessionsThisWeek: recentSessions.length,
      avgAccuracy,
      totalAIStimuli,
      approvedStimuli,
      aiApprovalRate:
        totalAIStimuli > 0
          ? Math.round((approvedStimuli / totalAIStimuli) * 100)
          : 0,
    };
  }, [clients, programs, sessions, isLoading]);

  // Get alerts
  const alerts = useMemo(() => {
    const result: AlertItemProps[] = [];

    // Client alerts
    clients.forEach((client) => {
      if (client.ai_insights?.intervention_suggested) {
        result.push({
          title: `${client.first_name} ${client.last_name}`,
          description: client.ai_insights.explanation_text || "Needs attention",
          severity: client.ai_insights.risk_score > 70 ? "high" : "medium",
          onClick: () =>
            navigateTo("/clients", {
              clientId: client.client_id,
              sourceView: "dashboard",
            }),
        });
      }
    });

    // Program alerts
    programs.forEach((program) => {
      if (program.performance.trend === "declining") {
        const client = clients.find((c) => c.client_id === program.client_id);
        result.push({
          title: program.program_name,
          description: `${client?.first_name || "Client"} - Declining performance: ${program.performance.accuracy_percent}% accuracy`,
          severity:
            program.performance.accuracy_percent < 50 ? "high" : "medium",
          onClick: () =>
            navigateTo("/programs", {
              programId: program.program_id,
              clientId: program.client_id,
              sourceView: "dashboard",
            }),
        });
      }
    });

    return result.slice(0, 5); // Show top 5 alerts
  }, [clients, programs, navigateTo]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    const sortedSessions = [...sessions]
      .sort(
        (a, b) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
      )
      .slice(0, 5);

    return sortedSessions.map((session) => {
      const client = clients.find((c) => c.client_id === session.client_id);
      const program = programs.find((p) => p.program_id === session.program_id);

      const correctTrials = session.trials.filter(
        (t) => t.response === "correct",
      ).length;
      const accuracy = Math.round(
        (correctTrials / session.trials.length) * 100,
      );

      const timeAgo = getTimeAgo(new Date(session.start_time));

      return {
        icon: <Activity className="h-4 w-4" />,
        title: `${program?.program_name || "Program"} session completed`,
        subtitle: `${client?.first_name || "Client"} - ${accuracy}% accuracy (${correctTrials}/${session.trials.length} correct)`,
        time: timeAgo,
      };
    });
  }, [sessions, clients, programs]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Dashboard
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Loading dashboard data...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-20 bg-stone-200 dark:bg-stone-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Dashboard
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Overview of your ABA practice and client progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Clients"
          value={metrics.activeClientsCount}
          subtitle={`${metrics.clientsNeedingAttentionCount} need attention`}
          icon={<Users className="h-5 w-5" />}
          alert={metrics.clientsNeedingAttentionCount > 0}
        />
        <StatCard
          title="Active Programs"
          value={metrics.activeProgramsCount}
          subtitle={`${metrics.masteredProgramsCount} mastered, ${metrics.improvingProgramsCount} improving`}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Sessions This Week"
          value={metrics.sessionsThisWeek}
          subtitle="Across all clients"
          icon={<Calendar className="h-5 w-5" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Average Accuracy"
          value={`${metrics.avgAccuracy}%`}
          subtitle="Across active programs"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 3, positive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Attention Needed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Needs Attention
              </CardTitle>
              {alerts.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                >
                  {alerts.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => <AlertItem key={index} {...alert} />)
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 mb-3">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  All systems go!
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  No clients or programs need immediate attention
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() =>
                navigateTo("/sessions", { sourceView: "dashboard" })
              }
            >
              <Play className="mr-2 h-4 w-4" />
              Start New Session
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() =>
                navigateTo("/programs", {
                  action: "create",
                  sourceView: "dashboard",
                })
              }
            >
              <Target className="mr-2 h-4 w-4" />
              Create Program
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() =>
                navigateTo("/clients", {
                  action: "add",
                  sourceView: "dashboard",
                })
              }
            >
              <Users className="mr-2 h-4 w-4" />
              Add Client
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() =>
                navigateTo("/reporting", { sourceView: "dashboard" })
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI-Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {metrics.totalAIStimuli}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Total stimuli generated
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {metrics.aiApprovalRate}%
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Approval rate
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-2">
                Top AI Recommendations
              </p>
              {clients.slice(0, 3).map((client) => {
                if (!client.ai_insights?.recommended_next_action) return null;
                return (
                  <div key={client.client_id} className="mb-3 last:mb-0">
                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {client.ai_insights.recommended_next_action}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-stone-200 dark:divide-stone-800">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  No recent activity
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
