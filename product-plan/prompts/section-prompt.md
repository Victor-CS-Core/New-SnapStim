# Section Implementation Prompt Template

**Instructions:** Fill in the variables at the top, then copy the entire prompt below and paste it into your AI coding agent (Cursor, GitHub Copilot Chat, Claude, etc.)

---

## VARIABLES TO FILL IN

```
SECTION_NAME: [e.g., "accounts", "clients", "programs"]
SECTION_ID: [e.g., "1", "2", "3"]
SECTION_TITLE: [e.g., "Role-Based Accounts & Permissions"]
NN: [Two-digit milestone number, e.g., "02", "03", "04"]
```

---

## PROMPT TO COPY (Fill in variables above first)

```
I need you to implement Milestone {{NN}}: {{SECTION_TITLE}} for our React + TypeScript application.

**CONTEXT:**
- This is section {{SECTION_ID}} of 6 in the SnapStim ABA skill-acquisition tool
- We're building incrementally following Design OS methodology
- The application shell is already complete
- All section specifications, sample data, and types are in the `product-plan/` folder

**WHAT TO BUILD:**

1. **Review the specifications:**
   - Read `product-plan/sections/{{SECTION_NAME}}/spec.md` for complete requirements
   - Review `product-plan/sections/{{SECTION_NAME}}/data.json` for sample data structure
   - Study `product-plan/sections/{{SECTION_NAME}}/types.ts` for TypeScript interfaces

2. **Create the main view component:**
   - File: `src/sections/{{SECTION_NAME}}/{{SECTION_NAME|capitalize}}View.tsx`
   - Import sample data from `product-plan/sections/{{SECTION_NAME}}/data.json`
   - Import types from `product-plan/sections/{{SECTION_NAME}}/types.ts`
   - Use relative imports: `../../../product-plan/sections/{{SECTION_NAME}}/`

3. **Create subcomponents:**
   - Directory: `src/sections/{{SECTION_NAME}}/components/`
   - Follow the component architecture shown in the spec
   - Each component should be in its own file
   - Use 4-level deep imports: `../../../../product-plan/sections/{{SECTION_NAME}}/`

4. **Create barrel export:**
   - File: `src/sections/{{SECTION_NAME}}/index.ts`
   - Content: `export { default as {{SECTION_NAME|capitalize}}View } from './{{SECTION_NAME|capitalize}}View';`

**REQUIREMENTS:**

- ✅ Use TypeScript strict mode with proper type annotations
- ✅ Import types using `import type { TypeName }` syntax
- ✅ Use shadcn/ui components (Card, Button, Badge, Table, etc.)
- ✅ Follow Tailwind CSS conventions for styling
- ✅ Use lucide-react icons
- ✅ Card-based layouts for content organization
- ✅ Badge system for status/role indicators
- ✅ Empty states for no-data scenarios
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support

**DATA LOADING PATTERN:**

```typescript
import {{SECTION_NAME}}Data from '../../../product-plan/sections/{{SECTION_NAME}}/data.json';
import type { TypeName } from '../../../product-plan/sections/{{SECTION_NAME}}/types';

const items = {{SECTION_NAME}}Data.itemsArray as TypeName[];
```

**COMPONENT PATTERNS TO FOLLOW:**

1. **Main View Structure:**
   - Card-based layout
   - Header with title and action buttons
   - Filters/search if needed
   - Content area with components or table
   - Empty state for no data

2. **Subcomponents:**
   - One responsibility per component
   - Props interface defined
   - Proper type safety
   - Export default for lazy loading

3. **Styling:**
   - Use existing design tokens (emerald primary, stone neutrals)
   - Consistent spacing (4, 8, 12, 16, 24, 32)
   - Badge colors for status indicators
   - Hover states and transitions

**TESTING CHECKLIST:**

Before marking this milestone complete, verify:
- [ ] Component loads without TypeScript errors
- [ ] Sample data displays correctly
- [ ] All subcomponents render
- [ ] Filters/search work (if applicable)
- [ ] Empty states show when appropriate
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode styles correct
- [ ] Navigation works from shell
- [ ] No console errors

**REFERENCE:**

For similar patterns, see these existing implementations:
- `src/sections/clients/ClientsView.tsx` — Good example of main view structure
- `src/sections/programs/components/ProgramList.tsx` — Table with filters
- `src/sections/sessions/SessionsView.tsx` — Tab-based interface

**OUTPUT:**

Please create all the files for this section and ensure they follow the patterns established in the existing codebase. Run `npm run build` to verify zero compilation errors before completing.
```

