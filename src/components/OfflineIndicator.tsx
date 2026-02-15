/**
 * Offline Indicator Component
 * 
 * Shows network status, pending sync items, and manual sync button
 */

import { useNetwork } from "@/lib/NetworkContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  CloudOff,
  Cloud
} from "lucide-react";
import { useState } from "react";

export function OfflineIndicator() {
  const { 
    isOnline, 
    isSyncing, 
    pendingSyncCount, 
    lastSyncTime, 
    syncError,
    triggerSync 
  } = useNetwork();
  
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show anything if online and no pending items
  if (isOnline && pendingSyncCount === 0 && !syncError) {
    return null;
  }

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return "Never";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        // Compact badge
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-white dark:bg-stone-800 border-2 transition-all hover:scale-105"
          style={{
            borderColor: isOnline 
              ? (pendingSyncCount > 0 ? '#f59e0b' : '#10b981')
              : '#ef4444'
          }}
        >
          {isOnline ? (
            pendingSyncCount > 0 ? (
              <CloudOff className="h-4 w-4 text-amber-600" />
            ) : (
              <Cloud className="h-4 w-4 text-emerald-600" />
            )
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          
          {pendingSyncCount > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {pendingSyncCount}
            </Badge>
          )}
          
          {isSyncing && (
            <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
          )}
        </button>
      ) : (
        // Expanded card
        <Card className="w-80 shadow-2xl border-2" style={{
          borderColor: isOnline 
            ? (pendingSyncCount > 0 ? '#f59e0b' : '#10b981')
            : '#ef4444'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-emerald-600" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </Button>
            </div>

            {/* Sync Status */}
            <div className="space-y-2 text-sm">
              {isSyncing && (
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Syncing data...</span>
                </div>
              )}

              {pendingSyncCount > 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{pendingSyncCount} item(s) pending sync</span>
                </div>
              )}

              {syncError && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">{syncError}</span>
                </div>
              )}

              {isOnline && pendingSyncCount === 0 && !isSyncing && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>All data synced</span>
                </div>
              )}

              <div className="text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-700">
                Last sync: {formatLastSync(lastSyncTime)}
              </div>
            </div>

            {/* Manual Sync Button */}
            {isOnline && pendingSyncCount > 0 && !isSyncing && (
              <Button
                size="sm"
                className="w-full mt-3"
                onClick={triggerSync}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
            )}

            {!isOnline && (
              <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950 rounded text-xs text-amber-800 dark:text-amber-200">
                Working offline. Data will sync when connection is restored.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
