# Programs Section — Specification

## Overview

The Programs section enables BCBAs to create, configure, and manage ABA skill-acquisition programs. Programs are assigned to clients and define what skills to teach, how to teach them, and how to measure progress. The section includes AI-powered stimulus generation that automatically creates targets and images based on program configuration.

---

## Views

### Program List

**Purpose:** Display all programs with filtering, searching, and quick status overview.

**Layout:**

- Header with "Create Program" button (BCBA only)
- Filter bar: Status (Active/Paused/Mastered/Archived), Program Type, Client, Created Date
- Search box: Search by program name, client name, or category
- Table/card grid showing programs with:
  - Program name and type badge
  - Client name (clickable to client dashboard)
  - Status badge with color coding
  - Performance summary (accuracy %, trials count)
  - Last run date
  - Quick actions: View, Edit, Pause/Resume, Archive

**States:**

- Empty: "No programs yet. Create your first program to get started."
- Loading: Skeleton cards while data loads
- Filtered: Shows active filter chips with clear buttons

**User Roles:**

- BCBA: Full access - create, edit, view all programs
- RBT: View only - see assigned programs, cannot edit
- Caregiver: View only - see limited programs for their clients

---

### Program Creation Wizard

**Purpose:** Step-by-step wizard to create a new program with AI assistance.

**Step 1: Basic Information**

- Program name (text input)
- Client selection (dropdown with search)
- Program type (4 options, see below)
- Category/skill area (text input or dropdown)
- Description (textarea)

**Step 2: Configuration**

- Mode selection: Teaching vs. Generalization
  - Teaching: Focus on acquisition with more prompting
  - Generalization: Test skill transfer to new contexts
- Mastery criteria: Threshold percentage (default 80%)
- Number of consecutive sessions needed for mastery (default 3)
- Teaching instructions (rich text editor with formatting)

**Step 3: Stimulus Generation (AI-powered)**

- Number of stimuli to generate (slider, 5-20)
- Generation mode:
  - Text-only: Generate text targets only
  - Text + Images: Generate text targets with corresponding images
- Additional context/constraints (textarea for AI guidance)
- Preview button to show sample generations

**Step 4: Configure Rerun Policy**

- Error correction: Immediate rerun on incorrect response
- Mastery maintenance: Continue running after mastery achieved
- Trial count: Fixed number of trials per session
- Time-based: Run for specific duration

**Step 5: Review & Create**

- Summary of all settings
- Option to generate stimuli now or later
- Create button finalizes program

**Program Types:**

1. **Receptive Identification** - "Touch the X" or "Find the Y"
2. **Expressive Labeling** - "What is this?" (verbal or sign response)
3. **Intraverbal Fill-in** - "You eat with a \_\_\_" (completing sentences)
4. **Listener Responding** - Following multi-step instructions

---

### Program Detail View

**Purpose:** View complete program configuration, manage stimuli, and monitor performance.

**Layout:**

**Header Section:**

- Program name and edit button
- Client badge (clickable)
- Status dropdown (Active/Paused/Archived)
- Delete button (with confirmation)

**Tabs:**

**1. Overview Tab**

- Program configuration summary
- Teaching instructions (collapsible)
- Performance metrics:
  - Total trials run
  - Current accuracy percentage
  - Trend indicator (improving/stable/declining)
  - Consecutive mastery sessions
  - Progress toward mastery
- Recent activity timeline (last 10 sessions)
- Quick action: "Start Session" button

**2. Stimuli Tab**

- Grid/list view toggle
- "Generate More Stimuli" button (opens AI generation modal)
- Stimulus cards showing:
  - Stimulus text/label
  - Image thumbnail (if applicable)
  - Review status (Pending/Approved/Rejected)
  - Trial count and accuracy for this stimulus
  - Edit, Delete, Regenerate buttons
- Empty state: "No stimuli generated yet. Click 'Generate Stimuli' to get started."
- For pending stimuli: "Review Pending" badge with link to Review section

**3. Sessions Tab**

- List of all sessions run for this program
- Session cards showing:
  - Date and time
  - Run by (user name and role badge)
  - Duration and trial count
  - Accuracy percentage
  - Outcome badge (Success/Partial/Incomplete)
  - View button (opens session recap)
- Filter by date range, user, outcome

