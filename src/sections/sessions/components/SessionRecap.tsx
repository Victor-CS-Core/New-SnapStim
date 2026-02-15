import { useState, useMemo } from "react";
import { ArrowLeft, Download, Play, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigation } from "@/lib/NavigationContext";
import type { Session } from "../../../../product-plan/sections/sessions/types";
import clientsData from "../../../../product-plan/sections/clients/data.json";
import programsData from "../../../../product-plan/sections/programs/data.json";

interface SessionRecapProps {
  session: Session;
  onExit: () => void;
  onSave?: (session: Session) => void;
}

export default function SessionRecap({
  session,
  onExit,
  onSave,
}: SessionRecapProps) {
  const { navigateTo } = useNavigation();
  const [notes, setNotes] = useState(session.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  // Resolve client and program names
  const client = useMemo(
    () =>
      clientsData.clients.find((c: any) => c.client_id === session.client_id),
    [session.client_id],
  );

  const program = useMemo(
    () =>
      programsData.programs.find(
        (p: any) => p.program_id === session.program_id,
      ),
    [session.program_id],
  );

  const stats = {
    correct: session.trials.filter((t) => t.response === "correct").length,
    incorrect: session.trials.filter((t) => t.response === "incorrect").length,
    noResponse: session.trials.filter((t) => t.response === "no_response")
      .length,
    prompted: session.trials.filter((t) => t.response === "prompted").length,
  };

  const accuracy =
    session.trials.length > 0
      ? Math.round((stats.correct / session.trials.length) * 100)
      : 0;

  const duration = session.duration_seconds || 0;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Session Recap
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Review session performance and add notes
          </p>
        </div>
        <Button variant="outline" onClick={onExit}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Client
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {client
                      ? `${client.first_name} ${client.last_name}`
                      : session.client_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Program
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {program?.program_name || session.program_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Date
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {new Date(session.start_time).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Duration
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {formatTime(duration)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Status
                  </p>
                  <Badge
                    variant={
                      session.status === "completed" ? "default" : "outline"
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Type
                  </p>
                  <Badge variant="outline">{session.session_type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-600">
                      {stats.correct}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      Correct
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                      {stats.incorrect}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      Incorrect
                    </div>
                  </div>
                  <div className="text-center p-4 bg-stone-50 dark:bg-stone-900 rounded-lg">
                    <div className="text-3xl font-bold text-stone-600 dark:text-stone-400">
                      {stats.noResponse}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      No Response
                    </div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-amber-600">
                      {stats.prompted}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      Prompted
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Overall Accuracy
                    </span>
                    <span className="text-3xl font-bold text-emerald-600">
                      {accuracy}%
                    </span>
                  </div>
                  <div className="mt-2 h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[150px] p-3 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Add observations, learner motivation, environmental factors, or recommendations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                aria-label="Session notes"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mastery Status */}
          {session.mastery_status && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mastery Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {session.mastery_status.mastery_met ? (
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      ✓ Mastered
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Congratulations!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                      Current Streak
                    </p>
                    <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                      {session.mastery_status.current_streak}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      consecutive correct needed for mastery
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  setIsSaving(true);
                  // Update session notes
                  const updatedSession = { ...session, notes };
                  // Call parent save handler if provided
                  if (onSave) {
                    onSave(updatedSession);
                  }
                  // Save to localStorage for persistence
                  const savedSessions = JSON.parse(
                    localStorage.getItem("sessions") || "[]",
                  );
                  const existingIndex = savedSessions.findIndex(
                    (s: Session) => s.session_id === session.session_id,
                  );
                  if (existingIndex >= 0) {
                    savedSessions[existingIndex] = updatedSession;
                  } else {
                    savedSessions.push(updatedSession);
                  }
                  localStorage.setItem(
                    "sessions",
                    JSON.stringify(savedSessions),
                  );

                  setTimeout(() => {
                    setIsSaving(false);
                    onExit();
                  }, 500);
                }}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save & Exit"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigateTo("/reporting", {
                    clientId: session.client_id,
                    programId: session.program_id,
                    sessionId: session.session_id,
                    sourceView: "sessions",
                    tab: "analytics",
                  });
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Full Report
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Print Recap
              </Button>
              <Button variant="outline" className="w-full" onClick={onExit}>
                <Play className="mr-2 h-4 w-4" />
                Start Another Session
              </Button>
            </CardContent>
          </Card>

          {/* Auto-save Indicator */}
          <div className="text-xs text-stone-500 dark:text-stone-400 text-center">
            Last saved: just now
          </div>
        </div>
      </div>
    </div>
  );
}
