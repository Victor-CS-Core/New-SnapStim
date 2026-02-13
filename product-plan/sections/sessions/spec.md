# Sessions Section — Specification

## Overview

The Sessions section provides the interface for running ABA programs during therapy sessions. It guides therapists (BCBAs and RBTs) through a structured trial flow, captures performance data in real-time, applies configured rerun policies, and generates session recaps. The interface works offline and syncs data when connectivity is restored.

---

## Views

### Session Selection

**Purpose:** Choose a client and program to begin a session.

**Layout:**

- Header: "Start Session" with role badge
- Client selector:
  - Dropdown or search to select client
  - Shows client photo, name, and active program count
- Program list for selected client:
  - Program cards showing:
    - Program name and type badge
    - Target count
    - Last session date and performance
    - "Start Session" button
  - Filter by program status (active/paused)
- Recent sessions panel (sidebar):
  - Last 5 completed sessions
  - Quick resume for interrupted sessions

**Interactions:**

- Select client → Programs list updates
- Click "Start Session" → Loads Session Runner view
- Click recent session → View session recap

---

### Session Runner

**Purpose:** Execute trials for a selected program, record outcomes in real-time.

**Layout:**

**Header Bar (Persistent):**

- Client name and photo (left)
- Program name and type (center)
- Timer showing session duration
- Pause/End Session buttons (right)
- Progress indicator: Trial X of Y completed

**Main Content Area:**

- **Large Stimulus Display:**
  - Full-screen image or text stimulus
  - Clear, uncluttered presentation
  - Zoom controls for images
  - "Play audio" button (if applicable)
  
- **Trial Instructions Card (above stimulus):**
  - Teaching instruction or SD (discriminative stimulus)
  - Target response expected
  - Program-specific prompts

- **Response Recording Panel (below stimulus):**
  - Large buttons for recording:
    - ✓ Correct (green)
    - ✗ Incorrect (red)
    - ⊘ No Response (gray)
    - ⊙ Prompted (amber)
  - Keyboard shortcuts displayed: C / I / N / P
  - Previous trial indicator with undo option

**Side Panel (Collapsible):**

- Current session summary:
  - Correct: X
  - Incorrect: Y
  - No Response: Z
  - Accuracy: XX%
- Notes button (quick session notes)
- Skip stimulus button (if applicable)

**Rerun Policy Indicator:**

- Visual cue when rerun policy activates
- Message: "This stimulus will be repeated due to incorrect response"
- Position in trial queue updates

**Offline Indicator:**

- Small badge in corner showing offline status
- "Data will sync when online"

**Flow:**

1. Session starts → First stimulus loads
2. Therapist presents stimulus to learner
3. Therapist records response (button or keyboard)
4. System applies rerun policy if needed
5. Next stimulus loads automatically
6. Repeat until all trials completed or session ended

**Keyboard Shortcuts:**

- `C` → Correct
- `I` → Incorrect
- `N` → No Response
- `P` → Prompted
- `Space` → Next trial (after response recorded)
- `U` → Undo last trial
- `Esc` → Pause session

---

### Session Recap

**Purpose:** Summary of completed session with performance data and next steps.

**Layout:**

**Header:**

- "Session Complete" with checkmark icon
- Client name and program name
- Session date and duration
- Close button

**Performance Summary (Top Cards):**

- Total Trials: X
- Correct: X (XX%)
- Incorrect: X (XX%)
- No Response: X (XX%)
- Prompted: X (XX%)
- Overall Accuracy: XX%

**Detailed Trial List:**

- Table showing each trial:
  - Trial #
  - Stimulus text/thumbnail
  - Response (✓/✗/⊘/⊙)
  - Timestamp
  - Notes (if any)
- Color-coded rows by response type
- Sortable and filterable

**Session Notes:**

- Free-text area for therapist observations
- Pre-filled prompts: "Learner motivation:", "Environmental factors:", "Recommendations:"

**Mastery Status (if applicable):**

- Progress toward mastery criterion
- "X of Y consecutive correct needed"
- Visual progress bar

**Actions:**

- "Save & Exit" button (primary)
- "Print Recap" button
- "Start Another Session" button
- "View Historical Data" link

**Auto-save:**

- Session data auto-saves every 5 seconds
- "Last saved: X seconds ago" indicator

---

### Session History

**Purpose:** View past session data and trends for a program.

**Layout:**

**Header:**

- Program name and type
- Client name
- Date range selector

**Sessions List:**

- Chronological list of sessions:
  - Session date and duration
  - Total trials and accuracy %
  - Quick stats: Correct/Incorrect/No Response counts
  - "View Recap" button
  - Sync status indicator (synced/pending)

**Data Visualization:**

