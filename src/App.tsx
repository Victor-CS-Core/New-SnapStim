import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { DevTools } from "./components/DevTools";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NavigationProvider } from "./lib/NavigationContext";
import { NetworkProvider } from "./lib/NetworkContext";
import { LoginPage } from "./pages/LoginPage";
import { AccountsView } from "./sections/accounts";
import { ClientsView } from "./sections/clients";
import { DashboardView } from "./sections/dashboard";
import { ProgramsView } from "./sections/programs";
import { ReportingView } from "./sections/reporting";
import { ReviewView } from "./sections/review";
import { SessionsView } from "./sections/sessions";
import { AppShell } from "./shell/components";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // In development, allow without auth
  if (!user && import.meta.env.PROD) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <NavigationProvider initialPath={currentPath} onNavigate={navigate}>
      <AppShell currentPath={currentPath} onNavigate={navigate}>
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/accounts" element={<AccountsView />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/programs" element={<ProgramsView />} />
          <Route path="/review" element={<ReviewView />} />
          <Route path="/sessions" element={<SessionsView />} />
          <Route path="/reporting" element={<ReportingView />} />
        </Routes>
      </AppShell>

      {/* Dev Tools - Only in development */}
      {import.meta.env.DEV && <DevTools />}
    </NavigationProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NetworkProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </NetworkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
