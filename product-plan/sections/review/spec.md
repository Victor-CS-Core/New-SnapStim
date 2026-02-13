# Review Section — Specification

## Overview

The Review section provides a human-in-the-loop workflow where BCBAs review AI-generated stimuli and images before they are approved for use in programs. This ensures quality control and allows for regeneration of any items that don't meet clinical standards. Only BCBAs have access to this section.

---

## Views

### Review Queue

**Purpose:** Display all pending stimuli awaiting review, with filtering and bulk actions.

**Layout:**

- Header with "Review Queue" title and pending count badge
- Filter bar:
  - Status filter: All / Pending / Approved / Rejected
  - Program filter: Dropdown to filter by specific program
  - Type filter: Text only / Images / Both
  - Date range: When stimuli were generated
- Bulk action toolbar (appears when items selected):
  - Select all checkbox
  - "Approve Selected" button
  - "Reject Selected" button
  - Count of selected items
- Grid/list view of stimulus cards:
  - Checkbox for selection
  - Image thumbnail (if applicable)
  - Stimulus text
  - Program name badge
  - Generation date
  - Confidence score indicator
  - Quick actions: View, Approve, Reject

**States:**

- Empty: "No stimuli pending review. All generated content has been reviewed!"
- Loading: Skeleton cards while data loads
- Filtered: Active filter chips with clear buttons
- Bulk selection: Highlighted cards with action toolbar

**User Roles:**

- BCBA: Full access to review queue
- RBT: No access (redirected)
- Caregiver: No access (redirected)

---

### Stimulus Detail Modal

**Purpose:** Enlarged view for detailed inspection and review decision.

**Layout:**

**Header:**

- Program name and type
- Generation timestamp
- Close button

**Main Content:**

- Large image preview (if applicable) with zoom controls
  - Zoom in/out buttons
  - Pan functionality
  - Full screen option
- Stimulus text (large, readable font)
- Confidence score with visual indicator (color-coded bar)
- Generation metadata:
  - AI model used
  - Prompt that generated the stimulus
  - Generation parameters

**Side Panel (Contextual Info):**

- Program details:
  - Program name (clickable to program detail)
  - Client name
  - Program type
  - Category
- Related stimuli count:
  - Total generated in this batch
  - Already approved: X
  - Already rejected: Y
  - Remaining: Z
- Quality indicators:
  - Resolution (for images)
  - Clarity score
  - Relevance to program type

**Rejection Feedback (if rejecting):**

- Reason dropdown:
  - Image quality issues
  - Incorrect content
  - Not age-appropriate
  - Too complex
  - Too simple
  - Copyright concerns
  - Other
- Additional notes (textarea)
- "Regenerate similar" checkbox (creates new generation request)

**Review History (if previously reviewed):**

- Show if this stimulus was rejected before
- Previous rejection reasons
- Regeneration count

**Action Buttons:**

- "Approve" (primary action, green)
- "Reject" (secondary action, with feedback form)
- "Regenerate" (create new version based on feedback)
- "Skip" (close modal, no action taken)

---

### Batch Review Workflow

**Purpose:** Efficiently review multiple stimuli from the same generation batch.

**Layout:**

- Large preview area showing current stimulus
- Thumbnail strip at bottom showing:
  - All stimuli in the batch
  - Current position indicator
  - Status badges (pending/approved/rejected)
  - Navigation arrows
- Keyboard shortcuts displayed in corner:
  - `→` Next stimulus
  - `←` Previous stimulus
  - `A` Approve
  - `R` Reject
  - `ESC` Exit batch review
- Progress indicator: "3 of 12 reviewed"
- Quick decision buttons (large, easy to click):
  - Approve (with keyboard shortcut badge)
  - Reject (opens mini feedback form)
  - Skip (move to next without action)

**Flow:**

1. User clicks "Review Batch" from queue
2. Modal opens with first pending stimulus
3. User makes decision (keyboard or click)
4. Auto-advances to next pending stimulus
5. Skips already-reviewed items
6. Shows completion message when batch is done
7. Returns to queue with updated counts

---

### Review Analytics Dashboard

**Purpose:** Track review activity and quality metrics.

**Layout:**

**Summary Cards:**

- Total stimuli generated (all time)
- Pending review count (urgent if > 50)
- Approval rate percentage
- Average review time per stimulus

