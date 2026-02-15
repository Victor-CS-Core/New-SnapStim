# SnapStim ProjectUI - User Guide

**Version:** 1.0  
**Updated:** February 14, 2026  
**For:** Demo Users, Stakeholders, and End Users

---

## What is SnapStim?

SnapStim is an ABA (Applied Behavior Analysis) skill-acquisition tool designed to help BCBAs, RBTs, and Caregivers manage therapy programs more efficiently. It reduces manual work through AI-powered features while maintaining clinical quality.

---

## Main Features

### 1. Dashboard - Your Command Center

**What you see:**
- Quick stats: Active clients, programs, sessions, and accuracy rates
- **Needs Attention** section: Alerts for clients or programs requiring intervention
- **Quick Actions**: One-click access to start sessions, create programs, or view reports
- **AI Insights**: AI-generated recommendations for each client
- **Recent Activity**: Latest completed sessions across all clients

**How to use it:**
1. Log in and you'll land here automatically
2. Scan the "Needs Attention" section for urgent items
3. Click any alert to jump to that client's details
4. Use Quick Actions to start common tasks
5. Review AI recommendations for clinical guidance

**Example:** Dashboard shows "Liam Chen - Declining performance, needs intervention." Click the alert to see his full profile and programs.

---

### 2. Clients - Profile Management

**What you see:**
- **Left sidebar:** List of all clients with photos and basic info
- **Main area:** Selected client's dashboard showing:
  - Profile information (age, status, active programs)
  - Program cards with performance metrics
  - Alerts specific to this client
  - AI recommendations
- **Quick actions:** Start Session, Add Program, View Reports, Edit Profile

**How to use it:**
1. Navigate to Clients from the sidebar menu
2. Search or scroll to find a client in the left panel
3. Click a client to view their full dashboard
4. Review their active programs and any alerts
5. Use action buttons to start sessions or view progress

**Example:** Select "Emma Rodriguez" → See her 4 active programs → Check that "Tacting Colors" is at 85% accuracy (improving) → Click "Start Session" on that program.

---

### 3. Programs - Program Library

**What you see:**
- Program statistics cards (active count, average accuracy, AI metrics)
- Filters to search by name, type, or status
- List of all programs showing:
  - Program name and type
  - Client assigned
  - Performance metrics and trends
  - Status badge (Active, Mastered, Paused)

**How to use it:**
1. Navigate to Programs from the sidebar
2. Use filters to find specific programs
3. Click any program row to see detailed view with:
   - Full description and instructions
   - Trial history and performance charts
   - Stimulus library
   - Edit and "Start Session" buttons

**Example:** Search for "Requesting Items" → Click to open details → See 71% accuracy with improving trend → Click "Start Session" to begin working with the client.

**Create new program:**
1. Click "New Program" button (top right)
2. *(Future)* Fill out program form with client, type, and category
3. *(Future)* Choose to generate AI stimuli
4. *(Future)* Review AI-generated images before finalizing

---

### 4. Review - AI Stimulus Approval

**What you see:**
- Queue of AI-generated images awaiting approval
- Large stimulus preview in center
- Metadata panel showing:
  - Program and client name
  - Generation details (model, confidence score)
  - Image quality metrics
- Action buttons: Approve, Reject, Regenerate, Edit

**How to use it:**
1. Navigate to Review from sidebar
2. View the first stimulus in the queue
3. Assess if the image is appropriate and clear
4. Click "Approve" to accept or "Reject" to request new image
5. Use "Zoom" to see full-size version
6. Add notes if needed
7. Move to next stimulus automatically

**Example:** AI generated image of "cup" for Tacting Objects program → Image is clear and appropriate → Click "Approve" → Next stimulus loads.

---

### 5. Sessions - Run Therapy Sessions

**What you see:**

#### Session Selection (Start Page)
- **Left sidebar:** Client list with photos and program counts
- **Main area:** Programs for selected client with:
  - Program name, type, and description
  - Last session date and accuracy
  - "Start" button for each program
- **Right sidebar:** Recent session history

#### Session Runner (During Session)
- Large stimulus display
- Trial counter (e.g., "Trial 3 of 10")
- Response buttons: Correct, Incorrect, Prompted, No Response
- Timer and notes field
- "Pause" and "End Session" buttons

#### Session Recap (After Session)
- Summary statistics (accuracy, duration, trial count)
- Trial-by-trial breakdown
- Performance compared to previous sessions
- AI-generated recommendations
- "Save & Exit" button

**How to use it:**
1. Navigate to Sessions
2. Select client from left sidebar (search to filter)
3. Choose program from their list
4. Click "Start" to begin session
5. **During session:**
   - Present stimulus to client
   - Wait for response
   - Record outcome by clicking appropriate button
   - Add notes if needed
   - Continue through all trials
6. **After session:**
   - Review summary statistics
   - Read AI recommendations
   - Click "Save & Exit"

