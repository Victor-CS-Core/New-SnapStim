# Milestone 01: Application Shell

**Goal:** Build the foundational application shell with design tokens, navigation, and layout.

---

## Prerequisites

- [ ] Development environment set up (Node.js 18+, npm/pnpm)
- [ ] Project initialized with React + TypeScript + Vite
- [ ] Tailwind CSS v4 installed
- [ ] shadcn/ui components library set up

---

## What You're Building

The application shell includes:
- Design tokens (colors, typography)
- Main layout with sidebar navigation
- User menu with role switching
- Theme toggle (dark mode support)
- Responsive layout

---

## Step 1: Review the Specifications

Read these files from `product-plan/`:

1. **Design System:**
   - `product-plan/design-system/colors.json` — Color palette (emerald, amber, stone)
   - `product-plan/design-system/typography.json` — Font specifications (Inter)

2. **Shell Specification:**
   - `product-plan/shell/spec.md` — Complete shell requirements

---

## Step 2: Set Up Design Tokens

### Create `src/index.css`

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: #10b981;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f59e0b;
  --color-secondary-foreground: #ffffff;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* Base styles */
body {
  font-family: var(--font-sans);
}
```

**Reference:** See `product-plan/design-system/` for complete token values.

---

## Step 3: Install Required shadcn/ui Components

Run these commands to add the components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add sheet
```

---

## Step 4: Build Shell Components

### Create `src/shell/components/AppShell.tsx`

**What it does:**
- Main application layout
- Sidebar navigation on the left
- Content area on the right
- Header with user menu

**Key Requirements from spec:**
- Compact sidebar (240px width)
- Collapsible on mobile
- Navigation items with icons
- Active state highlighting

**Reference Implementation:**
See existing `src/shell/components/AppShell.tsx` for the complete pattern.

---

### Create `src/shell/components/MainNav.tsx`

**What it does:**
- Sidebar navigation with 6 section links
- Icons for each section
- Active state styling
- Compact mode support

**Navigation Items:**
1. Accounts — Users icon
2. Clients — User icon  
3. Programs — FolderOpen icon
4. Review — Eye icon
5. Sessions — Activity icon
6. Reporting — ChartColumn icon

**Reference Implementation:**
See `src/shell/components/MainNav.tsx` for the pattern.

---

### Create `src/shell/components/UserMenu.tsx`

**What it does:**
- User avatar and name display
- Dropdown menu with:
  - Role indicator badge
  - Settings option
  - Theme toggle
  - Logout button

**Role Types:**
- BCBA (purple badge)
- RBT (blue badge)
- Caregiver (green badge)

**Reference Implementation:**
See `src/shell/components/UserMenu.tsx`.

---

## Step 5: Test the Shell

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Verify these work:**
   - [ ] App loads without errors
   - [ ] Sidebar navigation appears
   - [ ] 6 navigation items visible with icons
   - [ ] User menu in header
   - [ ] Theme toggle switches between light/dark
   - [ ] Navigation highlights active section
   - [ ] Sidebar collapses on mobile

3. **Test responsive design:**
   - [ ] Desktop (1920px): Full sidebar visible
   - [ ] Tablet (768px): Collapsible sidebar
   - [ ] Mobile (375px): Hamburger menu

---

## Step 6: Component Export

Create `src/shell/components/index.ts`:

```typescript
export { default as AppShell } from './AppShell';
export { default as MainNav } from './MainNav';
export { default as UserMenu } from './UserMenu';
```

---

## Acceptance Criteria

Before moving to the next milestone, verify:

- [x] Design tokens applied (emerald primary, Inter font)
- [x] Application shell renders correctly
- [x] Sidebar navigation with 6 items
- [x] User menu with role badge
- [x] Dark mode toggle functional
- [x] Responsive layout works on mobile/tablet/desktop
- [x] Zero TypeScript compilation errors
- [x] Zero console errors in browser

---

## Common Issues & Solutions

### Issue: Tailwind classes not applying
**Solution:** Ensure `@import "tailwindcss"` is at the top of `index.css`

### Issue: Icons not showing
**Solution:** Install lucide-react: `npm install lucide-react`

### Issue: Dark mode not working
**Solution:** Add `dark` class toggle to root element

### Issue: Sidebar not collapsing on mobile
**Solution:** Use Sheet component from shadcn/ui for mobile drawer

---

## Next Steps

Once the shell is complete and tested:

✅ **Move to Milestone 02:** Accounts Section  
   → `instructions/incremental/02-accounts.md`

---

## Need Help?

- **Spec Reference:** `product-plan/shell/spec.md`
- **Design Tokens:** `product-plan/design-system/`
- **Example Code:** `src/shell/components/`
- **shadcn/ui Docs:** https://ui.shadcn.com/
