import { useState } from "react";
import { AppShell } from "./shell/components";
import { AccountsView } from "./sections/accounts";
import { ClientsView } from "./sections/clients";
import { ProgramsView } from "./sections/programs";
import { ReviewView } from "./sections/review";

function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Welcome to SnapStim
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          ABA skill-acquisition tool for BCBAs, RBTs, and Caregivers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Overview of key metrics and recent activity
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Programs
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Browse, create, and manage programs with AI-powered stimulus
            generation
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Sessions
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Run sessions with standardized trial flow and data capture
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Reports
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Data visualization and clinical reporting with automatic recap
            generation
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Settings
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Account settings and preferences
          </p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        {title}
      </h1>
      <p className="mt-2 text-stone-500">This section is coming soon.</p>
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState("/accounts");

  const renderView = () => {
    switch (currentPath) {
      case "/accounts":
        return <AccountsView />;
      case "/clients":
        return <ClientsView />;
      case "/programs":
        return <ProgramsView />;
      case "/review":
        return <ReviewView />;
      case "/sessions":
        return <PlaceholderView title="Sessions" />;
      case "/reporting":
        return <PlaceholderView title="Reporting" />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppShell currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderView()}
    </AppShell>
  );
}

export default App;