**Example:** Select "Emma Rodriguez" → Choose "Tacting Colors" → Start → Present blue color card → Client says "blue" correctly → Click "Correct" → Continue for 10 trials → Review 80% accuracy → Save.

---

### 6. Reporting - Data Analysis

**Four tabs available:**

#### Comments Tab
- Team communication threaded by client/program
- Role-based visibility (BCBA can see everything, RBT sees some, Caregiver sees limited)
- Add comments with tags and mentions
- Filter by client, program, or date

**Use case:** BCBA leaves note for RBT about behavior intervention strategy.

#### Progress Reports Tab
- Template-based report generation
- Select client, date range, and report type
- Preview before generating
- Export as PDF or send via email

**Use case:** Generate monthly progress report for parent conference.

#### Data Analytics Tab
- Visual charts and graphs:
  - Accuracy trends over time
  - Session volume by week
  - Response type distribution (correct vs. prompted vs. incorrect)
  - Mastery progress across programs
- Interactive filters by client, program, date

**Use case:** Identify which program types show fastest improvement for a specific client.

#### Export Center Tab
- Bulk data exports to CSV, PDF, or JSON
- Schedule recurring exports
- View export history and download previous exports

**Use case:** Export all session data for external analysis or insurance reporting.

---

### 7. Accounts - User Management

**What you see:**
- User directory with role badges (BCBA, RBT, Caregiver)
- Filter by role, status, or search by name/email
- User statistics cards
- User detail panel showing:
  - Contact information
  - Assigned clients and programs
  - Role and permissions
  - Activity history

**How to use it:**
*(BCBA admin only)*
1. Navigate to Accounts
2. View list of all team members
3. Click user to see details
4. Use "Add User" to invite new team members
5. Edit user information or deactivate accounts as needed

**Example:** View Mike Johnson (RBT) → See he's assigned to 2 clients with 4 programs → Check his last activity was 2 hours ago.

---

## Common Workflows

### Workflow 1: Morning Routine - Check Alerts
1. Open Dashboard
2. Review "Needs Attention" section
3. Click any red/amber alerts to investigate
4. Take action on declining programs or high-risk clients
5. Check recent activity for overnight progress

### Workflow 2: Conduct Session
1. Navigate to Sessions
2. Select client (e.g., Emma Rodriguez)
3. Choose program based on schedule (e.g., Tacting Colors)
4. Run 10 trials, recording responses
5. Review recap and AI recommendations
6. Save session

### Workflow 3: Weekly Check-In
1. Navigate to Reporting > Data Analytics
2. Filter to specific client
3. Review accuracy trends for past week
4. Compare to previous week
5. Adjust intervention strategy if needed
6. Leave comment for RBT with updated instructions

### Workflow 4: Create New Program
1. Navigate to Programs
2. Click "New Program"
3. Enter program details:
   - Client: Liam Chen
   - Type: Receptive Labeling
   - Category: Body Parts
   - Request 15 AI-generated stimuli
4. Save and redirect to Review
5. Approve/reject each generated image
6. Program is ready to use in sessions

### Workflow 5: Generate Progress Report
1. Navigate to Reporting > Progress Reports
2. Select template (e.g., "Monthly Parent Report")
3. Choose client and date range
4. Preview report
5. Export as PDF
6. Email directly or download for printing

---

## Tips & Best Practices

### For BCBAs:
- Check Dashboard alerts daily
- Review AI recommendations but trust your clinical judgment
- Use Comments to communicate strategy changes to RBTs
- Generate progress reports monthly for documentation

### For RBTs:
- Focus on Sessions section for day-to-day work
- Check Comments before starting client sessions
- Record accurate trial-by-trial data (critical for analysis)
- Note behavioral observations in session notes

### For Caregivers:
- Monitor your child's progress through Reporting > Data Analytics
- Review comments left by clinical team
- Contact BCBA if you have questions about recommendations

---

## Keyboard Shortcuts

*(Future feature)*
- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: New session
- `Space`: Next trial (during session)
- `1-4`: Record response type (during session)
- `Esc`: Close modal/detail view

---

## Troubleshooting

### "Can't see client/program I'm looking for"
- Check filters - you may have active filters hiding items
- Check status - inactive/discharged clients hidden by default
- Use search box instead of scrolling

### "Session data doesn't match what I recorded"
- Verify you clicked "Save & Exit" after session recap
- Check if session was interrupted and auto-saved
- Contact system admin if data is persistently incorrect

### "AI recommendation seems wrong"
- AI provides suggestions based on data patterns
- Always apply clinical judgment
- AI cannot see full context - use as one data point among many

---

## Getting Help

**For technical issues:**
- Contact IT support or system administrator

**For clinical questions:**
- Consult with supervising BCBA
- Review program protocols and teaching instructions

**For training:**
- Request demo walkthrough from team lead
- Review this user guide
- Practice with test client data

---

*User Guide Version 1.0*  
*For the most up-to-date information, check the documentation portal*
