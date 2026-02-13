# Reporting Section — Specification

## Overview

The Reporting section provides communication tools, data visualization, and export capabilities for therapists, supervisors, and caregivers. It enables role-based commenting on programs, visual analysis of performance trends, session history review, and generation of clinical documentation for insurance, schools, and supervisors.

---

## Views

### Comments & Communication

**Purpose:** Facilitate structured communication about client progress among team members and caregivers.

**Layout:**

- Header: "Comments & Communication" with client/program selector
- Filtering options:
  - Program filter (All / Specific program)
  - Role filter (All / BCBA / RBT / Caregiver)
  - Date range filter
  - Comment type filter (General / Question / Concern / Recommendation)

**Comment Thread Display:**

- Threaded conversation view with:
  - Author name and role badge
  - Timestamp (relative: "2 hours ago" or absolute)
  - Comment text with markdown support
  - Attachments (images, session data references)
  - Reply button (nested replies supported)
  - Tag system (urgent, review-needed, resolved)
  - Privacy indicator (visible to: roles)

**New Comment Form:**

- Rich text editor with formatting options
- Program/session reference selector
- Visibility controls:
  - Public (all team members)
  - Clinical team only (BCBA + RBT)
  - Supervisor only (BCBA)
- Tag selector (urgent, question, recommendation)
- Attach session data or graphs
- Submit button

**Privacy Rules:**

- Caregivers see: Their own comments + responses from therapists
- RBTs see: All clinical comments except supervisor-only
- BCBAs see: All comments including supervisor-only
- Admins see: All comments across all clients

**Notification System:**

- Badge showing unread comments count
- Email notifications for urgent tags
- In-app notifications for @mentions
- Daily digest option for caregivers

---

### Progress Reports

**Purpose:** Generate structured progress reports for stakeholders.

**Layout:**

- Header: "Progress Reports" with client selector
- Report type selector:
  - Weekly Summary
  - Monthly Progress Report
  - Quarterly Review
  - Insurance Authorization Report
  - School IEP Report
  - Custom Date Range

**Report Configuration Panel:**

- Date range picker
- Program selection (multi-select)
- Include options:
  - Session attendance
  - Performance graphs
  - Mastery status
  - Therapist comments
  - Recommendations
  - Goals & objectives progress
- Format options:
  - PDF (formatted for printing)
  - Excel (data export)
  - Word (editable template)

**Report Preview:**

- Live preview of generated report
- Sections:
  - Client demographics header
  - Executive summary
  - Program-by-program breakdown
  - Performance graphs (accuracy over time)
  - Session attendance table
  - Mastery achievements
  - Therapist observations
  - Recommendations for next period
  - Signature block

**Actions:**

- Generate Report button
- Download PDF/Excel/Word buttons
- Email Report button (send to parent/supervisor)
- Save as Template button
- Print button

---

### Data Visualization

**Purpose:** Visual analysis of performance trends across programs and sessions.

**Layout:**

- Header: "Data Analytics" with client selector
- Dashboard cards showing key metrics:
  - Total Sessions (this month)
  - Average Accuracy (across all programs)
  - Programs at Mastery
  - Active Programs

**Chart Section:**

**1. Accuracy Trends Chart**
- Line graph showing accuracy % over time
- Multi-line support for comparing programs
- Date range selector (Last 7 days, 30 days, 90 days, All time)
- Interactive tooltips on hover
- Legend with program names and colors

**2. Session Volume Chart**
- Bar chart showing sessions per week/month
- Grouped by program type
- Hover shows session count and total trials

**3. Response Type Distribution**
- Stacked bar chart showing correct/incorrect/no-response/prompted
- Per program or across all programs
- Percentage or absolute count toggle

**4. Mastery Progress Chart**
- Progress bars for each program
- Shows current streak vs. mastery criterion
- Color-coded: green (met), amber (close), red (not close)

**5. Trial Response Time Chart**
- Box plot or violin plot showing response time distribution
- Per stimulus or per program
- Identifies outliers (very fast or very slow responses)

**Interactivity:**

- Click program name to filter all charts
- Zoom into date ranges
- Export chart as PNG/SVG
- Download chart data as CSV
- Toggle between different chart types (line/bar/area)

---

### Session History Review

**Purpose:** Detailed review of past sessions with drill-down capability.

**Layout:**

- Header: "Session History" with client and program filters
- Sessions table:
  - Date & Time
  - Program name
  - Therapist name
  - Status (completed/abandoned)
  - Total trials
  - Accuracy %
  - Duration
  - View Details button

**Session Detail Modal:**

- Opens when "View Details" clicked
- Full session recap with:
  - Session metadata (date, therapist, duration)
  - Performance summary cards
  - Trial-by-trial table
  - Session notes
  - Response time analysis
  - Stimulus-level accuracy breakdown
- Print Session Recap button
- Add Comment button (links to comments view)