---

## EXAMPLE: Filled in for Accounts Section

```
SECTION_NAME: accounts
SECTION_ID: 1
SECTION_TITLE: Role-Based Accounts & Permissions
NN: 02
```

**Resulting Prompt:**

```
I need you to implement Milestone 02: Role-Based Accounts & Permissions for our React + TypeScript application.

**CONTEXT:**
- This is section 1 of 6 in the SnapStim ABA skill-acquisition tool
- We're building incrementally following Design OS methodology
- The application shell is already complete
- All section specifications, sample data, and types are in the `product-plan/` folder

**WHAT TO BUILD:**

1. **Review the specifications:**
   - Read `product-plan/sections/accounts/spec.md` for complete requirements
   - Review `product-plan/sections/accounts/data.json` for sample data structure
   - Study `product-plan/sections/accounts/types.ts` for TypeScript interfaces

2. **Create the main view component:**
   - File: `src/sections/accounts/AccountsView.tsx`
   - Import sample data from `product-plan/sections/accounts/data.json`
   - Import types from `product-plan/sections/accounts/types.ts`
   - Use relative imports: `../../../product-plan/sections/accounts/`

3. **Create subcomponents:**
   - Directory: `src/sections/accounts/components/`
   - Follow the component architecture shown in the spec
   - Each component should be in its own file
   - Use 4-level deep imports: `../../../../product-plan/sections/accounts/`

4. **Create barrel export:**
   - File: `src/sections/accounts/index.ts`
   - Content: `export { default as AccountsView } from './AccountsView';`

[... rest of template filled in ...]
```

---

## SECTION-SPECIFIC DETAILS

### Section 1: Accounts (Milestone 02)
- **SECTION_NAME:** accounts
- **SECTION_TITLE:** Role-Based Accounts & Permissions
- **Key Components:** UserList, UserDetail, UserForm
- **Special Notes:** Focus on role badges (BCBA, RBT, Caregiver) with distinct colors

### Section 2: Clients (Milestone 03)
- **SECTION_NAME:** clients
- **SECTION_TITLE:** Client Profiles & Program Management
- **Key Components:** ClientDashboard, ProgramCard, AlertItem
- **Special Notes:** Alert system with severity levels, avatar display

### Section 3: Programs (Milestone 04)
- **SECTION_NAME:** programs
- **SECTION_TITLE:** Program Creation & Stimulus Generation
- **Key Components:** ProgramList, ProgramDetail, ProgramWizard, StimulusModal
- **Special Notes:** 4 program types, wizard flow for creation

### Section 4: Review (Milestone 05)
- **SECTION_NAME:** review
- **SECTION_TITLE:** Human-in-the-Loop Review
- **Key Components:** ReviewQueue, StimulusDetailModal, BatchReviewModal, ReviewAnalytics
- **Special Notes:** Image display, regenerate actions, batch operations

### Section 5: Sessions (Milestone 06)
- **SECTION_NAME:** sessions
- **SECTION_TITLE:** Session Running & Data Capture
- **Key Components:** SessionSelection, SessionRunner, SessionRecap, SessionHistory
- **Special Notes:** Tab interface, real-time trial recording UI, recap summaries

### Section 6: Reporting (Milestone 07)
- **SECTION_NAME:** reporting
- **SECTION_TITLE:** Communication & Reporting
- **Key Components:** CommentsView, ProgressReportsView, DataVisualizationView, ExportCenterView
- **Special Notes:** Threaded comments, chart placeholders, export templates

---

## TIPS FOR SUCCESS

1. **Start Simple:** Build the main view first, then add subcomponents
2. **Test Incrementally:** Verify each component works before moving to the next
3. **Follow Patterns:** Look at existing sections for inspiration
4. **Check Types:** Run `npm run build` frequently to catch type errors early
5. **Review Spec:** Re-read the spec if you're unsure about a requirement

---

## TROUBLESHOOTING

### "Cannot find module" errors
- Check import paths are correct depth (3 levels for main view, 4 for components)
- Verify file extensions (.tsx for components, .ts for types)
- Ensure barrel exports (index.ts) are created

### TypeScript type errors
- Use `import type { }` for type-only imports
- Cast JSON data: `data.items as TypeName[]`
- Check property names match between types and data

### Components not rendering
- Verify default exports: `export default ComponentName`
- Check JSX syntax is valid
- Look for missing imports or typos

---

This template helps maintain consistency across all section implementations while allowing customization for each section's unique requirements.
