/**
 * Offline Database using Dexie (IndexedDB wrapper)
 * 
 * Stores data locally for offline access and queues
 * pending changes for sync when connection is restored.
 */

import Dexie, { type Table } from 'dexie';
import type { Client } from '../../product-plan/sections/clients/types';
import type { Program } from '../../product-plan/sections/programs/types';
import type { Session, Trial } from '../../product-plan/sections/sessions/types';
import type { ReviewQueueItem } from '../../product-plan/sections/review/types';

// Define sync queue item for pending operations
export interface SyncQueueItem {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  entity: 'client' | 'program' | 'session' | 'stimulus';
  entityId: string;
  data: any;
  timestamp: number;
  userId: string;
  synced: boolean;
  error?: string;
}

// Extend Dexie with our custom tables
export class SnapStimDatabase extends Dexie {
  // Tables
  clients!: Table<Client, string>;
  programs!: Table<Program, string>;
  sessions!: Table<Session, string>;
  trials!: Table<Trial, string>;
  stimuli!: Table<ReviewQueueItem, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('SnapStimDB');
    
    // Define schema version 1
    this.version(1).stores({
      // Clients table - indexed by client_id
      clients: 'client_id, user_id, name, status, created_date',
      
      // Programs table - indexed by program_id
      programs: 'program_id, user_id, client_id, program_name, status, created_date',
      
      // Sessions table - indexed by session_id
      sessions: 'session_id, user_id, client_id, program_id, start_time, status',
      
      // Trials table - indexed by trial_id
      trials: 'trial_id, session_id, trial_number, stimulus_id, response, timestamp',
      
      // Stimuli table - indexed by stimulus_id
      stimuli: 'stimulus_id, user_id, program_id, review_status, created_date',
      
      // Sync queue - auto-incrementing id
      syncQueue: '++id, userId, entity, synced, timestamp'
    });
  }
}

// Create singleton instance
export const db = new SnapStimDatabase();

// Helper functions for common operations

/**
 * Add item to sync queue for later synchronization
 */
export async function queueSync(
  operation: SyncQueueItem['operation'],
  entity: SyncQueueItem['entity'],
  entityId: string,
  data: any,
  userId: string
): Promise<number> {
  return await db.syncQueue.add({
    operation,
    entity,
    entityId,
    data,
    timestamp: Date.now(),
    userId,
    synced: false
  });
}

/**
 * Get all pending sync items for a user
 */
export async function getPendingSyncItems(userId: string): Promise<SyncQueueItem[]> {
  return await db.syncQueue
    .where('userId')
    .equals(userId)
    .and(item => !item.synced)
    .sortBy('timestamp');
}

/**
 * Mark sync item as completed
 */
export async function markSynced(id: number): Promise<void> {
  await db.syncQueue.update(id, { synced: true });
}

/**
 * Mark sync item as failed with error
 */
export async function markSyncFailed(id: number, error: string): Promise<void> {
  await db.syncQueue.update(id, { error });
}

/**
 * Clear all synced items older than specified days
 */
export async function clearOldSyncedItems(daysOld: number = 7): Promise<void> {
  const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
  await db.syncQueue
    .where('synced')
    .equals(1)
    .and(item => item.timestamp < cutoffTime)
    .delete();
}

/**
 * Get database statistics
 */
export async function getDbStats() {
  const [
    clientCount,
    programCount,
    sessionCount,
    trialCount,
    stimuliCount,
    pendingSyncCount
  ] = await Promise.all([
    db.clients.count(),
    db.programs.count(),
    db.sessions.count(),
    db.trials.count(),
    db.stimuli.count(),
    db.syncQueue.where('synced').equals(0).count()
  ]);

  return {
    clients: clientCount,
    programs: programCount,
    sessions: sessionCount,
    trials: trialCount,
    stimuli: stimuliCount,
    pendingSync: pendingSyncCount
  };
}

/**
 * Clear all data from database (use with caution!)
 */
export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.clients.clear(),
    db.programs.clear(),
    db.sessions.clear(),
    db.trials.clear(),
    db.stimuli.clear(),
    db.syncQueue.clear()
  ]);
}

export default db;
