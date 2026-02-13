# Milestone 02: Accounts Section

**Goal:** Implement role-based accounts and permissions management.

---

## What You're Building

The Accounts section manages users with three roles:
- **BCBA** — Board Certified Behavior Analyst (supervisor)
- **RBT** — Registered Behavior Technician (therapist)
- **Caregiver** — Parent/guardian (observer)

**Components:**
- User list with role filtering
- User detail view with permissions
- User creation/edit form
- Role-based badge system

---

## Step 1: Use the Section Prompt

1. **Open** `prompts/section-prompt.md`

2. **Fill in these variables:**
   ```
   SECTION_NAME: accounts
   SECTION_ID: 1
   SECTION_TITLE: Role-Based Accounts & Permissions
   NN: 02
   ```

3. **Copy the filled prompt** and paste it into your AI coding agent

4. **Review the generated code** before proceeding

---

## Step 2: Review Specifications

Read these files carefully:

- **`product-plan/sections/accounts/spec.md`** (7.2 KB)
  - Complete feature requirements
  - User roles and permissions
  - UI requirements

- **`product-plan/sections/accounts/data.json`** (3.5 KB)
  - 8 sample users (2 BCBA, 4 RBT, 2 Caregiver)
  - Example permission structures

- **`product-plan/sections/accounts/types.ts`** (2.8 KB)
  - User interface
  - UserRole type
  - Permission interface

---

## Step 3: Component Architecture

Create these files:

```
src/sections/accounts/
├── AccountsView.tsx           (Main view with user list)
├── components/
│   ├── UserList.tsx          (Table with role filters)
│   ├── UserDetail.tsx        (Profile view)
│   ├── UserForm.tsx          (Create/edit form)
│   └── index.ts              (Barrel export)
└── index.ts                  (Main export)
```

---

## Step 4: Key Features to Implement

### User List Component
- [x] Table showing all users
- [x] Role filter dropdown (All, BCBA, RBT, Caregiver)
- [x] Status badges (Active, Suspended, Pending)
- [x] Role badges with colors:
  - BCBA: Purple (`bg-purple-600`)
  - RBT: Blue (`bg-blue-600`)
  - Caregiver: Green (`bg-green-600`)
- [x] Search by name or email
- [x] Click user to view details

### User Detail Component
- [x] User profile information
- [x] Role badge
- [x] Client assignments list
- [x] Permission display
- [x] Edit button
- [x] Account status indicator

### User Form Component
- [x] Name and email fields
- [x] Role selector dropdown
- [x] Password field (create only)
- [x] Client assignment checkboxes
- [x] Active status toggle
- [x] Save and Cancel buttons
- [x] Form validation

---

## Step 5: Data Loading Pattern

```typescript
import accountsData from '../../../product-plan/sections/accounts/data.json';
import type { User } from '../../../product-plan/sections/accounts/types';

// In your component:
const users = accountsData.users as User[];
```

---

## Step 6: Styling Guidelines

### Role Badge Colors
```typescript
const getRoleBadgeColor = (role: string) => {
  const colors: Record<string, string> = {
    'BCBA': 'bg-purple-600',
    'RBT': 'bg-blue-600',
    'Caregiver': 'bg-green-600'
  };
  return colors[role] || 'bg-gray-600';
};
```

### Status Badge Colors
```typescript
const getStatusBadgeColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'bg-green-600',
    'suspended': 'bg-red-600',
    'pending': 'bg-amber-600'
  };
  return colors[status] || 'bg-gray-600';
};
```

---

## Step 7: Test the Implementation

### Functional Tests
- [ ] User list displays all 8 users
- [ ] Role filter works (BCBA shows 2, RBT shows 4, Caregiver shows 2)
- [ ] Search filters users by name/email
- [ ] Click user opens detail view
- [ ] Edit button shows user form
- [ ] Form validates required fields
- [ ] Role badges show correct colors
- [ ] Status badges show correct states

### Visual Tests
- [ ] Layout is responsive
- [ ] Cards have proper spacing
- [ ] Badges are readable
- [ ] Empty state shows when no users match filter
- [ ] Dark mode styles work correctly

### Technical Tests
- [ ] No TypeScript compilation errors
- [ ] No console errors
- [ ] Build succeeds: `npm run build`
- [ ] All imports resolve correctly

---

## Acceptance Criteria

- [x] All components created and rendering
- [x] Sample data loading from JSON
- [x] Role-based badge system working
- [x] User list filtering functional
- [x] User detail view complete
- [x] User form with validation
- [x] Zero compilation errors
- [x] Responsive layout

---

## Common Issues

### Issue: Role badges not showing colors
**Solution:** Ensure Tailwind classes are not being purged. Add to `tailwind.config`:
```js
safelist: ['bg-purple-600', 'bg-blue-600', 'bg-green-600']
```

### Issue: Data not loading
**Solution:** Check import path depth — main view needs 3 levels: `../../../product-plan/`

### Issue: Form not validating
**Solution:** Add validation logic before save:
```typescript
if (!formData.name || !formData.email) {
  setError('Name and email required');
  return;
}
```

---

## Next Steps

Once complete and tested:

✅ **Move to Milestone 03:** Clients Section  
   → `instructions/incremental/03-clients.md`

---

## Reference

- **Spec:** `product-plan/sections/accounts/spec.md`
- **Sample Data:** `product-plan/sections/accounts/data.json`
- **Types:** `product-plan/sections/accounts/types.ts`
- **Example Code:** `src/sections/accounts/`
