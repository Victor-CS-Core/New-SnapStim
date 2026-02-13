# clients — Client Profiles & Program Management

## Overview

The clients section serves as a centralized command center for managing individual clients and their ABA programs. The Client Dashboard provides rapid clinical decision-making with at-a-glance performance metrics, active program status, intelligent alerts, and one-tap workflow execution.

---

## Views

### 1. Client Dashboard View

**Purpose**: Centralized command center for a single client, enabling rapid clinical decisions and workflow execution

**Layout**:

- **Client Identity Header**: Photo, name, age, status, assigned therapist
- **Key Performance Metrics**: Sessions this week, average accuracy, active programs, overall mastery rate
- **Active Programs Grid**: Program cards with status, performance trends, quick actions
- **Recent Session Activity**: Timeline of recent sessions with outcomes
- **Intelligent Alerts**: Priority notifications for performance drops, reviews needed, inactivity
- **Quick Actions Bar**: Start session, add program, view reports, edit profile

**User Actions**:

- Start/resume session for any active program
- View program details (targets, settings, history)
- Add new program to client
- Edit client profile (demographics, status, tags)
- Review performance data and trends
- Respond to alerts (acknowledge, take action)
- Access full session history
- Add/view clinical notes
- Manage program status (pause, activate, archive)
- Generate/view reports

---

## Client Data Structure

### Client Profile

```
{
  client_id: string
  first_name: string
  last_name: string
  date_of_birth: date
  age: number (calculated)
  status: 'active' | 'inactive' | 'discharged'
  tags: string[] (e.g., 'early-learner', 'verbal', 'attention-needed')
  primary_therapist: string (user_id reference)
  start_date: date
  avatar_url?: string
}
```

### Program Assignment

```
{
  program_id: string
  client_id: string (reference)
  program_name: string
  program_type: 'Listener Responding' | 'Tacting' | 'Intraverbal' | 'LRFFC'
  category: string (e.g., 'Receptive Language', 'Expressive Language')
  status: 'active' | 'paused' | 'mastered' | 'archived'
  auto_assigned: boolean
  assigned_date: date
  current_phase: string
  mastery_threshold: number (percentage)
  last_run_date: date
}
```

### Program Performance Metrics

```
{
  program_id: string
  total_trials: number
  correct_trials: number
  accuracy_percent: number
  trend: 'improving' | 'stable' | 'declining'
  consecutive_mastery_sessions: number
  needs_review: boolean
}
```

### Session Summary

```
{
  session_id: string
  program_id: string
  client_id: string
  session_date: timestamp
  duration_minutes: number
  accuracy_percent: number
  outcome: 'success' | 'partial' | 'incomplete'
  recorded_by: string (user_id reference)
  notes_summary?: string
}
```

### Client-Level Aggregates

```
{
  client_id: string
  active_program_count: number
  sessions_this_week: number
  average_accuracy: number
  overall_mastery_rate: number
  last_session_date: timestamp
}
```

### Alerts / Flags

```
{
  alert_id: string
  client_id: string
  alert_type: 'performance_drop' | 'inactivity' | 'review_due' | 'mastery_ready'
  severity: 'info' | 'warning' | 'critical'
  related_program_id?: string
  triggered_date: timestamp
  resolved: boolean
  message: string
}
```

### AI-Derived Fields (for intelligent decision support)

```
{
  client_id: string
  recommended_next_action: string
  priority_program_id?: string
  risk_score: number (0-100)
  intervention_suggested: boolean
  explanation_text: string
}
```

---

## User Flows

### Viewing Client Dashboard

1. User navigates to client from client list
2. Dashboard loads with all data aggregated
3. Programs displayed with status badges and performance indicators
4. Alerts shown at top if any require attention
5. KPIs calculated and displayed in header

### Starting a Session from Dashboard

1. User clicks "Start Session" on program card
2. System validates program is active and ready
3. Session interface launches with program context pre-loaded
4. Dashboard updates last_run_date when session completes

### Responding to Performance Alert

1. User sees alert badge on program card (declining trend)
2. Clicks to view details
3. Alert modal shows: trend graph, recent accuracy, recommendation
4. User options: Review targets, Run test session, Adjust mastery threshold
5. User selects action, alert marked as acknowledged

### Adding New Program to Client

1. User clicks "Add Program" in quick actions
2. Program creation modal opens with client context pre-filled
3. User selects program type, defines targets
4. Optionally triggers AI stimulus generation
5. Program auto-assigned to client on save
6. Dashboard refreshes with new program card

### Reviewing Performance Data

1. User clicks program card to expand details
2. View shows: accuracy trend graph, trial history, mastery progress
3. Tabs for: Overview, Targets, Sessions, Data
4. Options to export data or adjust settings

---

## Visual Design

### Program Card States

- **Active**: Emerald border, "Ready" badge
- **Paused**: Amber border, "Paused" badge
- **Mastered**: Green background, "Mastered" badge with trophy icon
- **Declining**: Red accent, warning icon
- **Needs Review**: Amber accent, alert icon

### Performance Indicators

- **Accuracy**: Color-coded percentage (>80% green, 60-80% amber, <60% red)
- **Trend**: Arrow icons (↑ improving, → stable, ↓ declining)
- **Mastery Progress**: Progress bar showing sessions toward mastery threshold

### Alert Priority

- **Critical**: Red background, bold text, pulse animation
- **Warning**: Amber background, medium weight
- **Info**: Blue background, normal weight

### Quick Action Buttons

- Primary action (Start Session): Emerald button, prominent
- Secondary actions: Outline buttons with icons
- Destructive actions (Archive): Red text, confirmation required

---

## Permissions & Role-Based Views

### BCBA View

- Full access to all sections
- Can edit client profile, add/remove programs
- Can respond to and dismiss alerts
- Can view all session data and analytics

### RBT View

- Can start sessions for assigned programs only
- Read-only access to program details
- Cannot edit client profile or program settings
- Can add session notes

### Caregiver View

- Read-only dashboard
- Can view assigned programs and recent progress
- Can start permitted programs (if authorized)
- Cannot see team communications or clinical notes

---

## Intelligent Features

### Auto-Generated Recommendations

- Suggest next program to run based on recency and performance
- Flag programs needing attention (declining accuracy)
- Recommend mastery criteria adjustments
- Identify programs ready for generalization phase

### Risk Scoring

- Calculate composite risk score (0-100) based on:
  - Days since last session
  - Performance trend across programs
  - Number of programs in declining state
  - Consistency of implementation
- Trigger escalation alerts for high-risk clients

### Performance Predictions

- Estimate sessions to mastery based on current trend
- Predict optimal session frequency
- Suggest target difficulty adjustments

---

## Accessibility

- Keyboard shortcuts for quick actions (s=start session, p=add program)
- Screen reader support for all metrics and alerts
- High contrast mode for performance indicators
- Focus management for modal workflows

---

## Responsive Design

### Desktop (1024px+)

- 2-3 column program grid
- Sidebar with alerts and quick stats
- Expanded metrics in header

### Tablet (768px - 1023px)

- 2 column program grid
- Collapsible sidebar
- Compact metrics

### Mobile (< 768px)

- Single column stack
- Bottom sheet for quick actions
- Swipe to dismiss alerts
