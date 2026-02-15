import { useState } from "react";
import { useNavigation } from "@/lib/NavigationContext";
import SessionSelection from "./components/SessionSelection";
import SessionRunner from "./components/SessionRunner";
import SessionRecap from "./components/SessionRecap";
import SessionHistory from "./components/SessionHistory";
import sessionsData from "../../../product-plan/sections/sessions/data.json";
import type { Session } from "../../../product-plan/sections/sessions/types";

const historicalSessions = sessionsData.sessions as Session[];

type ViewState = "selection" | "runner" | "recap" | "history";

export default function SessionsView() {
  const { contextData } = useNavigation();
  const [currentView, setCurrentView] = useState<ViewState>("selection");
  const [activeSession, setActiveSession] = useState<Session | null>(null);

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
                (s) => s.session_id === sessionId
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