**4. Comments Tab**

- Threaded comment system for team communication
- Comment visibility rules:
  - BCBA comments: Visible to all
  - RBT comments: Visible to BCBAs and other RBTs
  - Caregiver comments: Visible only to BCBAs
- Add comment box (rich text)
- Comment cards showing:
  - Author, role, timestamp
  - Comment text
  - Reply button (nested threads)

**5. Settings Tab**

- Edit all program configuration
- Rerun policy settings
- Mastery criteria adjustments
- Danger zone: Archive or delete program

---

### Stimulus Generation Modal (AI-powered)

**Purpose:** Generate new stimuli for a program using AI.

**Layout:**

- Context banner: Shows program name and type
- "How many stimuli?" - Number input (default 10)
- "Generation type" - Toggle: Text only / Text + Images
- "Additional guidance" - Textarea for specific instructions
  - Placeholder examples:
    - "Focus on common household items"
    - "Use simple vocabulary, avoid abstract concepts"
    - "Include diverse representation in images"
- Preview section:
  - "Generate Preview" button
  - Shows 3 sample stimuli to verify quality before full generation
- "Generate All" button (primary action)
- Cancel button

**AI Generation Process:**

- Loading state: "Generating stimuli... This may take 30-60 seconds"
- Progress indicator (number generated / total)
- On completion:
  - Success message: "Generated 10 stimuli successfully"
  - Auto-redirect to Review section for approval
  - Or: "Add to program without review" button (for BCBAs who want to skip review)

---

## Data Requirements

**Program fields:**

- program_id (unique)
- program_name (string)
- client_id (foreign key)
- program_type (enum: receptive_identification, expressive_labeling, intraverbal, listener_responding)
- category (string)
- description (text)
- mode (enum: teaching, generalization)
- status (enum: active, paused, mastered, archived)
- mastery_threshold (number, 0-100)
- consecutive_sessions_for_mastery (number)
- teaching_instructions (rich text)
- rerun_policy (object with settings)
- created_by (user_id)
- created_date (timestamp)
- last_modified_date (timestamp)
- last_run_date (timestamp)

**Stimulus fields:**

- stimulus_id (unique)
- program_id (foreign key)
- stimulus_text (string)
- image_url (string, optional)
- review_status (enum: pending, approved, rejected)
- generation_metadata (object with AI generation details)
- created_date (timestamp)
- reviewed_by (user_id, optional)
- reviewed_date (timestamp, optional)

**Performance aggregates:**

- total_trials (computed from sessions)
- correct_trials (computed from sessions)
- accuracy_percent (computed)
- trend (computed: improving/stable/declining based on recent sessions)
- consecutive_mastery_sessions (computed)

---

## User Interactions

**BCBA Actions:**

- Create new programs
- Edit program configuration
- Generate stimuli (triggers AI)
- Review and approve stimuli
- Pause/resume programs
- Archive completed programs
- Delete programs (with confirmation)
- Add comments (visible to all)
- Change program status

**RBT Actions:**

- View program details
- See approved stimuli only
- Run sessions (navigates to Sessions section)
- Add comments (visible to BCBAs and RBTs)
- View session history

**Caregiver Actions:**

- View assigned program details only
- See approved stimuli only
- Run sessions (navigates to Sessions section)
- Add comments (visible to BCBAs only)

---

## Validation Rules

- Program name: Required, 3-100 characters
- Client selection: Required
- Program type: Required
- Mastery threshold: Required, 50-100%
- Consecutive sessions: Required, 1-10
- Teaching instructions: Optional, max 2000 characters
- At least 5 approved stimuli required before program can be set to Active status

---

## Edge Cases

- **No client selected:** Disable program creation
- **Duplicate program names:** Allow but show warning "A program with this name already exists for this client"
- **AI generation fails:** Show error message with retry option, allow manual stimulus entry
- **All stimuli rejected:** Show warning "This program has no approved stimuli. Generate or add stimuli before running sessions."
- **Program deleted with active sessions:** Soft delete - archive program but preserve session history
- **Client discharged:** Auto-archive all programs for that client

---

## Success Metrics

- Time to create a program: < 5 minutes
- AI stimulus generation success rate: > 90%
- Programs per client: Average 3-5
- Active program completion rate: Track how many reach mastery
