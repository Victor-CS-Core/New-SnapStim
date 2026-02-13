/**
 * Sessions Section — TypeScript Types
 *
 * Types for Session Running & Data Capture functionality.
 * Includes session management, trial recording, and offline sync.
 */

/**
 * Session status lifecycle
 */
export type SessionStatus = 
  | 'not_started'    // Session created but not begun
  | 'in_progress'    // Currently running
  | 'paused'         // Temporarily paused, can be resumed
  | 'completed'      // All trials completed normally
  | 'abandoned';     // Session ended early due to circumstances

/**
 * Session type classification
 */
export type SessionType = 
  | 'teaching'       // Initial skill acquisition phase
  | 'generalization';// Applying learned skills in different contexts

/**
 * Trial response types
 */
export type TrialResponse = 
  | 'correct'        // Learner responded correctly without prompts
  | 'incorrect'      // Learner responded incorrectly
  | 'no_response'    // Learner did not respond within time window
  | 'prompted';      // Learner responded correctly with prompts

/**
 * Sync status for offline functionality
 */
export type SyncStatus = 
  | 'synced'         // Data successfully synced to server
  | 'pending'        // Waiting to sync (offline or in queue)
  | 'error';         // Sync failed, retry needed

/**
 * Rerun policy configuration
 */
export type RerunPolicy = 
  | 'none'           // No reruns
  | 'immediate'      // Rerun incorrect trials immediately after error
  | 'end_of_session' // Queue incorrect trials for end of session
  | 'random';        // Randomly intersperse reruns throughout session

/**
 * Individual trial record
 */
export interface Trial {
  trial_id: string;
  session_id: string;
  trial_number: number;
  stimulus_id: string;
  stimulus_text: string;
  stimulus_image_url: string | null;
  teaching_instruction: string;
  response: TrialResponse;
  timestamp: string;
  response_time_ms: number | null;
  rerun_triggered: boolean;
  notes: string;
}

/**
 * Mastery tracking within session
 */
export interface MasteryStatus {
  current_streak: number;
  mastery_met: boolean;
  mastery_date: string | null;
}

/**
 * Complete session record
 */
export interface Session {
  session_id: string;
  client_id: string;
  program_id: string;
  therapist_id: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number;
  status: SessionStatus;
  session_type: SessionType;
  trials: Trial[];
  notes: string;
  mastery_status: MasteryStatus;
  offline_session: boolean;
  sync_status: SyncStatus;
  sync_timestamp: string | null;
}

/**
 * Condensed session info for recent sessions list
 */
export interface RecentSession {
  session_id: string;
  client_name: string;
  program_name: string;
  status: SessionStatus;
  start_time: string;
  trials_completed: number;
  accuracy: number;
}

/**
 * Aggregated statistics across sessions
 */
export interface SessionSummary {
  total_sessions: number;
  completed_sessions: number;
  in_progress_sessions: number;
  abandoned_sessions: number;
  total_trials: number;
  average_accuracy: number;
  average_session_duration_minutes: number;
  mastery_achieved: number;
}

/**
 * Session data structure from JSON
 */
export interface SessionsData {
  sessions: Session[];
  recentSessions: RecentSession[];
  sessionSummary: SessionSummary;
}

/**
 * Props for SessionRunner component
 */
export interface SessionRunnerProps {
  session: Session;
  onResponseRecorded: (trial: Trial) => void;
  onSessionPaused: () => void;
  onSessionEnded: () => void;
  onUndo: () => void;
}

/**
 * Props for TrialDisplay component
 */
export interface TrialDisplayProps {
  stimulus_text: string;
  stimulus_image_url: string | null;
  teaching_instruction: string;
  trial_number: number;
  total_trials: number;
}

/**
 * Props for ResponseRecorder component
 */
export interface ResponseRecorderProps {
  onResponse: (response: TrialResponse) => void;
  disabled: boolean;
  showKeyboardShortcuts: boolean;
}

/**
 * Props for SessionRecap component
 */
export interface SessionRecapProps {
  session: Session;
  onSaveAndExit: () => void;
  onStartAnother: () => void;
  onPrint: () => void;
}

/**
 * Props for SessionHistory component
 */
export interface SessionHistoryProps {
  sessions: Session[];
  programName: string;
  clientName: string;
  onViewRecap: (sessionId: string) => void;
}

/**
 * Computed session statistics
 */
export interface SessionStats {
  total_trials: number;
  correct_count: number;
  incorrect_count: number;
  no_response_count: number;
  prompted_count: number;
  accuracy_percentage: number;
  average_response_time_ms: number;
}

/**
 * Session selection filter options
 */
export interface SessionFilters {
  client_id?: string;
  program_id?: string;
  status?: SessionStatus;
  session_type?: SessionType;
  date_from?: string;
  date_to?: string;
}

/**
 * Trial queue item for rerun management
 */
export interface TrialQueueItem {
  stimulus_id: string;
  trial_number: number;
  is_rerun: boolean;
  original_trial_id?: string;
}

/**
 * Offline sync queue item
 */
export interface SyncQueueItem {
  session_id: string;
  data: Partial<Session>;
  timestamp: string;
  retry_count: number;
  last_error?: string;
}

/**
 * Session configuration from program settings
 */
export interface SessionConfig {
  rerun_policy: RerunPolicy;
  auto_advance_delay_ms: number;
  max_trials_per_session: number;
  mastery_criterion: {
    type: 'consecutive' | 'percentage';
    value: number;
    trials?: number;
  };
}

/**
 * Real-time session progress tracking
 */
export interface SessionProgress {
  trials_completed: number;
  trials_remaining: number;
  current_streak: number;
  current_accuracy: number;
  elapsed_time_seconds: number;
  estimated_time_remaining_seconds: number;
}
