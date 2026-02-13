# Milestone 05: Review Section

**Goal:** Implement human-in-the-loop review workflow for AI-generated content.

---

## What You're Building

The Review section allows users to approve, reject, or regenerate AI-generated stimuli before use.

**Features:**
- Review queue with filters
- Enlarge/inspect modal
- Regenerate functionality (mock)
- Batch approval
- Review analytics

---

## Step 1: Use the Section Prompt

```
SECTION_NAME: review
SECTION_ID: 4
SECTION_TITLE: Human-in-the-Loop Review
NN: 05
```

---

## Step 2: Review Specifications

- **`product-plan/sections/review/spec.md`** (8.85 KB)
- **`product-plan/sections/review/data.json`** (12.69 KB) — 15 review items
- **`product-plan/sections/review/types.ts`** (3.11 KB)

---

## Step 3: Component Architecture

```
src/sections/review/
├── ReviewView.tsx                    (Main wrapper)
├── components/
│   ├── ReviewQueue.tsx               (Queue with filters)
│   ├── StimulusDetailModal.tsx       (Enlarge view)
│   ├── BatchReviewModal.tsx          (Multi-select)
│   ├── ReviewAnalytics.tsx           (Stats dashboard)
│   └── index.ts
└── index.ts
```

---

## Step 4: Key Features

### Review Queue
- [x] Grid of review items
- [x] Filter by status (pending, approved, rejected, needs_regeneration)
- [x] Filter by type (text, image, both)
- [x] Checkbox for batch selection
- [x] Quick approve/reject buttons
- [x] "View Details" button

### Stimulus Detail Modal
- [x] Large image display
- [x] Target text display
- [x] Metadata (program, type, generated date)
- [x] Action buttons:
  - Approve (green)
  - Reject (red)
  - Regenerate (amber)
  - Edit (blue)
- [x] Keyboard shortcuts (A for approve, R for reject)

### Batch Review
- [x] Select multiple items
- [x] Batch approve all
- [x] Batch reject all
- [x] Confirmation dialog
- [x] Progress indicator

### Review Analytics
- [x] Total items reviewed
- [x] Approval rate percentage
- [x] Average review time
- [x] Pending count
- [x] Charts (placeholder for now)

---

## Step 5: Status Badge Colors

```typescript
const getStatusBadge = (status: string) => {
  const variants = {
    'pending': { color: 'bg-blue-600', label: 'Pending' },
    'approved': { color: 'bg-green-600', label: 'Approved' },
    'rejected': { color: 'bg-red-600', label: 'Rejected' },
    'needs_regeneration': { color: 'bg-amber-600', label: 'Needs Regen' }
  };
  return variants[status];
};
```

---

## Step 6: Test the Implementation

### Functional Tests
- [ ] Queue displays 15 review items
- [ ] Filters work (status, type)
- [ ] Click item opens detail modal
- [ ] Approve/reject changes status (mock)
- [ ] Batch selection works
- [ ] Analytics display correctly

### Visual Tests
- [ ] Grid layout responsive
- [ ] Images display at proper size
- [ ] Modal overlay correct
- [ ] Batch actions UI clear
- [ ] Analytics cards styled

---

## Acceptance Criteria

- [x] Review queue operational
- [x] Detail modal with actions
- [x] Batch review workflow
- [x] Analytics dashboard
- [x] Status badges correct
- [x] Zero compilation errors

---

## Next Steps

✅ **Move to Milestone 06:** Sessions Section  
   → `instructions/incremental/06-sessions.md`

---

## Reference

- **Spec:** `product-plan/sections/review/spec.md`
- **Sample Data:** `product-plan/sections/review/data.json`
- **Types:** `product-plan/sections/review/types.ts`
