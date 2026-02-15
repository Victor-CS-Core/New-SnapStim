/**
 * Network Status Context
 * 
 * Provides online/offline status detection and sync management
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getPendingSyncItems, markSynced, markSyncFailed, type SyncQueueItem } from './db';
import api from './api';
import { useAuth } from '@/contexts/AuthContext';

interface NetworkStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  lastSyncTime: number | null;
  syncError: string | null;
}

interface NetworkContextType extends NetworkStatus {
  triggerSync: () => Promise<void>;
  refreshPendingCount: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid || 'device';

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Update pending sync count
  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await getPendingSyncItems(userId);
      setPendingSyncCount(items.length);
    } catch (error) {
      console.error('Failed to get pending sync count:', error);
    }
  }, [userId]);

  // Sync a single item to backend
  const syncItem = async (item: SyncQueueItem): Promise<boolean> => {
    try {
      switch (item.entity) {
        case 'client':
          if (item.operation === 'create' || item.operation === 'update') {
            await api.saveClient(item.userId, item.data);
          } else if (item.operation === 'delete') {
            await api.deleteClient(item.userId, item.entityId);
          }
          break;

        case 'program':
          if (item.operation === 'create') {
            await api.saveProgram(item.userId, item.data);
          } else if (item.operation === 'update') {
            await api.updateProgram(item.userId, item.data);
          } else if (item.operation === 'delete') {
            await api.deleteProgram(item.userId, item.entityId, item.data.clientId);
          }
          break;

        case 'session':
          if (item.operation === 'create' || item.operation === 'update') {
            await api.saveSession(item.data);
          }
          break;

        case 'stimulus':
          if (item.operation === 'create') {
            await api.saveStimulus(item.userId, item.data.programId, item.data);
          } else if (item.operation === 'delete') {
            await api.deleteStimulus(item.userId, item.data.programId, item.entityId);
          }
          break;
      }

      return true;
    } catch (error) {
      console.error(`Failed to sync ${item.entity} ${item.operation}:`, error);
      throw error;
    }
  };

  // Trigger manual or automatic sync
  const triggerSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      const items = await getPendingSyncItems(userId);
      
      if (items.length === 0) {
        setIsSyncing(false);
        return;
      }

      console.log(`[Sync] Starting sync of ${items.length} items...`);

      let successCount = 0;
      let failCount = 0;

      for (const item of items) {
        try {
          await syncItem(item);
          await markSynced(item.id!);
          successCount++;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          await markSyncFailed(item.id!, errorMsg);
          failCount++;
        }
      }

      console.log(`[Sync] Complete: ${successCount} success, ${failCount} failed`);
      
      setLastSyncTime(Date.now());
      await refreshPendingCount();

      if (failCount > 0) {
        setSyncError(`${failCount} item(s) failed to sync`);
      }
    } catch (error) {
      console.error('[Sync] Error:', error);
      setSyncError('Sync failed. Will retry automatically.');
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, userId, refreshPendingCount]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Connection restored');
      setIsOnline(true);
      setSyncError(null);
      // Trigger sync after a short delay
      setTimeout(() => triggerSync(), 2000);
    };

    const handleOffline = () => {
      console.log('[Network] Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  // Refresh pending count on mount and when user changes
  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // Periodic sync check (every 2 minutes when online)
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      refreshPendingCount().then(() => {
        if (pendingSyncCount > 0 && !isSyncing) {
          console.log('[Sync] Auto-sync check triggered');
          triggerSync();
        }
      });
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [isOnline, pendingSyncCount, isSyncing, triggerSync, refreshPendingCount]);

  const value: NetworkContextType = {
    isOnline,
    isSyncing,
    pendingSyncCount,
    lastSyncTime,
    syncError,
    triggerSync,
    refreshPendingCount
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}
