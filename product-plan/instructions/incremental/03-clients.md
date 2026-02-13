# Milestone 03: Clients Section

**Goal:** Implement client profile management with program overview and alerts.

---

## What You're Building

The Clients section manages client profiles and provides quick access to their active programs.

**Features:**
- Client selection
- Client dashboard with stats
- Program overview cards
- Alert notifications
- Session frequency tracking

---

## Step 1: Use the Section Prompt

1. **Open** `prompts/section-prompt.md`

2. **Fill in these variables:**
   ```
   SECTION_NAME: clients
   SECTION_ID: 2
   SECTION_TITLE: Client Profiles & Program Management
   NN: 03
   ```

3. **Copy the filled prompt** and paste it into your AI coding agent

---

## Step 2: Review Specifications

- **`product-plan/sections/clients/spec.md`** (6.5 KB)
- **`product-plan/sections/clients/data.json`** (5.8 KB) — 5 clients with programs
- **`product-plan/sections/clients/types.ts`** (2.1 KB)

---

## Step 3: Component Architecture

```
src/sections/clients/
├── ClientsView.tsx                (Client selector + dashboard wrapper)
├── components/
│   ├── ClientDashboard.tsx        (Overview with stats)
│   ├── ProgramCard.tsx            (Program summary card)
│   ├── AlertItem.tsx              (Alert notification)
│   ├── EmptyClientState.tsx       (No client selected)
│   └── index.ts
└── index.ts
```

---

## Step 4: Key Features

### Client Dashboard
- [x] Client avatar and demographics
- [x] Active programs count
- [x] Recent session stats
- [x] Alert notifications
- [x] Program cards with accuracy metrics

### Program Cards
- [x] Program name and type
- [x] Current accuracy percentage
- [x] Sessions this month count
- [x] Mastery status indicator
- [x] Last session date
- [x] Click to navigate to program

### Alert System
- [x] Three alert types:
  - `low_accuracy`: Red badge
  - `overdue_review`: Amber badge
  - `mastery_achieved`: Green badge
- [x] Alert message display
- [x] Dismissible alerts
- [x] Icon indicators

---

## Step 5: Data Loading

```typescript
import clientsData from '../../../product-plan/sections/clients/data.json';
import programsData from '../../../product-plan/sections/programs/data.json';
import type { Client, ClientAlert } from '../../../product-plan/sections/clients/types';

const clients = clientsData.clients as Client[];
const programs = programsData.programs; // For program details
```

---

## Step 6: Styling Guidelines

### Alert Badge Colors
```typescript
const getAlertColor = (severity: string) => {
  const colors: Record<string, string> = {
    'high': 'bg-red-600',
    'medium': 'bg-amber-600',
    'low': 'bg-blue-600',
    'success': 'bg-green-600'
  };
  return colors[severity] || 'bg-gray-600';
};
```

### Accuracy Color Coding
```typescript
const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 90) return 'text-green-600';
  if (accuracy >= 70) return 'text-amber-600';
  return 'text-red-600';
};
```

---

## Step 7: Test the Implementation

### Functional Tests
- [ ] Client dropdown shows all 5 clients
- [ ] Selecting client loads dashboard
- [ ] Program cards display correctly
- [ ] Alerts show with correct colors
- [ ] Accuracy percentages correct
- [ ] Empty state shows when no client selected

### Visual Tests
- [ ] Avatar displays properly
- [ ] Stats cards layout correctly
- [ ] Program cards are responsive
- [ ] Alert styling matches severity
- [ ] Dark mode works

---

## Acceptance Criteria

- [x] Client selection working
- [x] Dashboard displays client info
- [x] Program cards show accurate data
- [x] Alert system operational
- [x] Empty state for no selection
- [x] Zero compilation errors
- [x] Responsive on all breakpoints

---

## Next Steps

✅ **Move to Milestone 04:** Programs Section  
   → `instructions/incremental/04-programs.md`

---

## Reference

- **Spec:** `product-plan/sections/clients/spec.md`
- **Sample Data:** `product-plan/sections/clients/data.json`
- **Types:** `product-plan/sections/clients/types.ts`
