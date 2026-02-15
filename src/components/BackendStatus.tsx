import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";

export default function BackendStatus() {
  const {
    data: health,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => api.health(),
    refetchInterval: 10000, // Check every 10 seconds
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <Wifi className="h-3 w-3 animate-pulse" />
        <span>Checking backend...</span>
      </div>
    );
  }

  if (isError || !health?.ok) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
        <WifiOff className="h-3 w-3" />
        <span>Backend offline - Using mock data</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
      <CheckCircle className="h-3 w-3" />
      <span>Backend connected</span>
    </div>
  );
}

interface BackendStatusBannerProps {
  feature?: string;
}

export function BackendStatusBanner({
  feature = "AI generation",
}: BackendStatusBannerProps) {
  const { data: health, isError } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => api.health(),
    refetchInterval: 10000,
    retry: 1,
  });

  if (isError || !health?.ok) {
    return (
      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
              Backend Server Required
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              {feature} requires the backend server to be running at{" "}
              <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded text-xs">
                localhost:8787
              </code>
            </p>
            <p className="text-amber-700 dark:text-amber-300 mt-1">
              Please start the server:{" "}
              <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded text-xs">
                cd Tyler-Project/SnapStim/server && npm run dev
              </code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
