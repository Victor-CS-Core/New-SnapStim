import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePrograms } from "@/hooks/usePrograms";
import { useCreateSession, useUpdateSession } from "@/hooks/useSessions";
import { useStimuli } from "@/hooks/useStimuli";
import {
  Check,
  Circle,
  Disc,
  MessageSquare,
  Pause,
  Play,
  Undo2,
  X,
  XIcon,
  ZoomIn,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ReviewQueueItem } from "../../../../product-plan/sections/review/types";
import type {
  Session,
  Trial,
  TrialResponse,
} from "../../../../product-plan/sections/sessions/types";

interface SessionRunnerProps {
  session: Session;
  onComplete: (session: Session) => void;
  onExit: () => void;
}

export default function SessionRunner({
  session,
  onComplete,
  onExit,
}: SessionRunnerProps) {
  // Load program details to get rerun policy
  const { data: programs } = usePrograms(session.client_id);
  const program = programs?.find((p) => p.program_id === session.program_id);

  // Load approved stimuli for this program
  const { data: approvedStimuli, isLoading: stimuliLoading } = useStimuli(
    session.program_id,
    "approved",
  );

  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [trials, setTrials] = useState<Trial[]>(session.trials || []);
  const [stimulusQueue, setStimulusQueue] = useState<ReviewQueueItem[]>([]);
  const [duration, setDuration] = useState(session.duration_seconds || 0);
  const [isPaused, setIsPaused] = useState(false);
  const [rerunMessage, setRerunMessage] = useState<string | null>(null);

  // Initialize stimulus queue from approved stimuli
  useEffect(() => {
    if (
      approvedStimuli &&
      approvedStimuli.length > 0 &&
      stimulusQueue.length === 0
    ) {
      // Shuffle and take a subset based on program trial count or default to all
      const trialCount =
        program?.rerun_policy?.trial_count || approvedStimuli.length;
      const shuffled = [...approvedStimuli].sort(() => Math.random() - 0.5);
      setStimulusQueue(
        shuffled.slice(0, Math.min(trialCount, shuffled.length)),
      );
    }
  }, [approvedStimuli, stimulusQueue.length, program]);

  const currentStimulus = stimulusQueue[currentTrialIndex];
  const progress =
    stimulusQueue.length > 0 ? (trials.length / stimulusQueue.length) * 100 : 0;

  // Timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Keyboard shortcuts
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (isPaused) return;

      switch (e.key.toLowerCase()) {
        case "c":
          handleResponse("correct");
          break;
        case "i":
          handleResponse("incorrect");
          break;
        case "n":
          handleResponse("no_response");
          break;
        case "p":
          handleResponse("prompted");
          break;
        case "u":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleUndo();
          }
          break;
        case "escape":
          setIsPaused((prev) => !prev);
          break;
      }
    },
    [isPaused, currentTrialIndex, trials],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Apply rerun policy when needed
  const applyRerunPolicy = (
    response: TrialResponse,
    stimulus: ReviewQueueItem,
  ) => {
    if (!program?.rerun_policy) return;

    const { error_correction, immediate_rerun_on_error } = program.rerun_policy;

    if (
      error_correction &&
      immediate_rerun_on_error &&
      response === "incorrect"
    ) {
      // Add stimulus back to queue immediately after current position
      const newQueue = [...stimulusQueue];
      newQueue.splice(currentTrialIndex + 2, 0, stimulus);
      setStimulusQueue(newQueue);
      setRerunMessage(
        "This stimulus will be presented again due to error correction",
      );
      setTimeout(() => setRerunMessage(null), 3000);
      return true;
    }

    return false;
  };

  const handleResponse = (response: TrialResponse) => {
    if (!currentStimulus) return;

    const trial: Trial = {
      trial_id: `trial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      session_id: session.session_id,
      trial_number: trials.length + 1,
      stimulus_id: currentStimulus.stimulus_id,
      stimulus_text: currentStimulus.name || currentStimulus.stimulus_id,
      stimulus_image_url: currentStimulus.image_url || "",
      teaching_instruction:
        program?.teaching_instructions || "Present and prompt as needed",
      response,
      timestamp: new Date().toISOString(),
      response_time_ms: 2000, // TODO: Implement actual response time tracking
      rerun_triggered: false,
      notes: "",
    };

    const rerunTriggered = applyRerunPolicy(response, currentStimulus);
    trial.rerun_triggered = rerunTriggered;

    const newTrials = [...trials, trial];
    setTrials(newTrials);

    // Auto-save session data
    const updatedSession: Session = {
      ...session,
      trials: newTrials,
      duration_seconds: duration,
      last_modified_date: new Date().toISOString(),
    };

    // Save to backend (fire and forget for performance)
    updateSession.mutate(updatedSession);

    // Move to next trial or complete
    if (currentTrialIndex < stimulusQueue.length - 1) {
      setCurrentTrialIndex(currentTrialIndex + 1);
    } else {
      // Session complete
      const completedSession: Session = {
        ...updatedSession,
        end_time: new Date().toISOString(),
        status: "completed",
      };
      updateSession.mutate(completedSession);
      onComplete(completedSession);
    }
  };

  const handleUndo = () => {
    if (trials.length === 0) return;

    if (confirm("Undo the last trial?")) {
      setTrials(trials.slice(0, -1));
      if (currentTrialIndex > 0) {
        setCurrentTrialIndex(currentTrialIndex - 1);
      }
      setRerunMessage("Last trial removed");
      setTimeout(() => setRerunMessage(null), 2000);
    }
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session early?")) {
      const completedSession: Session = {
        ...session,
        trials,
        end_time: new Date().toISOString(),
        duration_seconds: duration,
        status: "abandoned",
      };
      updateSession.mutate(completedSession);
      onComplete(completedSession);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const stats = {
    correct: trials.filter((t) => t.response === "correct").length,
    incorrect: trials.filter((t) => t.response === "incorrect").length,
    noResponse: trials.filter((t) => t.response === "no_response").length,
    prompted: trials.filter((t) => t.response === "prompted").length,
  };

  const completedTrials = stats.correct + stats.incorrect;
  const accuracy =
    completedTrials > 0
      ? Math.round((stats.correct / completedTrials) * 100)
      : 0;

  // Loading state
  if (stimuliLoading || !currentStimulus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-stone-500 dark:text-stone-400 mb-2">
            {stimuliLoading
              ? "Loading stimuli..."
              : "No approved stimuli found for this program"}
          </div>
          {!stimuliLoading && !currentStimulus && (
            <Button variant="outline" onClick={onExit}>
              Return to Selection
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rerun Policy Message */}
      {rerunMessage && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <CardContent className="p-3">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              {rerunMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Paused Overlay */}
      {isPaused && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-blue-800 dark:text-blue-200 font-semibold">
                Session Paused
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsPaused(false)}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Client
                </p>
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  {session.client_id}
                </p>
              </div>
              <div className="h-8 w-px bg-stone-200 dark:bg-stone-700" />
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Program
                </p>
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  {program?.program_name || session.program_id}
                </p>
                {program && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {program.program_type.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Duration
                </p>
                <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {formatTime(duration)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                title="Pause (Esc)"
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={trials.length === 0}
                title="Undo Last Trial (Ctrl+U)"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleEndSession}>
                <X className="h-4 w-4" />
                End
              </Button>
            </div>
          </div>
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-stone-600 dark:text-stone-400">
                Trial {trials.length + 1} of {stimulusQueue.length}
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Trial Instructions */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge variant="outline" className="mb-4">
                  Teaching Instruction
                </Badge>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {program?.teaching_instructions ||
                    "Present and prompt as needed"}
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* Stimulus Display */}
          <Card className="mb-4">
            <CardContent className="p-8">
              <div className="flex items-center justify-center min-h-[300px] bg-stone-50 dark:bg-stone-900 rounded-lg relative">
                {currentStimulus.image_url ? (
                  <div className="text-center">
                    <img
                      src={currentStimulus.image_url}
                      alt={currentStimulus.name || "Stimulus"}
                      className="max-w-full max-h-[400px] object-contain mx-auto mb-4 rounded-lg"
                      onError={(e) => {
                        // Fallback to text display if image fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {currentStimulus.name && (
                      <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                        {currentStimulus.name}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="mt-4">
                      <ZoomIn className="h-4 w-4 mr-2" />
                      Zoom Image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                      {currentStimulus.name || currentStimulus.stimulus_id}
                    </div>
                    {currentStimulus.description && (
                      <p className="text-stone-600 dark:text-stone-400 max-w-md">
                        {currentStimulus.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Response Recording */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-4">
                <Button
                  size="lg"
                  className="h-20 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleResponse("correct")}
                  disabled={isPaused}
                >
                  <div className="text-center">
                    <Check className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">Correct</div>
                    <div className="text-xs opacity-80">(C)</div>
                  </div>
                </Button>
                <Button
                  size="lg"
                  className="h-20 bg-red-600 hover:bg-red-700"
                  onClick={() => handleResponse("incorrect")}
                  disabled={isPaused}
                >
                  <div className="text-center">
                    <XIcon className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">Incorrect</div>
                    <div className="text-xs opacity-80">(I)</div>
                  </div>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-20"
                  onClick={() => handleResponse("no_response")}
                  disabled={isPaused}
                >
                  <div className="text-center">
                    <Circle className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">No Response</div>
                    <div className="text-xs opacity-80">(N)</div>
                  </div>
                </Button>
                <Button
                  size="lg"
                  className="h-20 bg-amber-600 hover:bg-amber-700"
                  onClick={() => handleResponse("prompted")}
                  disabled={isPaused}
                >
                  <div className="text-center">
                    <Disc className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">Prompted</div>
                    <div className="text-xs opacity-80">(P)</div>
                  </div>
                </Button>
              </div>
              {program?.rerun_policy?.error_correction && (
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="text-xs">
                    Error correction enabled - incorrect responses will rerun
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Session Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">
                    Correct
                  </span>
                  <span className="font-bold text-emerald-600">
                    {stats.correct}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">
                    Incorrect
                  </span>
                  <span className="font-bold text-red-600">
                    {stats.incorrect}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">
                    No Response
                  </span>
                  <span className="font-bold text-stone-600 dark:text-stone-400">
                    {stats.noResponse}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">
                    Prompted
                  </span>
                  <span className="font-bold text-amber-600">
                    {stats.prompted}
                  </span>
                </div>
                <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      Accuracy
                    </span>
                    <span className="font-bold text-emerald-600">
                      {accuracy}%
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Based on correct/incorrect only
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Keyboard Shortcuts
              </h4>
              <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Correct</span>
                  <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded">
                    C
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Incorrect</span>
                  <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded">
                    I
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>No Response</span>
                  <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded">
                    N
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Prompted</span>
                  <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded">
                    P
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Pause/Resume</span>
                  <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded">
                    Esc
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Undo</span>
                  <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded">
                    Ctrl+U
                  </kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
