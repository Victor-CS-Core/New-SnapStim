import { useSessions } from "@/hooks/useSessions";
import { useNavigation } from "@/lib/NavigationContext";
import { useState } from "react";
import type { Session } from "../../../product-plan/sections/sessions/types";
import SessionHistory from "./components/SessionHistory";
import SessionRecap from "./components/SessionRecap";
import SessionRunner from "./components/SessionRunner";
import SessionSelection from "./components/SessionSelection";

type ViewState = "selection" | "runner" | "recap" | "history";

export default function SessionsView() {
  const { contextData } = useNavigation();
  const [currentView, setCurrentView] = useState<ViewState>("selection");
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  // Use React Query hook for sessions
  const { data: historicalSessions, isLoading } = useSessions();

  const handleStartSession = (sessionData: Session) => {
    setActiveSession(sessionData);
    setCurrentView("runner");
  };

  const handleSessionComplete = (session: Session) => {
    setActiveSession(session);
    setCurrentView("recap");
  };

  const handleExit = () => {
    setActiveSession(null);
    setCurrentView("selection");
  };

  const handleViewHistory = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-stone-500 dark:text-stone-400">
            Loading sessions...
          </div>
        </div>
      );
    }

    setCurrentView("history");
  };

  const renderContent = () => {
    switch (currentView) {
      case "selection":
        return (
          <SessionSelection
            onStartSession={handleStartSession}
            onViewHistory={handleViewHistory}
            initialClientId={contextData.clientId}
            initialProgramId={contextData.programId}
          />
        );
      case "runner":
        return activeSession ? (
          <SessionRunner
            session={activeSession}
            onComplete={handleSessionComplete}
            onExit={handleExit}
          />
        ) : null;
      case "recap":
        return activeSession ? (
          <SessionRecap session={activeSession} onExit={handleExit} />
        ) : null;
      case "history":
        return (
          <SessionHistory
            onViewRecap={(sessionId: string) => {
              // Load session by ID from historical data
              const session = historicalSessions.find(
                (s) => s.session_id === sessionId,
              );
              if (session) {
                setActiveSession(session);
                setCurrentView("recap");
              } else {
                console.error(`Session ${sessionId} not found`);
              }
            }}
            onBack={() => setCurrentView("selection")}
          />
        );
      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
}
