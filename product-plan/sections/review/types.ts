/**
 * Review Section Types
 * All types related to the Human-in-the-Loop Review workflow
 */

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type RejectionReason =
  | 'too_complex'
  | 'image_quality'
  | 'incorrect_content'
  | 'not_age_appropriate'
  | 'too_simple'
  | 'copyright_concerns'
  | 'other';

export type ReviewActionType = 'approve' | 'reject';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type BatchPriority = 'high' | 'medium' | 'low';

export interface GenerationMetadata {
  model: string;
  prompt: string;
  confidence_score: number;
  generation_date: string;
  batch_id: string;
  image_resolution?: string;
  clarity_score?: number;
  acceptable_answers?: string[];
}

export interface ReviewData {
  reviewed_by: string;
  reviewed_by_name: string;
  reviewed_date: string;
  rejection_reason?: RejectionReason | null;
  rejection_notes?: string | null;
  review_duration_seconds: number;
  regeneration_requested?: boolean;
}

export interface RegenerationHistory {
  regeneration_count: number;
  previous_versions: string[];
  improvement_notes: string[];
}

export interface ReviewQueueItem {
  stimulus_id: string;
  program_id: string;
  program_name: string;
  program_type: 'expressive_labeling' | 'receptive_identification' | 'intraverbal' | 'listener_responding';
  client_name: string;
  stimulus_text: string;
  image_url: string | null;
  review_status: ReviewStatus;
  generation_metadata: GenerationMetadata;
  review_data: ReviewData | null;
  regeneration_history: RegenerationHistory;
}

export interface ReviewAction {
  action_id: string;
  stimulus_id: string;
  reviewer_id: string;
  reviewer_name: string;
  action_type: ReviewActionType;
  timestamp: string;
  rejection_reason: RejectionReason | null;
  rejection_notes: string | null;
  time_spent_seconds: number;
  regeneration_requested?: boolean;
}

export interface ReviewSummary {
  total_stimuli_generated: number;
  pending_review_count: number;
  approved_count: number;
  rejected_count: number;
  approval_rate: number;
  average_review_time_seconds: number;
  total_batches: number;
  batches_pending: number;
}

export interface ProgramTypeStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  approval_rate: number;
}

export interface ReviewAnalytics {
  summary: ReviewSummary;
  by_program_type: Record<string, ProgramTypeStats>;
  rejection_reasons: Record<RejectionReason, number>;
  confidence_score_distribution: Record<ConfidenceLevel, number>;
  review_velocity: {
    last_7_days: number;
    last_30_days: number;
    average_per_day: number;
  };
}

export interface Batch {
  batch_id: string;
  program_id: string;
  program_name: string;
  generation_date: string;
  total_stimuli: number;
  pending: number;
  approved: number;
  rejected: number;
  priority: BatchPriority;
}

export interface ReviewSectionData {
  review_queue: ReviewQueueItem[];
  review_actions: ReviewAction[];
  review_analytics: ReviewAnalytics;
  batches: Batch[];
}
