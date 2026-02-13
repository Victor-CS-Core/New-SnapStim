# SnapStim — Application Shell Specification

## Overview

The application shell provides persistent navigation and layout for SnapStim. It features a compact sidebar that displays icons and labels, with space-efficient design for quick navigation.

---

## Layout Pattern

**Compact Sidebar**

- Vertical sidebar on the left side
- Fixed width when collapsed, wider when expanded
- Logo at the top
- Main navigation in the middle
- User menu at the bottom
- Content area takes remaining space on the right

---

## Components

### 1. Logo & Branding

- **Position**: Top of sidebar
- **Content**: SnapStim logo/wordmark
- **Behavior**: Clicking returns to Dashboard

### 2. Main Navigation

- **Style**: Icons + Labels (visible at all times)
- **Items**:
  1. **Dashboard** — Overview of key metrics and recent activity
  2. **Programs** — Browse, create, and manage programs
  3. **Sessions** — Run sessions and view session history
  4. **Reports** — Data visualization and clinical reporting
  5. **Settings** — Account settings and preferences

- **States**:
  - Default: neutral style
  - Active: highlighted with primary color
  - Hover: subtle background change

### 3. User Menu

- **Position**: Bottom of sidebar
- **Display**: Name + Role + Avatar
- **Content**:
  - User's full name
  - Role badge (BCBA, RBT, or Caregiver)
  - Avatar/profile picture
- **Interaction**: Click to open dropdown with Profile, Account, Sign Out

### 4. Content Area

- **Position**: Right of sidebar
- **Behavior**: Scrollable, receives section content
- **Padding**: Generous whitespace around content
- **Max Width**: Constrained for readability (e.g., 1400px)

---

## Responsive Behavior

### Desktop (1024px+)

- Sidebar visible, compact width
- Full navigation labels shown

### Tablet (768px - 1023px)

- Sidebar collapses to icon-only
- Expands on hover or toggle

### Mobile (< 768px)

- Sidebar hidden by default
- Hamburger menu button reveals sidebar as overlay
- Sidebar slides in from left

---

## Visual Design

### Colors

- Background: neutral-100 (light) / neutral-900 (dark)
- Sidebar: neutral-50 (light) / neutral-950 (dark)
- Active item: primary-50 bg + primary-600 text (light) / primary-950 bg + primary-400 text (dark)
- Borders: neutral-200 (light) / neutral-800 (dark)

### Typography

- Navigation labels: body font, medium weight
- User name: body font, semibold
- Role badge: body font, small size

### Spacing

- Sidebar width: 240px (expanded), 64px (collapsed)
- Padding: 1rem (main content), 0.5rem (sidebar items)

---

## Accessibility

- Keyboard navigation support (Tab, Enter, Arrow keys)
- ARIA labels for icon-only states
- Focus indicators on all interactive elements
- Screen reader announcements for navigation changes

---

## User Flows

### Primary Navigation

1. User clicks navigation item
2. Active state updates
3. Content area loads corresponding section
4. URL updates (client-side routing)

### User Menu

1. User clicks user menu at bottom
2. Dropdown opens with Profile, Account, Sign Out
3. User selects option
4. Dropdown closes, action executes

### Mobile Menu

1. User taps hamburger icon
2. Sidebar slides in as overlay
3. User taps navigation item or outside to close
4. Sidebar slides out, content updates