**Charts:**

- Approval rate by program type (bar chart)
- Review volume over time (line chart)
- Rejection reasons breakdown (pie chart)
- Generation quality trends (line chart showing avg confidence scores)

**Recent Activity Table:**

- Last 20 review actions
- Columns: Timestamp, Reviewer, Stimulus, Program, Decision, Time taken
- Sortable and filterable

**Program Performance:**

- List of programs ranked by:
  - Lowest approval rate (need attention)
  - Highest rejection rate
  - Most regenerations needed
- Clickable to view program details

---

## Data Requirements

**Stimulus fields (extends from programs section):**

- stimulus_id (unique)
- program_id (foreign key)
- stimulus_text (string)
- image_url (string, optional)
- review_status (enum: pending, approved, rejected)
- generation_metadata:
  - model (string)
  - prompt (string)
  - confidence_score (number, 0-1)
  - generation_date (timestamp)
  - batch_id (string, groups related stimuli)
- review_data:
  - reviewed_by (user_id)
  - reviewed_date (timestamp)
  - rejection_reason (string, optional)
  - rejection_notes (text, optional)
  - review_duration_seconds (number)
  - regeneration_requested (boolean)
- regeneration_history:
  - regeneration_count (number)
  - previous_versions (array of stimulus_ids)
  - improvement_notes (array of strings)

**Review action:**

- action_id (unique)
- stimulus_id (foreign key)
- reviewer_id (user_id)
- action_type (enum: approve, reject, regenerate)
- timestamp (timestamp)
- rejection_reason (string, optional)
- rejection_notes (text, optional)
- time_spent_seconds (number)

---

## User Interactions

**BCBA Actions:**

- View review queue
- Filter and search stimuli
- Select multiple stimuli for bulk actions
- View stimulus detail with zoom
- Approve stimuli (individually or bulk)
- Reject stimuli with feedback
- Request regeneration
- View batch of related stimuli
- Navigate batch with keyboard shortcuts
- View review analytics
- Export review reports

**System Actions:**

- Auto-sort queue by priority (confidence score, age, program urgency)
- Track review time per stimulus
- Notify BCBA when new stimuli are generated
- Mark approved stimuli as "ready to use"
- Trigger regeneration when requested
- Archive rejected stimuli
- Update program stimulus counts
- Generate review analytics

---

## Validation Rules

- At least one decision per stimulus (approve/reject/regenerate)
- Rejection reason required when rejecting
- Cannot approve and reject simultaneously
- Regeneration requires rejection reason
- Bulk actions limited to 50 items at once
- Review time must be > 0 seconds (no instant approvals)

---

## Edge Cases

- **No pending stimuli:** Show empty state with suggestion to generate more
- **Stimulus image fails to load:** Show placeholder with "Image unavailable" message
- **Batch contains mix of pending/reviewed:** Skip already-reviewed items automatically
- **BCBA closes modal mid-review:** Save draft decision state, ask to confirm when reopening
- **Simultaneous reviews:** Lock stimulus when one BCBA is reviewing to prevent conflicts
- **Program deleted after generation:** Mark stimuli as orphaned, allow review but note program no longer exists
- **Very large batch (>100 stimuli):** Paginate batch review to avoid performance issues
- **Regeneration fails:** Show error message, allow manual retry or manual entry
- **Low confidence score (<0.5):** Show warning badge, suggest extra scrutiny

---

## Accessibility Features

- Keyboard navigation through entire review workflow
- Screen reader announcements for status changes
- High contrast mode for image review
- Adjustable zoom levels (100%, 150%, 200%, 300%)
- Alt text display for images
- Focus indicators on all interactive elements
- Keyboard shortcuts overlay (accessible via `?` key)

---

## Performance Considerations

- Lazy load images (thumbnail first, full resolution on demand)
- Paginate review queue (20 items per page)
- Cache reviewed stimuli for 24 hours
- Prefetch next few stimuli in batch review
- Debounce search/filter actions
- Background sync for review actions (optimistic UI updates)

---

## Success Metrics

- Average review time per stimulus: < 30 seconds
- Approval rate: > 75%
- Time to review all pending stimuli: < 1 hour daily
- Regeneration success rate: > 85% approved on second attempt
- BCBA satisfaction with review workflow: > 4/5 stars
