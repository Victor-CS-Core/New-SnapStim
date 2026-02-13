/**
 * Client status types
 */
export type ClientStatus = 'active' | 'inactive' | 'discharged'

/**
 * Program types in ABA therapy
 */
export type ProgramType = 'Listener Responding' | 'Tacting' | 'Intraverbal' | 'LRFFC'

/**
 * Program status
 */
export type ProgramStatus = 'active' | 'paused' | 'mastered' | 'archived'

/**
 * Performance trend indicators
 */
export type PerformanceTrend = 'improving' | 'stable' | 'declining'

/**
 * Session outcome
 */
export type SessionOutcome = 'success' | 'partial' | 'incomplete'

/**
 * Alert types
 */
export type AlertType = 'performance_drop' | 'inactivity' | 'review_due' | 'mastery_ready'

/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'warning' | 'critical'

/**
 * Client profile interface
 */
export interface Client {
  client_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  age: number
  status: ClientStatus
  tags: string[]
  primary_therapist: string
  start_date: string
  avatar_url?: string
  aggregates: ClientAggregates
  ai_insights: AIInsights
}

/**
 * Client-level aggregate metrics
 */
export interface ClientAggregates {
  active_program_count: number
  sessions_this_week: number
  average_accuracy: number
  overall_mastery_rate: number
  last_session_date: string
}

/**
 * AI-generated insights and recommendations
 */
export interface AIInsights {
  recommended_next_action: string
  priority_program_id: string | null
  risk_score: number
  intervention_suggested: boolean
  explanation_text: string
}

/**
 * Program assignment interface
 */
export interface Program {
  program_id: string
  client_id: string
  program_name: string
  program_type: ProgramType
  category: string
  status: ProgramStatus
  auto_assigned: boolean
  assigned_date: string
  current_phase: string
  mastery_threshold: number
  last_run_date: string
  performance: ProgramPerformance
}

/**
 * Program performance metrics
 */
export interface ProgramPerformance {
  total_trials: number
  correct_trials: number
  accuracy_percent: number
  trend: PerformanceTrend
  consecutive_mastery_sessions: number
  needs_review: boolean
}

/**
 * Alert/notification interface
 */
export interface Alert {
  alert_id: string
  client_id: string
  alert_type: AlertType
  severity: AlertSeverity
  related_program_id: string | null
  triggered_date: string
  resolved: boolean
  message: string
}

/**
 * Session summary interface
 */
export interface Session {
  session_id: string
  program_id: string
  client_id: string
  session_date: string
  duration_minutes: number
  accuracy_percent: number
  outcome: SessionOutcome
  recorded_by: string
  notes_summary?: string
}

/**
 * Complete client dashboard data
 */
export interface ClientDashboardData {
  client: Client
  programs: Program[]
  alerts: Alert[]
  recent_sessions: Session[]
}

/**
 * Props for client dashboard view
 */
export interface ClientDashboardProps {
  clientId: string
  data: ClientDashboardData
  onStartSession?: (programId: string) => void
  onViewProgramDetails?: (programId: string) => void
  onAddProgram?: () => void
  onEditClient?: () => void
  onResolveAlert?: (alertId: string) => void
  onViewSessionHistory?: () => void
}

/**
 * Props for program card component
 */
export interface ProgramCardProps {
  program: Program
  alerts?: Alert[]
  onStartSession?: () => void
  onViewDetails?: () => void
  onPause?: () => void
  onArchive?: () => void
}

/**
 * Props for alert component
 */
export interface AlertItemProps {
  alert: Alert
  onResolve?: () => void
  onViewDetails?: () => void
}

/**
 * Props for session timeline component
 */
export interface SessionTimelineProps {
  sessions: Session[]
  onViewSession?: (sessionId: string) => void
}
