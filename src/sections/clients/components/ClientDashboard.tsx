import {
  Play,
  Plus,
  FileText,
  Edit,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ProgramCard from "./ProgramCard";
import AlertItem from "./AlertItem";
import type {
  Client,
  Program,
  Alert,
} from "../../../../product-plan/sections/clients/types";

interface ClientDashboardProps {
  client: Client;
  programs: Program[];
  alerts: Alert[];
  onStartSession?: (programId: string) => void;
  onAddProgram?: () => void;
  onViewReports?: () => void;
  onEditProfile?: () => void;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export default function ClientDashboard({
  client,
  programs,
  alerts,
  onStartSession,
  onAddProgram,
  onViewReports,
  onEditProfile,
}: ClientDashboardProps) {
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const activePrograms = programs.filter((p) => p.status === "active");
  const criticalAlerts = unresolvedAlerts.filter(
    (a) => a.severity === "critical",
  );

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={client.avatar_url}
                alt={`${client.first_name} ${client.last_name}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(client.first_name, client.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {client.first_name} {client.last_name}
                </h2>
                <Badge
                  variant="secondary"
                  className={
                    client.status === "active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                  }
                >
                  {client.status}
                </Badge>
              </div>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                {client.age} years old • Started{" "}
                {new Date(client.start_date).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {client.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={onEditProfile}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={onViewReports}>
                <FileText className="h-4 w-4 mr-1" />
                Reports
              </Button>
              <Button size="sm" onClick={onAddProgram}>
                <Plus className="h-4 w-4 mr-1" />
                Add Program
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                Sessions This Week
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {client.aggregates.sessions_this_week}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                Avg. Accuracy
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`text-3xl font-bold ${
                client.aggregates.average_accuracy >= 80
                  ? "text-emerald-600 dark:text-emerald-400"
                  : client.aggregates.average_accuracy >= 60
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {client.aggregates.average_accuracy}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                Active Programs
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {client.aggregates.active_program_count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                Mastery Rate
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`text-3xl font-bold ${
                client.aggregates.overall_mastery_rate >= 70
                  ? "text-emerald-600 dark:text-emerald-400"
                  : client.aggregates.overall_mastery_rate >= 50
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {client.aggregates.overall_mastery_rate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {client.ai_insights && (
        <Card
          className={`border-l-4 ${
            client.ai_insights.intervention_suggested
              ? "border-l-amber-500"
              : "border-l-primary"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb
                className={`h-4 w-4 ${
                  client.ai_insights.intervention_suggested
                    ? "text-amber-600"
                    : "text-primary"
                }`}
              />
              <CardTitle className="text-sm">AI Recommendation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-stone-700 dark:text-stone-300 font-medium">
              {client.ai_insights.recommended_next_action}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {client.ai_insights.explanation_text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {unresolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Alerts
                {criticalAlerts.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {criticalAlerts.length} critical
                  </Badge>
                )}
              </CardTitle>
              <span className="text-sm text-stone-500 dark:text-stone-400">
                {unresolvedAlerts.length} unresolved
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {unresolvedAlerts.map((alert) => (
              <AlertItem key={alert.alert_id} alert={alert} />
            ))}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Programs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Active Programs ({activePrograms.length})
          </h3>
          {activePrograms.length > 0 && (
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-1" />
              Quick Session
            </Button>
          )}
        </div>
        {programs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center">
              <Target className="h-10 w-10 text-stone-400 mb-3" />
              <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                No programs yet
              </h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Add a program to get started with this client.
              </p>
              <Button className="mt-4" onClick={onAddProgram}>
                <Plus className="h-4 w-4 mr-1" />
                Add Program
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((program) => (
              <ProgramCard
                key={program.program_id}
                program={program}
                onStartSession={onStartSession}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
