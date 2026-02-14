import { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import sessionsData from "../../../../product-plan/sections/sessions/data.json";
import type { Session } from "../../../../product-plan/sections/sessions/types";

interface SessionHistoryProps {
  onViewRecap: (sessionId: string) => void;
  onBack: () => void;
}

export default function SessionHistory({
  onViewRecap,
  onBack,
}: SessionHistoryProps) {
  const [filterPeriod, setFilterPeriod] = useState("all");
  const sessions = sessionsData.sessions as unknown as Session[];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const calculateAccuracy = (session: Session) => {
    if (session.trials.length === 0) return 0;
    const correct = session.trials.filter((t) => t.response === "correct").length;
    return Math.round((correct / session.trials.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Session History
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            View past session data and trends
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Filter:
            </span>
            <div className="flex gap-2">
              {[
                { value: "all", label: "All Time" },
                { value: "7days", label: "Last 7 Days" },
                { value: "30days", label: "Last 30 Days" },
                { value: "90days", label: "Last 90 Days" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={filterPeriod === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterPeriod(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Total Sessions
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              {sessions.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Avg Accuracy
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {Math.round(
                sessions.reduce((acc, s) => acc + calculateAccuracy(s), 0) /
                  sessions.length
              )}
              %
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Total Trials
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              {sessions.reduce((acc, s) => acc + s.trials.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Avg Duration
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              {formatDuration(
                Math.round(
                  sessions.reduce((acc, s) => acc + s.duration_seconds, 0) /
                    sessions.length
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sessions</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Trials</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-stone-500 dark:text-stone-400">
                      No sessions found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => {
                  const accuracy = calculateAccuracy(session);
                  const correct = session.trials.filter(
                    (t) => t.response === "correct"
                  ).length;
                  const incorrect = session.trials.filter(
                    (t) => t.response === "incorrect"
                  ).length;
                  const noResponse = session.trials.filter(
                    (t) => t.response === "no_response"
                  ).length;

                  return (
                    <TableRow key={session.session_id}>
                      <TableCell>
                        {new Date(session.start_time).toLocaleDateString()}
                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          {new Date(session.start_time).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(session.duration_seconds)}</TableCell>
                      <TableCell>
                        {session.trials.length}
                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          {correct}C / {incorrect}I / {noResponse}N
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            accuracy >= 80
                              ? "text-emerald-600"
                              : accuracy >= 60
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {accuracy}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            session.status === "completed" ? "default" : "outline"
                          }
                        >
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            session.sync_status === "synced" ? "default" : "outline"
                          }
                        >
                          {session.sync_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewRecap(session.session_id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Data Visualization Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-stone-50 dark:bg-stone-900 rounded-lg flex items-center justify-center">
            <p className="text-stone-500 dark:text-stone-400">
              Chart: Accuracy over time (coming soon)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