**Comparison Mode:**

- Select multiple sessions to compare
- Side-by-side accuracy comparison
- Trend analysis between selected sessions
- Identify improving/declining stimuli

---

### Export Center

**Purpose:** Central hub for exporting data in various formats.

**Layout:**

- Header: "Export Center" with client selector
- Export templates grid:
  - Weekly Summary Template
  - Monthly Progress Report Template
  - Insurance Authorization Template
  - Raw Session Data Export
  - Stimulus Performance Export
  - Custom Report Builder

**Export Configuration Panel:**

- Template selector (from grid)
- Date range picker
- Program selector (multi-select)
- Data inclusions checklist:
  - Session data
  - Trial-by-trial data
  - Comments
  - Graphs/charts
  - Photos (if applicable)
- Format options:
  - PDF (read-only, formatted)
  - Excel (.xlsx - for analysis)
  - Word (.docx - for editing)
  - CSV (raw data)
  - JSON (for API integrations)

**Export History:**

- List of previously generated exports
- Download links (valid for 30 days)
- Re-generate button
- Delete button

**Scheduled Exports:**

- Create recurring export schedules
- Weekly email to caregivers
- Monthly report to supervisor
- Quarterly insurance documentation
- Auto-generate and send or save to cloud storage

---

## User Flows

### Commenting on a Program

1. Therapist navigates to Reporting > Comments
2. Selects client and program
3. Clicks "New Comment"
4. Enters comment text with formatting
5. Selects visibility (Clinical Team or Include Caregiver)
6. Adds tags (e.g., "Question")
7. Clicks Submit
8. Comment appears in thread
9. Relevant roles receive notifications

### Generating a Progress Report

1. BCBA navigates to Reporting > Progress Reports
2. Selects client
3. Chooses "Monthly Progress Report" template
4. Sets date range (last 30 days)
5. Selects programs to include
6. Checks options: Include graphs, Include comments
7. Clicks "Generate Report"
8. Reviews live preview
9. Adjusts formatting if needed
10. Clicks "Download PDF"
11. PDF downloads with formatted report
12. Optional: Email to parent/supervisor

### Analyzing Performance Trends

1. BCBA navigates to Reporting > Data Visualization
2. Selects client
3. Reviews dashboard metrics
4. Clicks on "Accuracy Trends" chart
5. Selects "Last 90 days" date range
6. Clicks program name in legend to filter
7. Observes upward trend in accuracy
8. Hovers over data points for exact values
9. Clicks "Export Chart" → Downloads PNG
10. Uses chart in progress meeting with team

---

## UI Requirements

### Comment System

- **Rich Text Editor:** Support bold, italic, bullet lists, hyperlinks
- **@Mentions:** Type @ to mention team members, triggers notification
- **Attachment Support:** Drag-and-drop images or files
- **Threading:** Visual nesting for replies (max 3 levels deep)
- **Real-Time Updates:** New comments appear without page refresh
- **Markdown Preview:** Live preview of formatted text

### Data Visualization

- **Responsive Charts:** Scale to container width, maintain aspect ratio
- **Accessible Colors:** Sufficient contrast, colorblind-friendly palettes
- **Interactive Tooltips:** Show exact values on hover
- **Legend Controls:** Click to show/hide data series
- **Export Options:** PNG, SVG, or CSV for each chart
- **Loading States:** Skeleton loaders while data fetches

### Report Generation

- **Customizable Templates:** Users can create and save custom report templates
- **Brand Customization:** Upload clinic logo, customize colors
- **Page Breaks:** Intelligent page breaks in PDF exports
- **Header/Footer:** Automatic page numbers, date stamps
- **Professional Formatting:** Consistent fonts, spacing, tables

---

## Data Requirements

### Comment Entity

```typescript
{
  comment_id: string
  author_id: string           // User who posted
  author_name: string
  author_role: 'BCBA' | 'RBT' | 'Caregiver' | 'Admin'
  client_id: string
  program_id: string | null   // Optional program reference
  session_id: string | null   // Optional session reference
  parent_comment_id: string | null  // For threaded replies
  content: string             // Comment text (markdown)
  visibility: 'public' | 'clinical_team' | 'supervisor_only'
  tags: string[]              // ['urgent', 'question', 'resolved']
  attachments: Attachment[]
  created_at: string          // ISO timestamp
  updated_at: string | null
  edited: boolean
  read_by: string[]           // Array of user IDs who have read
}
```

### Report Template Entity

```typescript
{
  template_id: string
  template_name: string
  template_type: 'weekly' | 'monthly' | 'quarterly' | 'insurance' | 'school' | 'custom'
  sections: ReportSection[]
  format: 'pdf' | 'excel' | 'word'
  created_by: string
  is_default: boolean
  customizable: boolean
}
```

### Export Job Entity

