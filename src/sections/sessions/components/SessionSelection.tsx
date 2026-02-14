import { useState } from "react";
import { Play, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import sessionsData from "../../../../product-plan/sections/sessions/data.json";
import type { Session } from "../../../../product-plan/sections/sessions/types";

interface SessionSelectionProps {
  onStartSession: (session: Session) => void;
  onViewHistory: () => void;
}

export default function SessionSelection({
  onStartSession,
  onViewHistory,
}: SessionSelectionProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  const sessions = sessionsData.sessions as unknown as Session[];
  const recentSessions = sessions.slice(0, 5);

  // Mock client data
  const mockClients = [
    { id: "client-001", name: "Emma Wilson", programs: 3 },
    { id: "client-002", name: "Liam Chen", programs: 2 },
    { id: "client-003", name: "Sophia Martinez", programs: 4 },
  ];

  // Mock programs for selected client
  const mockPrograms = [
    {
      program_id: "prog-001",
      name: "Receptive Labeling - Fruits",
      type: "receptive_labeling",
      targets: 12,
      lastSession: "2025-01-15",
      performance: "87%",
      status: "active",
    },
    {
      program_id: "prog-002",
      name: "Expressive Communication - Actions",
      type: "expressive",
      targets: 8,
      lastSession: "2025-01-14",
      performance: "72%",
      status: "active",
    },
  ];

  const handleStartMockSession = (programId: string) => {
    // Create a mock session for demo
    const mockSession: Session = {
      session_id: `sess-${Date.now()}`,
      client_id: selectedClient || "client-001",
      program_id: programId,
      therapist_id: "user-001",
      start_time: new Date().toISOString(),
      end_time: null,
      duration_seconds: 0,
      status: "in_progress",
      session_type: "teaching",
      trials: [],
      notes: "",
      mastery_status: {
        current_streak: 0,
        mastery_met: false,
        mastery_date: null,
      },
      offline_session: false,
      sync_status: "pending",
      sync_timestamp: null,
    };
    onStartSession(mockSession);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Start Session
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Choose a client and program to begin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockClients.map((client) => (
                <div
                  key={client.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedClient === client.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600"
                  }`}
                  onClick={() => setSelectedClient(client.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                        {client.name}
                      </h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {client.programs} active programs
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Program Selection */}
          {selectedClient && (
            <Card>
              <CardHeader>
                <CardTitle>Select Program</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPrograms.map((program) => (
                  <div
                    key={program.program_id}
                    className="p-4 rounded-lg border border-stone-200 dark:border-stone-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                            {program.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {program.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          {program.targets} targets
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartMockSession(program.program_id)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Last: {program.lastSession}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {program.performance}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Recent Sessions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSessions.length === 0 ? (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                  No recent sessions
                </p>
              ) : (
                recentSessions.map((session) => (
                  <div
                    key={session.session_id}
                    className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors"
                    onClick={onViewHistory}
                  >
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-1">
                      Session {session.session_id.slice(-3)}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {new Date(session.start_time).toLocaleDateString()}
                    </p>
                    <Badge
                      variant={session.status === "completed" ? "default" : "outline"}
                      className="text-xs mt-2"
                    >
                      {session.status}
                    </Badge>
                  </div>
                ))
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={onViewHistory}
              >
                View All History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
