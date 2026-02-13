# Milestone 07: Reporting Section

**Goal:** Implement communication, reporting, and data visualization features.

---

## What You're Building

The Reporting section provides:
- Threaded comments with role-based visibility
- Progress report generation
- Data visualization dashboard
- Export center with scheduled jobs

**This is the final and most comprehensive section.**

---

## Step 1: Use the Section Prompt

```
SECTION_NAME: reporting
SECTION_ID: 6
SECTION_TITLE: Communication & Reporting
NN: 07
```

---

## Step 2: Review Specifications

- **`product-plan/sections/reporting/spec.md`** (15.6 KB) — Very detailed
- **`product-plan/sections/reporting/data.json`** (16.5 KB) — Rich sample data
- **`product-plan/sections/reporting/types.ts`** (9.9 KB) — Many types

---

## Step 3: Component Architecture

```
src/sections/reporting/
├── ReportingView.tsx                    (Tab wrapper)
├── components/
│   ├── CommentsView.tsx                 (Threaded conversations)
│   ├── ProgressReportsView.tsx          (Report generation)
│   ├── DataVisualizationView.tsx        (Charts & metrics)
│   ├── ExportCenterView.tsx             (Export management)
│   └── index.ts
└── index.ts
```

---

## Step 4: Key Features

### Comments View
- [x] Threaded comments (max 3 levels)
- [x] Role-based visibility:
  - public — All users
  - clinical_team — BCBA + RBT only
  - supervisor_only — BCBA only
- [x] Tag system (urgent, question, recommendation, resolved)
- [x] Filters:
  - Client dropdown
  - Program dropdown
  - Tag checkboxes
  - Date range
- [x] New comment form
- [x] Reply functionality
- [x] Unread indicators

### Progress Reports View
- [x] 6 report templates:
  - Weekly Summary
  - Monthly Progress
  - Quarterly Review
  - Insurance Report
  - School IEP
  - Raw Data Export
- [x] Configuration panel:
  - Template selector
  - Date range picker
  - Program multi-select
  - Include options checkboxes
  - Format selector (PDF/Word/Excel)
- [x] Generate button (mock)
- [x] Export history table
- [x] Download/email actions

### Data Visualization View
- [x] Dashboard metrics cards:
  - Total sessions this month
  - Average accuracy
  - Programs at mastery
  - Active programs
- [x] Chart placeholders (5 types):
  - Accuracy trends (line chart)
  - Session volume (bar chart)
  - Response distribution (stacked bar)
  - Mastery progress (horizontal bars)
  - Response times (scatter)
- [x] Date range selector (7/30/90 days, all time)
- [x] Program filter
- [x] Export chart buttons
- [x] Key insights cards

### Export Center View
- [x] Template grid (6 templates)
- [x] Export history:
  - Status badges (pending, processing, completed, failed)
  - File size display
  - Expiration countdown
  - Download/retry buttons
- [x] Scheduled exports:
  - Frequency badges (daily, weekly, monthly)
  - Next run date
  - Recipients list
  - Active/paused toggle
  - Edit/delete buttons

---

## Step 5: Comment Visibility Logic

```typescript
const canViewComment = (comment: Comment, userRole: UserRole) => {
  if (comment.visibility === 'public') return true;
  if (comment.visibility === 'clinical_team') {
    return ['BCBA', 'RBT'].includes(userRole);
  }
  if (comment.visibility === 'supervisor_only') {
    return userRole === 'BCBA';
  }
  return false;
};
```

---

## Step 6: Chart Configuration Types

```typescript
type ChartType = 'line' | 'bar' | 'stacked_bar' | 'pie' | 'scatter';

interface ChartConfiguration {
  chart_id: string;
  chart_type: ChartType;
  title: string;
  data_source: ChartDataSource;
  filters: ChartFilters;
  date_range: DateRange;
  programs: string[];
  aggregation: ChartAggregation;
}
```

---

## Step 7: Export Job Status Tracking

```typescript
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

const getStatusBadge = (status: ExportStatus) => {
  const variants = {
    'pending': { color: 'bg-blue-600', icon: Clock },
    'processing': { color: 'bg-amber-600', icon: RefreshCw },
    'completed': { color: 'bg-green-600', icon: CheckCircle },
    'failed': { color: 'bg-red-600', icon: AlertCircle }
  };
  return variants[status];
};
```

---

## Step 8: Test the Implementation

### Functional Tests
- [ ] Tab navigation works
- [ ] Comments thread correctly
- [ ] Comment visibility filters work
- [ ] New comment form validates
- [ ] Report templates display
- [ ] Configuration saves (mock)
- [ ] Metrics cards show correct data
- [ ] Chart placeholders display
- [ ] Export history table works
- [ ] Scheduled exports display

### Visual Tests
- [ ] Comments layout clean
- [ ] Role badges colored correctly
- [ ] Template cards styled
- [ ] Metrics dashboard layout
- [ ] Chart placeholders sized properly
- [ ] Export center organized
- [ ] Tab interface smooth

---

## Important Notes

### Chart Visualization
For now, use placeholder boxes with dashed borders. In production, integrate:
- Recharts (recommended)
- Chart.js
- Victory
- D3.js

### Rich Text Editor
Comments currently use textarea. For production, replace with:
- TipTap (recommended)
- Slate
- Quill

---

## Acceptance Criteria

- [x] 4 tab interface complete
- [x] Comments with threading
- [x] Report templates displayed
- [x] Visualization metrics shown
- [x] Export center functional
- [x] All data loading correctly
- [x] Zero compilation errors

---

## Completion Milestone

**🎉 Congratulations!** You've completed all 6 sections of SnapStim!

### Final Checklist
- [ ] All 6 sections implemented
- [ ] Zero TypeScript errors
- [ ] Build succeeds: `npm run build`
- [ ] All sections accessible from shell navigation
- [ ] Dark mode works throughout
- [ ] Responsive on mobile/tablet/desktop
- [ ] Sample data loading in all sections

---

## Next Steps After Completion

### Phase 1: Backend Integration
1. Set up database schema
2. Create API endpoints
3. Replace JSON imports with API calls
4. Add authentication

### Phase 2: AI Integration
1. Connect OpenAI/Anthropic for stimulus generation
2. Implement image generation
3. Add regenerate functionality

### Phase 3: Enhanced Features
1. Add charting library for visualizations
2. Implement rich text editor for comments
3. Add PDF generation for reports
4. Set up scheduled export jobs

### Phase 4: Deployment
1. Testing (unit, integration, E2E)
2. Production build optimization
3. Deploy to hosting platform
4. Set up monitoring and analytics

---

## Reference

- **Spec:** `product-plan/sections/reporting/spec.md`
- **Sample Data:** `product-plan/sections/reporting/data.json`
- **Types:** `product-plan/sections/reporting/types.ts`
- **Handoff Guide:** See `HANDOFF.md` for complete development roadmap
