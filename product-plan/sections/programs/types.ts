/**
 * Programs Section - TypeScript Type Definitions
 * 
 * Defines interfaces for ABA skill-acquisition programs,
 * stimuli, and related data structures.
 */

export type ProgramType = 
  | 'receptive_identification'
  | 'expressive_labeling'
  | 'intraverbal'
  | 'listener_responding'

export type ProgramMode = 'teaching' | 'generalization'

export type ProgramStatus = 'active' | 'paused' | 'mastered' | 'archived'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type PerformanceTrend = 'improving' | 'stable' | 'declining'

export interface RerunPolicy {
  error_correction: boolean
  immediate_rerun_on_error: boolean
  mastery_maintenance: boolean
  trial_count: number
}

export interface ProgramPerformance {
  total_trials: number
  correct_trials: number
  accuracy_percent: number
  trend: PerformanceTrend
  consecutive_mastery_sessions: number
  sessions_to_date: number
}

export interface AIMetadata {
  generation_date: string
  generation_model: string
  stimuli_generated: number
  stimuli_approved: number
  stimuli_rejected: number
}

export interface Program {
  program_id: string
  program_name: string
  client_id: string
  program_type: ProgramType
  category: string
  description: string
  mode: ProgramMode
  status: ProgramStatus
  mastery_threshold: number
  consecutive_sessions_for_mastery: number
  teaching_instructions: string
  rerun_policy: RerunPolicy
  created_by: string
  created_date: string
  last_modified_date: string
  last_run_date: string
  performance: ProgramPerformance
  ai_metadata: AIMetadata
}

export interface StimulusGenerationMetadata {
  prompt: string
  model: string
  confidence_score: number
  acceptable_answers?: string[]
}

export interface StimulusTrialData {
  times_presented: number
  correct_responses: number
  accuracy_percent: number
}

export interface Stimulus {
  stimulus_id: string
  program_id: string
  stimulus_text: string
  image_url: string | null
  review_status: ReviewStatus
  generation_metadata: StimulusGenerationMetadata
  created_date: string
  reviewed_by: string | null
  reviewed_date: string | null
  trial_data: StimulusTrialData
}

/**
 * Program creation form data
 */
export interface ProgramFormData {
  program_name: string
  client_id: string
  program_type: ProgramType
  category: string
  description: string
  mode: ProgramMode
  mastery_threshold: number
  consecutive_sessions_for_mastery: number
  teaching_instructions: string
  rerun_policy: RerunPolicy
}

/**
 * Stimulus generation request
 */
export interface StimulusGenerationRequest {
  program_id: string
  count: number
  generation_type: 'text_only' | 'text_and_images'
  additional_guidance?: string
}

/**
 * Program type metadata for UI
 */
export interface ProgramTypeInfo {
  type: ProgramType
  label: string
  description: string
  example: string
}

export const PROGRAM_TYPE_INFO: Record<ProgramType, Omit<ProgramTypeInfo, 'type'>> = {
  receptive_identification: {
    label: 'Receptive Identification',
    description: 'Client identifies items when named',
    example: '"Touch the ball" or "Find the blue one"'
  },
  expressive_labeling: {
    label: 'Expressive Labeling',
    description: 'Client names items when shown',
    example: '"What is this?" → Client responds with label'
  },
  intraverbal: {
    label: 'Intraverbal Fill-in',
    description: 'Client completes sentences or answers questions',
    example: '"You drink ___" → Client says "water" or "juice"'
  },
  listener_responding: {
    label: 'Listener Responding',
    description: 'Client follows instructions or completes actions',
    example: '"Stand up and clap" or "Put the cup on the table"'
  }
}
