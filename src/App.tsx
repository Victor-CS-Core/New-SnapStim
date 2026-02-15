import { useState } from "react";
import { DevTools } from "./components/DevTools";
import type { NavigationContextData } from "./lib/NavigationContext";
import { NavigationProvider } from "./lib/NavigationContext";
import { AccountsView } from "./sections/accounts";
import { ClientsView } from "./sections/clients";
import { DashboardView } from "./sections/dashboard";
import { ProgramsView } from "./sections/programs";
import { ReportingView } from "./sections/reporting";
import { ReviewView } from "./sections/review";
import { SessionsView } from "./sections/sessions";
import { AppShell } from "./shell/components";

function App() {
  const [currentPath, setCurrentPath] = useState("/");

  const handleNavigate = (path: string, context?: NavigationContextData) => {
    setCurrentPath(path);
  };

  const renderView = () => {
    switch (currentPath) {
      case "/":
        return <DashboardView />;
      case "/accounts":
        return <AccountsView />;
      case "/clients":
        return <ClientsView />;
      case "/programs":
        return <ProgramsView />;
      case "/review":
        return <ReviewView />;
      case "/sessions":
        return <SessionsView />;
      case "/reporting":
        return <ReportingView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <NavigationProvider initialPath="/" onNavigate={handleNavigate}>
      <AppShell currentPath={currentPath} onNavigate={setCurrentPath}>
        {renderView()}
      </AppShell>

      {/* Dev Tools - Only in development */}
      {import.meta.env.DEV && <DevTools />}
    </NavigationProvider>
  );
}

export default App;
