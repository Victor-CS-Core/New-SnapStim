# accounts — Role-Based Accounts & Permissions

## Overview

User authentication and authorization system with three distinct roles: BCBA, RBT, and Caregiver. Each role has specific permissions that control access to clients, programs, and data throughout SnapStim.

---

## User Roles

### BCBA (Board Certified Behavior Analyst)

- **Permissions**: Full access to all features
- **Can**: Create/edit clients, programs, and sessions; review all data; manage team members; configure settings
- **Use Case**: Clinical supervisors who design programs and oversee implementation

### RBT (Registered Behavior Technician)

- **Permissions**: Limited to session execution and data entry
- **Can**: Run assigned sessions, record trial data, view program instructions, add session notes
- **Cannot**: Create or edit programs, manage clients, view billing data
- **Use Case**: Frontline staff who implement programs

### Caregiver

- **Permissions**: Read-only access to assigned client data
- **Can**: View client progress, run permitted programs (if authorized), view session history
- **Cannot**: Edit programs, access other clients, view team communications
- **Use Case**: Parents or guardians participating in home programming

---

## Views

### 1. User List View

**Purpose**: Display all user accounts with filtering and search

**Layout**:

- Table with columns: Name, Role, Email, Status, Last Active, Actions
- Filters: Role (BCBA/RBT/Caregiver), Status (Active/Inactive/Pending)
- Search: By name or email
- Bulk actions: Deactivate, Send invite

**User Actions**:

- View user details
- Edit user profile
- Deactivate/reactivate user
- Resend invitation (for pending users)

### 2. User Detail View

**Purpose**: Show complete user profile and permissions

**Sections**:

- **Profile Info**: Name, email, role, phone, avatar
- **Access Level**: Role badge with permission summary
- **Activity**: Last login, recent actions
- **Assigned Clients**: List of clients this user can access (filtered by role)
- **Assigned Programs**: Programs this RBT can run (if applicable)

**User Actions**:

- Edit profile
- Change role (BCBA only)
- Manage client/program assignments
- View activity log

### 3. Create/Edit User Form

**Purpose**: Add new users or edit existing ones

**Fields**:

- Full name (required)
- Email address (required, unique)
- Role (dropdown: BCBA/RBT/Caregiver)
- Phone number (optional)
- Profile photo (optional)
- Client assignments (checkboxes, based on role)
- Program permissions (for RBTs: which programs they can run)

**Validation**:

- Email must be unique and valid format
- At least one BCBA must remain active
- RBTs must be assigned to at least one program

**User Actions**:

- Save and send invite
- Save as draft
- Cancel

---

## User Flows

### Inviting a New User

1. BCBA clicks "Add User" button
2. Fills out user form (name, email, role)
3. Assigns clients/programs (if applicable)
4. Clicks "Send Invite"
5. System sends email invite with setup link
6. User status shows "Pending" until they complete setup

### Editing User Permissions

1. BCBA navigates to user detail view
2. Clicks "Edit Permissions"
3. Updates role or client/program assignments
4. Saves changes
5. User sees updated permissions immediately on next login

### Deactivating a User

1. BCBA clicks "Deactivate" on user row or detail page
2. Confirms action in modal
3. User status changes to "Inactive"
4. User can no longer log in
5. Historical data remains intact

---

## Data Requirements

### User Object

```
{
  id: string
  name: string
  email: string
  role: 'BCBA' | 'RBT' | 'Caregiver'
  status: 'Active' | 'Inactive' | 'Pending'
  avatar?: string
  phone?: string
  createdAt: timestamp
  lastActiveAt?: timestamp
  assignedClients: string[] // client IDs
  assignedPrograms?: string[] // program IDs (for RBTs)
}
```

---

## Permissions Matrix

| Action                  | BCBA | RBT           | Caregiver        |
| ----------------------- | ---- | ------------- | ---------------- |
| View all clients        | ✓    | ✗             | ✗                |
| View assigned clients   | ✓    | ✓             | ✓                |
| Create/edit clients     | ✓    | ✗             | ✗                |
| Create/edit programs    | ✓    | ✗             | ✗                |
| Run sessions            | ✓    | ✓             | ✓ (if permitted) |
| Review stimulus content | ✓    | ✗             | ✗                |
| View reports            | ✓    | Assigned only | Assigned only    |
| Manage users            | ✓    | ✗             | ✗                |

---

## Visual Design Notes

- Role badges use consistent colors:
  - BCBA: emerald-100/emerald-700
  - RBT: amber-100/amber-700
  - Caregiver: stone-100/stone-700
- Status indicators:
  - Active: green dot
  - Inactive: gray dot
  - Pending: amber dot with pulse animation
- Permission summaries use icons with tooltips for clarity
- Avatar placeholders show initials with role-based background color

---

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels for role badges and status indicators
- Focus indicators on table rows and buttons
- Screen reader announcements for permission changes
- High contrast mode support for status colors
