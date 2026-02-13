/**
 * Reporting Section — TypeScript Types
 *
 * Types for communication, data visualization, and report generation.
 */

/**
 * User roles with different permission levels
 */
export type UserRole = 'BCBA' | 'RBT' | 'Caregiver' | 'Admin';

/**
 * Comment visibility levels
 */
export type CommentVisibility = 
  | 'public'           // Visible to all team members including caregivers
  | 'clinical_team'    // Visible to BCBA and RBT only
  | 'supervisor_only'; // Visible to BCBA only

/**
 * Comment tags for categorization
 */
export type CommentTag = 
  | 'urgent' 
  | 'question' 
  | 'recommendation' 
  | 'review_needed' 
  | 'resolved';

/**
 * Report template types
 */
export type TemplateType = 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'insurance' 
  | 'school' 
  | 'custom';

/**
 * Export/report format options
 */
export type ExportFormat = 'pdf' | 'excel' | 'word' | 'csv' | 'json';

/**
 * Export job status
 */
export type ExportStatus = 
  | 'pending'      // Queued for processing
  | 'processing'   // Currently generating
  | 'completed'    // Ready for download
  | 'failed';      // Generation failed

/**
 * Chart visualization types
 */
export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'stacked_bar' 
  | 'pie' 
  | 'scatter';

/**
 * Data source for charts
 */
export type ChartDataSource = 'sessions' | 'programs' | 'stimuli';

/**
 * Chart data aggregation levels
 */
export type ChartAggregation = 'daily' | 'weekly' | 'monthly';

/**
 * Scheduled export frequency
 */
export type ExportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

/**
 * File attachment for comments
 */
export interface Attachment {
  attachment_id: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  url: string;
  uploaded_at: string;
}

/**
 * Comment/communication thread item
 */
export interface Comment {
  comment_id: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  client_id: string;
  program_id: string | null;
  session_id: string | null;
  parent_comment_id: string | null;
  content: string;
  visibility: CommentVisibility;
  tags: CommentTag[];
  attachments: Attachment[];
  created_at: string;
  updated_at: string | null;
  edited: boolean;
  read_by: string[];
}

/**
 * Report section configuration
 */
export type ReportSection = 
  | 'client_demographics'
  | 'executive_summary'
  | 'session_attendance'
  | 'program_progress_summary'
  | 'program_breakdown'
  | 'accuracy_graphs'
  | 'response_time_analysis'
  | 'mastery_achievements'
  | 'mastery_documentation'
  | 'detailed_session_notes'
  | 'therapist_observations'
  | 'recommendations'
  | 'goals_for_next_month'
  | 'diagnosis_codes'
  | 'treatment_summary'
  | 'measurable_progress'
  | 'bcba_signature'
  | 'clinical_justification'
  | 'student_information'
  | 'iep_goals_alignment'
  | 'skill_acquisition_summary'
  | 'generalization_evidence'
  | 'behavioral_observations'
  | 'recommendations_for_school'
  | 'collaboration_notes'
  | 'quarter_overview'
  | 'program_mastery_summary'
  | 'new_programs_introduced'
  | 'skill_generalization'
  | 'behavioral_trends'
  | 'family_involvement'
  | 'treatment_plan_adjustments'
  | 'goals_for_next_quarter'
  | 'session_metadata'
  | 'trial_data'
  | 'stimulus_performance'
  | 'response_times';

/**
 * Report template configuration
 */
export interface ReportTemplate {
  template_id: string;
  template_name: string;
  template_type: TemplateType;
  sections: ReportSection[];
  format: ExportFormat;
  created_by: string;
  is_default: boolean;
  customizable: boolean;
}

/**
 * Date range for reports and charts
 */
export interface DateRange {
  start: string;
  end: string;
}

/**
 * Export job tracking
 */
export interface ExportJob {
  export_id: string;
  template_id: string;
  client_id: string;
  program_ids: string[];
  date_range: DateRange;
  format: ExportFormat;
  status: ExportStatus;
  download_url: string | null;
  created_at: string;
  expires_at: string;
  file_size_bytes: number;
}

/**
 * Chart filter configuration
 */
export interface ChartFilters {
  client_id?: string;
  program_ids?: string[];
  session_ids?: string[];
  therapist_ids?: string[];
}

/**
 * Chart configuration
 */
export interface ChartConfiguration {
  chart_id: string;
  chart_type: ChartType;
  title: string;
  data_source: ChartDataSource;
  filters: ChartFilters;
  date_range: DateRange;
  programs: string[];
  aggregation: ChartAggregation;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  program_id?: string;
  program_name?: string;
}

/**
 * Chart series (for multi-line charts)
 */
export interface ChartSeries {
  series_id: string;
  series_name: string;
  color: string;
  data: ChartDataPoint[];
}

/**
 * Complete chart data structure
 */
