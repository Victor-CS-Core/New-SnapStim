# Milestone 04: Programs Section

**Goal:** Implement program creation and stimulus generation UI.

---

## What You're Building

The Programs section handles ABA program creation with AI-powered stimulus generation.

**Features:**
- Program list with filtering
- Program detail view
- Program creation wizard
- Stimulus management
- 4 program types support

---

## Step 1: Use the Section Prompt

Fill in variables and use the section prompt template:

```
SECTION_NAME: programs
SECTION_ID: 3
SECTION_TITLE: Program Creation & Stimulus Generation
NN: 04
```

---

## Step 2: Review Specifications

- **`product-plan/sections/programs/spec.md`** (10.8 KB) — Most detailed spec
- **`product-plan/sections/programs/data.json`** (9.8 KB) — 10 programs, 20 stimuli
- **`product-plan/sections/programs/types.ts`** (4.8 KB) — Complex types

---

## Step 3: Component Architecture

```
src/sections/programs/
├── ProgramsView.tsx              (List with filters)
├── components/
│   ├── ProgramList.tsx           (Table view)
│   ├── ProgramDetail.tsx         (Full program display)
│   ├── ProgramWizard.tsx         (Step-by-step creation)
│   ├── StimulusModal.tsx         (Edit individual stimulus)
│   └── index.ts
└── index.ts
```

---

## Step 4: Key Features

### Program Types
```typescript
type ProgramType = 
  | 'receptive_identification'
  | 'expressive_identification'
  | 'motor_imitation'
  | 'intraverbal';
```

### Program List
- [x] Filter by type and status
- [x] Search by name
- [x] Status badges (active, draft, completed, archived)
- [x] Accuracy display
- [x] Mastery indicator

### Program Wizard
- [x] Step 1: Basic info (name, type, client)
- [x] Step 2: Settings (mode, mastery criteria, rerun policy)
- [x] Step 3: Targets (add/remove targets)
- [x] Step 4: Review and save
- [x] Back/Next navigation
- [x] Progress indicator

### Stimulus Display
- [x] Target text
- [x] Image thumbnail (if has image_url)
- [x] Status badge
- [x] Edit button
- [x] Approval status

---

## Step 5: Mastery Criteria UI

```typescript
interface MasteryCriteria {
  sessions_required: number;
  accuracy_threshold: number;
  consecutive_sessions: boolean;
}

// Display as: "3 sessions at 90% accuracy"
```

---

## Step 6: Rerun Policy Options

```typescript
type RerunPolicy = 'fixed_count' | 'until_independent' | 'never';

// UI: Radio buttons with descriptions
// - fixed_count: "Rerun incorrect items 2x"
// - until_independent: "Rerun until correct"
// - never: "No reruns"
```

---

## Step 7: Test the Implementation

### Functional Tests
- [ ] Program list displays 10 programs
- [ ] Filters work (type, status)
- [ ] Search filters by name
- [ ] Program detail shows stimuli
- [ ] Wizard creates program (mock)
- [ ] Stimulus modal displays

### Visual Tests
- [ ] Program cards layout correctly
- [ ] Wizard steps show progress
- [ ] Stimulus images display
- [ ] Type badges colored correctly
- [ ] Status indicators clear

---

## Acceptance Criteria

- [x] All 4 program types supported
- [x] Program list with filters
- [x] Detail view with stimuli
- [x] Wizard UI complete (mock save)
- [x] Stimulus editing modal
- [x] Zero compilation errors

---

## Next Steps

✅ **Move to Milestone 05:** Review Section  
   → `instructions/incremental/05-review.md`

---

## Reference

- **Spec:** `product-plan/sections/programs/spec.md`
- **Sample Data:** `product-plan/sections/programs/data.json`
- **Types:** `product-plan/sections/programs/types.ts`