- Line graph showing accuracy % over time
- Bar chart showing response type distribution
- Mastery progress indicator
- Trend analysis: "Accuracy improved by 15% over last 5 sessions"

**Filters:**

- Date range (last 7 days, 30 days, 90 days, all time)
- Session type (teaching vs. generalization)
- Response type (show only correct, incorrect, etc.)

---

## User Flows

### Running a Session

1. Therapist navigates to Sessions section
2. Selects client from dropdown
3. Views list of active programs
4. Clicks "Start Session" on target program
5. Session Runner loads with first stimulus
6. For each trial:
   - Therapist presents stimulus to learner
   - Records learner's response (correct/incorrect/no response/prompted)
   - System automatically loads next stimulus
   - Rerun policy applies if configured
7. Session continues until all trials completed or therapist ends session
8. Session Recap displays with performance summary
9. Therapist adds session notes
10. Saves and exits

### Handling Interruptions

1. During session, therapist clicks "Pause"
2. Session state saved locally
3. Therapist can return later
4. "Resume Session" option appears in Recent Sessions panel
5. Click to resume → Returns to exact trial position
6. Continue session flow

### Offline Session

1. Therapist starts session while offline
2. Offline indicator appears
3. Session runs normally
4. All data saved to local storage
5. When connectivity restored:
   - Sync indicator shows "Syncing..."
   - Data uploads to server
   - Sync indicator shows "Synced ✓"

---

## UI Requirements

### Session Runner Interface

- **Large, Touch-Friendly Buttons:** Response buttons must be easily tappable on tablets (minimum 60px height)
- **Clear Visual Feedback:** Immediate visual confirmation when response recorded (button animation, color change)
- **Minimal Distractions:** Hide unnecessary UI during trial to maintain learner focus
- **Quick Access Controls:** Pause, Undo, and Skip always visible but unobtrusive
- **Auto-Advance:** Automatically load next stimulus after response recorded (configurable delay: 0.5-2s)
- **Progress Indication:** Always show current trial position and completion percentage

### Performance & Responsiveness

- **Fast Stimulus Loading:** Preload next 3 stimuli to eliminate loading delays
- **Instant Response Recording:** < 100ms latency from button press to feedback
- **Smooth Transitions:** Animate stimulus changes smoothly (200-300ms fade)
- **Offline-First:** All session data stored locally first, synced later
- **Background Sync:** Sync queue processes uploads without blocking UI

### Accessibility

- **Keyboard Navigation:** Full keyboard support for all actions during session
- **Screen Reader Support:** Announce trial progress and response recording
- **High Contrast Mode:** Ensure response buttons have strong contrast ratios
- **Focus Indicators:** Clear focus states for keyboard navigation
- **Font Sizing:** Support larger text for stimulus display (accessibility setting)

---

## Data Requirements

### Session Entity

```typescript
{
  session_id: string            // unique identifier
  client_id: string            // reference to client
  program_id: string           // reference to program
  therapist_id: string         // BCBA or RBT conducting session
  start_time: string           // ISO timestamp
  end_time: string | null      // ISO timestamp (null if in progress)
  duration_seconds: number     // calculated duration
  status: 'in_progress' | 'completed' | 'paused' | 'abandoned'
  session_type: 'teaching' | 'generalization'
  trials: Trial[]              // array of trial records
  notes: string                // therapist observations
  mastery_status: {
    current_streak: number     // consecutive correct trials
    mastery_met: boolean       // true if criterion reached
    mastery_date: string | null // when mastery achieved
  }
  offline_session: boolean     // true if conducted offline
  sync_status: 'synced' | 'pending' | 'error'
  sync_timestamp: string | null // when synced to server
}
```

### Trial Entity

```typescript
{
  trial_id: string             // unique identifier
  session_id: string           // parent session reference
  trial_number: number         // position in session (1-indexed)
  stimulus_id: string          // reference to stimulus
  stimulus_text: string        // for quick display
  stimulus_image_url: string | null
  teaching_instruction: string // SD presented
  response: 'correct' | 'incorrect' | 'no_response' | 'prompted'
  timestamp: string            // ISO timestamp
  response_time_ms: number | null // time from presentation to response
  rerun_triggered: boolean     // true if rerun policy applied
  notes: string                // trial-specific notes
}
```

### Session Summary (Computed)

- Total trials
- Response counts by type (correct/incorrect/no_response/prompted)
- Accuracy percentage
- Average response time
- Mastery progress
- Session duration

---

## Edge Cases & Error Handling

### Session Interruption

- **Battery dies:** Auto-save every 5 seconds ensures minimal data loss
- **App crash:** Local storage preserves session state for recovery
- **User navigates away:** Prompt "Session in progress. Save before leaving?"
- **Recovery flow:** "Resume Session" button in Session Selection view