export interface ChartData {
  chart_id: string;
  title: string;
  chart_type: ChartType;
  series: ChartSeries[];
  x_axis_label: string;
  y_axis_label: string;
  date_range: DateRange;
}

/**
 * Dashboard summary metrics
 */
export interface DashboardMetrics {
  total_sessions_this_month: number;
  average_accuracy_all_programs: number;
  programs_at_mastery: number;
  active_programs: number;
  total_comments_unread: number;
  reports_generated_this_month: number;
  scheduled_exports_active: number;
}

/**
 * User notification preferences
 */
export interface NotificationSettings {
  user_id: string;
  email_notifications: boolean;
  urgent_comments: boolean;
  mentions: boolean;
  daily_digest: boolean;
  report_generation_complete: boolean;
  scheduled_export_complete: boolean;
}

/**
 * Scheduled export configuration
 */
export interface ScheduledExport {
  schedule_id: string;
  template_id: string;
  client_id: string;
  program_ids: string[];
  frequency: ExportFrequency;
  day_of_week?: string;
  day_of_month?: number;
  time: string;
  recipients: string[];
  format: ExportFormat;
  active: boolean;
  next_run: string;
}

/**
 * Report data from JSON
 */
export interface ReportingData {
  comments: Comment[];
  reportTemplates: ReportTemplate[];
  exportJobs: ExportJob[];
  chartConfigurations: ChartConfiguration[];
  dashboardMetrics: DashboardMetrics;
  notificationSettings: NotificationSettings[];
  scheduledExports: ScheduledExport[];
}

/**
 * Props for CommentsView component
 */
export interface CommentsViewProps {
  clientId?: string;
  programId?: string;
  onCommentAdded?: (comment: Comment) => void;
}

/**
 * Props for CommentThread component
 */
export interface CommentThreadProps {
  comment: Comment;
  replies: Comment[];
  onReply: (parentId: string, content: string) => void;
  currentUserId: string;
  currentUserRole: UserRole;
}

/**
 * Props for NewCommentForm component
 */
export interface NewCommentFormProps {
  clientId: string;
  programId?: string;
  sessionId?: string;
  currentUserId: string;
  currentUserRole: UserRole;
  onSubmit: (comment: Partial<Comment>) => void;
}

/**
 * Props for ProgressReportsView component
 */
export interface ProgressReportsViewProps {
  clientId?: string;
  onReportGenerated?: (exportJob: ExportJob) => void;
}

/**
 * Props for DataVisualizationView component
 */
export interface DataVisualizationViewProps {
  clientId?: string;
  programIds?: string[];
}

/**
 * Props for ChartComponent
 */
export interface ChartComponentProps {
  configuration: ChartConfiguration;
  data: ChartData;
  height?: number;
  width?: number;
  interactive?: boolean;
  onDataPointClick?: (dataPoint: ChartDataPoint) => void;
}

/**
 * Props for ExportCenterView component
 */
export interface ExportCenterViewProps {
  clientId?: string;
  onExportCreated?: (exportJob: ExportJob) => void;
}

/**
 * Report generation request
 */
export interface ReportGenerationRequest {
  template_id: string;
  client_id: string;
  program_ids: string[];
  date_range: DateRange;
  format: ExportFormat;
  include_options: {
    session_attendance: boolean;
    performance_graphs: boolean;
    mastery_status: boolean;
    therapist_comments: boolean;
    recommendations: boolean;
  };
}

/**
 * Comment filter options
 */
export interface CommentFilters {
  client_id?: string;
  program_id?: string;
  role?: UserRole;
  tags?: CommentTag[];
  date_from?: string;
  date_to?: string;
  visibility?: CommentVisibility;
  unread_only?: boolean;
}

/**
 * Session comparison data
 */
export interface SessionComparison {
  session_ids: string[];
  comparison_metrics: {
    accuracy: number[];
    trial_count: number[];
    duration_seconds: number[];
    response_time_avg: number[];
  };
  trend: 'improving' | 'stable' | 'declining';
}

/**
 * Export history item
 */
export interface ExportHistoryItem {
  export_id: string;
  template_name: string;
  client_name: string;
  created_at: string;
  expires_at: string;
  status: ExportStatus;
  file_size_bytes: number;
  download_url: string | null;
}

/**
 * Chart export options
 */
export interface ChartExportOptions {
  format: 'png' | 'svg' | 'csv';
  width?: number;
  height?: number;
  include_legend: boolean;
  include_title: boolean;
}

/**
 * Notification item
 */
export interface Notification {
  notification_id: string;
  user_id: string;
  type: 'comment' | 'mention' | 'report_ready' | 'export_complete';
  title: string;
  message: string;
  link_url: string;
  read: boolean;
  created_at: string;
}

/**
 * Comment activity summary
 */
export interface CommentActivitySummary {
  total_comments: number;
  unread_comments: number;
  urgent_comments: number;
  questions_pending: number;
  last_comment_date: string | null;
}
