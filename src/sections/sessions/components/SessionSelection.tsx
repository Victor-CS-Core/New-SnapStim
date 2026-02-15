import { useState } from "react";
import { Play, Clock, TrendingUp, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import clientsData from "../../../../product-plan/sections/clients/data.json";
import programsData from "../../../../product-plan/sections/programs/data.json";
import sessionsData from "../../../../product-plan/sections/sessions/data.json";
import type { Client } from "../../../../product-plan/sections/clients/types";
import type { Program } from "../../../../product-plan/sections/programs/types";
import type { Session } from "../../../../product-plan/sections/sessions/types";

const clients = clientsData.clients as Client[];
const programs = programsData.programs as Program[];
const sessions = sessionsData.sessions as Session[];

interface SessionSelectionProps {
  onStartSession: (session: Session) => void;
  onViewHistory: () => void;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export default function SessionSelection({
  onStartSession,
  onViewHistory,
}: SessionSelectionProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  const recentSessions = sessions.slice(0, 5);

  // Filter clients by search
  const filteredClients = clients.filter((client) => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  // Get programs for selected client
  const clientPrograms = selectedClientId
    ? programs.filter((p) => p.client_id === selectedClientId)
    : [];

  const selectedClient = selectedClientId
    ? clients.find((c) => c.client_id === selectedClientId)
    : null;

  const handleStartMockSession = (programId: string) => {
    // Create a mock session for demo
    const mockSession: Session = {
      session_id: `sess-${Date.now()}`,
      client_id: selectedClientId || "cli_1",
      program_id: programId,
      therapist_id: "usr_1",
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Client List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Select Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  aria-label="Search clients"
                />
              </div>

              {/* Client List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-8 w-8 text-stone-400 mb-2" />
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      No clients found
                    </p>
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client.client_id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedClientId === client.client_id
                          ? "bg-primary/5 border-primary"
                          : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                      }`}
                      onClick={() => setSelectedClientId(client.client_id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={client.avatar_url}
                            alt={`${client.first_name} ${client.last_name}`}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(client.first_name, client.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-stone-900 dark:text-stone-100 truncate text-sm">
                              {client.first_name} {client.last_name}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400">
                            {client.aggregates.active_program_count} programs
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Programs */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedClient.avatar_url}
                      alt={`${selectedClient.first_name} ${selectedClient.last_name}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedClient.first_name, selectedClient.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      {selectedClient.first_name} {selectedClient.last_name}
                    </CardTitle>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      Select a program to start
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {clientPrograms.length === 0 ? (
                  <div className="text-center py-8">
                    <Play className="h-8 w-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      No active programs for this client
                    </p>
                  </div>
                ) : (
                  clientPrograms.map((program) => (
                    <div
                      key={program.program_id}
                      className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                              {program.program_name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {program.program_type.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            {program.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStartMockSession(program.program_id)
                          }
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs">
                            Last:{" "}
                            {program.last_run_date
                              ? new Date(
                                  program.last_run_date
                                ).toLocaleDateString()
                              : "Never"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">
                            {program.performance.accuracy_percent}% accuracy
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            program.status === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : program.status === "mastered"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                                : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                          }`}
                        >
                          {program.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center">
                <Users className="h-12 w-12 text-stone-400 mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Select a Client
                </h3>
                <p className="text-stone-500 dark:text-stone-400 mt-1">
                  Choose a client from the list to view their programs
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar - Recent Sessions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSessions.length === 0 ? (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                  No recent sessions
                </p>
              ) : (
                recentSessions.map((session) => {
                  const sessionClient = clients.find(
                    (c) => c.client_id === session.client_id
                  );
                  const sessionProgram = programs.find(
                    (p) => p.program_id === session.program_id
                  );
                  return (
                    <div
                      key={session.session_id}
                      className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors"
                      onClick={onViewHistory}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {sessionClient && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={sessionClient.avatar_url}
                              alt={`${sessionClient.first_name} ${sessionClient.last_name}`}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(
                                sessionClient.first_name,
                                sessionClient.last_name
                              )}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                            {sessionClient
                              ? `${sessionClient.first_name} ${sessionClient.last_name}`
                              : "Unknown Client"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mb-1 truncate">
                        {sessionProgram?.program_name || "Unknown Program"}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {new Date(session.start_time).toLocaleDateString()}
                        </p>
                        <Badge
                          variant={
                            session.status === "completed" ? "default" : "outline"
                          }
                          className="text-xs"
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
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