### Offline Scenarios

- **Start session offline:** All session data stored locally, synced later
- **Lose connection mid-session:** Session continues uninterrupted, offline indicator appears
- **Sync failures:** Retry queue with exponential backoff, manual retry option
- **Conflict resolution:** Server timestamp wins if conflicting sessions

### Data Integrity

- **Duplicate response recording:** Debounce response buttons (300ms) to prevent accidental double-taps
- **Missing stimuli:** Show error "Stimulus not available" with skip option
- **Invalid data:** Validate trial data before saving (required fields present)

### Performance Issues

- **Slow stimulus loading:** Show loading spinner, timeout after 5s with skip option
- **Memory constraints:** Limit session to 200 trials maximum, suggest ending session
- **Storage full:** Alert "Local storage full. Sync required before continuing."

---

## Validation & Business Rules

### Session Requirements

- Must have valid client_id and program_id
- Therapist must have permission to run sessions with client
- Program must have at least 1 active stimulus
- Session cannot exceed 4 hours duration (alert at 3.5 hours)

### Trial Requirements

- Must record response before advancing (cannot skip trial without response)
- Timestamp must be within session start/end window
- Rerun policy applies only to incorrect/no_response (not prompted)

### Mastery Criteria

- Configurable per program: "X consecutive correct trials" or "X% accuracy over Y trials"
- Mastery status calculated in real-time during session
- Alert when mastery achieved with celebration animation

### Data Sync Rules

- Sync priority: Critical data (trial responses) syncs first
- Session notes and metadata sync second
- Failed syncs retry up to 3 times before marking as error
- Sync status visible in Session History

---

## Accessibility Features

- **Keyboard Shortcuts:** All actions accessible via keyboard (C/I/N/P for responses)
- **Screen Reader Announcements:** Trial progress, response recorded, session complete
- **High Contrast Mode:** Strong color differentiation for response buttons
- **Focus Management:** Logical tab order, focus returns to response buttons after recording
- **Touch Targets:** Minimum 44x44px touch targets for all interactive elements
- **Reduced Motion:** Option to disable animations for users sensitive to motion

---

## Performance Considerations

- **Preloading:** Preload next 3 stimuli images to eliminate loading delays
- **Local Storage:** Store session data locally first, sync asynchronously
- **Lazy Loading:** Load session history on demand, paginate for large datasets
- **Image Optimization:** Compress stimulus images, lazy load thumbnails in history
- **Background Processes:** Sync queue runs in background without blocking UI
- **Memory Management:** Clear old session data from memory after sync

---

## Success Metrics

- **Session Completion Rate:** > 95% of started sessions reach Session Recap
- **Data Accuracy:** Zero data loss incidents, 100% sync success rate
- **Response Recording Speed:** < 100ms from button press to feedback
- **Offline Reliability:** All offline sessions sync successfully when online
- **User Efficiency:** Average time per trial < 10 seconds
- **Session Duration:** Average session 15-30 minutes (appropriate length for learners)

---

## Configuration Options

### Program-Level Settings

- **Auto-Advance Delay:** 0.5s, 1s, 1.5s, 2s (time before next stimulus loads)
- **Rerun Policy:** Immediate rerun, end-of-session rerun, no rerun
- **Mastery Criterion:** X consecutive correct or X% accuracy over Y trials
- **Session Type:** Teaching or Generalization
- **Max Trials Per Session:** 20, 50, 100, 200 (prevent overly long sessions)

### User Preferences

- **Keyboard Shortcuts:** Enabled/Disabled
- **Audio Feedback:** Play sound on response recorded
- **Haptic Feedback:** Vibrate on touch (mobile/tablet)
- **Theme:** Light/Dark mode for Session Runner
- **Response Button Layout:** Horizontal or Vertical

---

## Integration Points

- **Programs Section:** Load program configuration (rerun policy, mastery criteria, stimuli list)
- **Clients Section:** Fetch client data (name, photo, assigned programs)
- **Review Section:** Newly approved stimuli immediately available for sessions
- **Reporting Section:** Session data feeds into reports, graphs, and exports
- **Sync Service:** Background sync with conflict resolution and retry logic

---

## Future Enhancements

- **Video Recording:** Record session video for review and supervision
- **Real-Time Collaboration:** Supervisor can view session progress remotely
- **AI Assistance:** Suggest response based on learner behavior patterns
- **Voice Control:** Voice commands for response recording (hands-free)
- **Adaptive Trials:** AI adjusts difficulty based on real-time performance
- **Virtual Tokens:** On-screen token economy for motivation
