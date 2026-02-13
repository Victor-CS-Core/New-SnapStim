# Milestone 06: Sessions Section

**Goal:** Implement session running UI with trial-by-trial data capture.

---

## What You're Building

The Sessions section handles running therapy sessions and recording trial outcomes.

**Features:**
- Session selection (client + program)
- Live session runner
- Session recap generation
- Session history table

---

## Step 1: Use the Section Prompt

```
SECTION_NAME: sessions
SECTION_ID: 5
SECTION_TITLE: Session Running & Data Capture
NN: 06
```

---

## Step 2: Review Specifications

- **`product-plan/sections/sessions/spec.md`** (15.5 KB) — Largest spec
- **`product-plan/sections/sessions/data.json`** (34 KB) — 5 sessions with 80+ trials
- **`product-plan/sessions/types.ts`** (6 KB)

---

## Step 3: Component Architecture

```
src/sections/sessions/
├── SessionsView.tsx                  (Tab wrapper)
├── components/
│   ├── SessionSelection.tsx          (Pre-session setup)
│   ├── SessionRunner.tsx             (Live trial recording)
│   ├── SessionRecap.tsx              (Post-session summary)
│   ├── SessionHistory.tsx            (Historical data)
│   └── index.ts
└── index.ts
```

---

## Step 4: Key Features

### Session Selection
- [x] Client dropdown
- [x] Program dropdown (filtered by client)
- [x] Therapist selector
- [x] Session notes textarea
- [x] "Start Session" button
- [x] Pre-session checklist

### Session Runner
- [x] Current stimulus display
- [x] Trial counter ("Trial 5 of 20")
- [x] Session timer
- [x] Current accuracy percentage
- [x] Outcome buttons:
  - Correct (green)
  - Incorrect (red)
  - Prompted (amber)
  - No Response (gray)
  - Error (skip)
- [x] Progress bar
- [x] "End Session" button

### Session Recap
- [x] Session summary stats
- [x] Accuracy percentage (large display)
- [x] Trial count
- [x] Duration
- [x] Outcome breakdown (pie chart placeholder)
- [x] Therapist notes
- [x] Recommendations textarea
- [x] "Save" button

### Session History
- [x] Table of past sessions
- [x] Filters:
  - Date range picker
  - Client dropdown
  - Program dropdown
  - Therapist dropdown
- [x] Columns:
  - Date
  - Client
  - Program
  - Therapist
  - Trials
  - Accuracy
  - Duration
- [x] Click row to view recap
- [x] Export button (mock)

---

## Step 5: Trial Outcome Types

```typescript
type TrialOutcome = 
  | 'correct'
  | 'incorrect'
  | 'prompted'
  | 'no_response'
  | 'error';
```

---

## Step 6: Accuracy Calculation

```typescript
const calculateAccuracy = (trials: Trial[]) => {
  const completed = trials.filter(t => 
    t.outcome === 'correct' || t.outcome === 'incorrect'
  );
  const correct = trials.filter(t => t.outcome === 'correct');
  return completed.length > 0 
    ? (correct.length / completed.length * 100).toFixed(1)
    : '0.0';
};
```

---

## Step 7: Test the Implementation

### Functional Tests
- [ ] Tab navigation works
- [ ] Client/program selection filters correctly
- [ ] Session runner displays stimuli
- [ ] Outcome buttons record (mock)
- [ ] Accuracy updates in real-time (mock)
- [ ] Recap displays session data
- [ ] History table shows 5 sessions
- [ ] Filters work on history

### Visual Tests
- [ ] Runner UI is clean and focused
- [ ] Large, touch-friendly outcome buttons
- [ ] Accuracy display prominent
- [ ] Recap summary layout clear
- [ ] History table responsive
- [ ] Tab interface works

---

## Important: Create Textarea Component

You'll need the shadcn/ui Textarea component:

```bash
npx shadcn-ui@latest add textarea
```

Used in SessionRecap for therapist notes.

---

## Acceptance Criteria

- [x] 4 tab interface working
- [x] Session selection complete
- [x] Runner UI functional (mock recording)
- [x] Recap displays correctly
- [x] History table with filters
- [x] Zero compilation errors

---

## Next Steps

✅ **Move to Milestone 07:** Reporting Section  
   → `instructions/incremental/07-reporting.md`

---

## Reference

- **Spec:** `product-plan/sections/sessions/spec.md`
- **Sample Data:** `product-plan/sections/sessions/data.json`
- **Types:** `product-plan/sections/sessions/types.ts`