```typescript
{
  export_id: string
  template_id: string
  client_id: string
  program_ids: string[]
  date_range: { start: string, end: string }
  format: 'pdf' | 'excel' | 'word' | 'csv' | 'json'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  download_url: string | null
  created_at: string
  expires_at: string          // 30 days from creation
  file_size_bytes: number
}
```

### Chart Configuration

```typescript
{
  chart_id: string
  chart_type: 'line' | 'bar' | 'stacked_bar' | 'pie' | 'scatter'
  title: string
  data_source: 'sessions' | 'programs' | 'stimuli'
  filters: ChartFilters
  date_range: DateRange
  programs: string[]
  aggregation: 'daily' | 'weekly' | 'monthly'
}
```

---

## Edge Cases & Error Handling

### Comment Permissions

- **Role mismatch:** Prevent caregivers from viewing clinical-only comments
- **Deleted users:** Show "[Deleted User]" for comments by removed team members
- **Archived programs:** Allow viewing comments but disable new comments
- **Client discharge:** Archive comment threads, prevent new comments

### Report Generation Failures

- **No data available:** Show message "No data available for selected date range"
- **Too much data:** Warn if report exceeds 100 pages, offer to split
- **PDF generation timeout:** Retry up to 3 times, show error if fails
- **Template missing:** Fallback to default template if custom template corrupted

### Export Issues

- **File size limits:** Max 50MB per export, compress if needed
- **Expired download links:** Show "Link expired" with re-generate option
- **Storage full:** Alert admin, prevent new exports until space freed
- **Format conversion errors:** Log error, offer alternative format

### Chart Rendering

- **Empty data sets:** Show placeholder "No data to display" message
- **Too many data points:** Automatically aggregate by week/month instead of day
- **Browser compatibility:** Fallback to static images if canvas not supported
- **Slow rendering:** Show loading spinner, render in chunks

---

## Validation & Business Rules

### Comment Rules

- Comment content required (min 1 character, max 5000 characters)
- Author must have access to client
- Cannot edit comment after 1 hour (moderator can)
- Cannot delete comment with replies (moderator can)
- Urgent tag triggers email notification to BCBA

### Report Rules

- Date range cannot exceed 1 year for detailed reports
- At least 1 program must be selected
- PDF reports max 200 pages
- Word templates must include required sections
- Insurance reports require BCBA signature

### Export Rules

- Exports expire after 30 days
- Max 10 exports per day per user (prevent abuse)
- Scheduled exports max 1 per hour
- Export history retained for 90 days
- Cannot export data for discharged clients after 1 year

### Chart Rules

- Date range required (default: last 30 days)
- Max 10 programs per chart (prevent clutter)
- Chart data cached for 1 hour
- Auto-refresh if underlying data changes
- Color palette max 12 distinct colors

---

## Accessibility Features

- **Keyboard Navigation:** Tab through comments, use arrow keys in charts
- **Screen Reader Support:** Announce new comments, describe chart data
- **High Contrast Mode:** Ensure charts readable in high contrast
- **Focus Indicators:** Clear focus states for all interactive elements
- **Alt Text:** All charts have detailed descriptions for screen readers
- **ARIA Labels:** Proper labels for all form controls and buttons

---

## Performance Considerations

- **Comment Pagination:** Load 20 comments at a time, infinite scroll
- **Chart Data Caching:** Cache chart data for 1 hour to reduce queries
- **Lazy Load Charts:** Load charts as user scrolls into view
- **Report Generation Async:** Generate reports in background, notify when ready
- **Export Queue:** Queue exports to prevent server overload
- **Image Compression:** Compress attached images to reduce storage

---

## Success Metrics

- **Comment Engagement:** Average comments per program per month > 5
- **Report Usage:** Reports generated per month per BCBA > 10
- **Export Adoption:** Percentage of BCBAs using scheduled exports > 50%
- **Chart Interaction:** Average time viewing charts per session > 2 minutes
- **Response Time:** Comments receive reply within 24 hours > 80%

---

## Integration Points

- **Sessions Section:** Link to session details from comments
- **Programs Section:** Reference programs in comments, show comments in program view
- **Clients Section:** Display unread comment count on client cards
- **Accounts Section:** Role-based permissions for comment visibility
- **Email Service:** Send notifications and scheduled reports
- **Cloud Storage:** Store generated reports and exports

---

## Future Enhancements

- **AI-Generated Insights:** Auto-generate progress summaries from session data
- **Voice Comments:** Record audio comments for mobile users
- **Video Attachments:** Attach session videos to comments
- **Collaborative Editing:** Multiple users edit reports simultaneously
- **Template Marketplace:** Share and download report templates
- **Advanced Analytics:** Predictive analysis of mastery timelines
- **Integration with EHR Systems:** Export directly to electronic health records
- **Mobile App:** Dedicated mobile app for quick commenting and report viewing
