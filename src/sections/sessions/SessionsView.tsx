import { useState } from "react";
import SessionSelection from "./components/SessionSelection";
import SessionRunner from "./components/SessionRunner";
import SessionRecap from "./components/SessionRecap";
import SessionHistory from "./components/SessionHistory";
import type { Session } from "../../../product-plan/sections/sessions/types";

type ViewState = "selection" | "runner" | "recap" | "history";

export default function SessionsView() {
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
            onViewRecap={(_sessionId: string) => {
              // In a real app, load session by ID
              setCurrentView("recap");
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
