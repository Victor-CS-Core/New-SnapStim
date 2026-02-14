import { useState, useEffect } from "react";
import { Pause, X, ZoomIn, MessageSquare, Check, XIcon, Circle, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Session, Trial, TrialResponse } from "../../../../product-plan/sections/sessions/types";

interface SessionRunnerProps {
  session: Session;
  onComplete: (session: Session) => void;
  onExit: () => void;
}

export default function SessionRunner({
  session,
  onComplete,
}: SessionRunnerProps) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mock trial data
  const mockStimuli = [
    { id: "stim-001", text: "Apple", image: "/stimuli/apple.jpg", instruction: "Touch the apple" },
    { id: "stim-002", text: "Banana", image: "/stimuli/banana.jpg", instruction: "Touch the banana" },
    { id: "stim-003", text: "Orange", image: "/stimuli/orange.jpg", instruction: "Touch the orange" },
    { id: "stim-004", text: "Grapes", image: "/stimuli/grapes.jpg", instruction: "Touch the grapes" },
    { id: "stim-005", text: "Strawberry", image: "/stimuli/strawberry.jpg", instruction: "Touch the strawberry" },
  ];

  const currentStimulus = mockStimuli[currentTrialIndex] || mockStimuli[0];
  const progress = ((currentTrialIndex) / mockStimuli.length) * 100;

  // Timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleResponse = (response: TrialResponse) => {
    const trial: Trial = {
      trial_id: `trial-${Date.now()}`,
      session_id: session.session_id,
      trial_number: currentTrialIndex + 1,
      stimulus_id: currentStimulus.id,
      stimulus_text: currentStimulus.text,
      stimulus_image_url: currentStimulus.image,
      teaching_instruction: currentStimulus.instruction,
      response,
      timestamp: new Date().toISOString(),
      response_time_ms: 2000,
      rerun_triggered: false,
      notes: "",
    };

    setTrials([...trials, trial]);

    // Move to next trial or complete
    if (currentTrialIndex < mockStimuli.length - 1) {
      setCurrentTrialIndex(currentTrialIndex + 1);
    } else {
      // Session complete
      const completedSession: Session = {
        ...session,
        trials: [...trials, trial],
        end_time: new Date().toISOString(),
        duration_seconds: duration,
        status: "completed",
      };
      onComplete(completedSession);
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

  const accuracy = trials.length > 0 
    ? Math.round((stats.correct / trials.length) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Client</p>
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  {session.client_id}
                </p>
              </div>
              <div className="h-8 w-px bg-stone-200 dark:bg-stone-700" />
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Program</p>
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  {session.program_id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-stone-500 dark:text-stone-400">Duration</p>
                <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {formatTime(duration)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                <Pause className="h-4 w-4" />
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
                Trial {currentTrialIndex + 1} of {mockStimuli.length}
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
                  {currentStimulus.instruction}
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* Stimulus Display */}
          <Card className="mb-4">
            <CardContent className="p-8">
              <div className="flex items-center justify-center min-h-[300px] bg-stone-50 dark:bg-stone-900 rounded-lg relative">
                <div className="text-center">
                  <div className="text-6xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                    {currentStimulus.text}
                  </div>
                  <Button variant="ghost" size="sm">
                    <ZoomIn className="h-4 w-4 mr-2" />
                    Zoom Image
                  </Button>
                </div>
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
                >
                  <div className="text-center">
                    <Disc className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">Prompted</div>
                    <div className="text-xs opacity-80">(P)</div>
                  </div>
                </Button>
              </div>
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
                  <span className="text-stone-600 dark:text-stone-400">Correct</span>
                  <span className="font-bold text-emerald-600">{stats.correct}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Incorrect</span>
                  <span className="font-bold text-red-600">{stats.incorrect}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">No Response</span>
                  <span className="font-bold text-stone-600">{stats.noResponse}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Prompted</span>
                  <span className="font-bold text-amber-600">{stats.prompted}</span>
                </div>
                <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      Accuracy
                    </span>
                    <span className="font-bold text-emerald-600">{accuracy}%</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
