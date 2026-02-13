# Incremental Implementation Instructions

This directory contains step-by-step implementation guides for building SnapStim incrementally.

## Implementation Order

Follow these milestones in sequence:

1. **[01-shell.md](01-shell.md)** - Application Shell
   - Design tokens and theming
   - Main layout and navigation
   - User menu with role switching
   - Dark mode support

2. **[02-accounts.md](02-accounts.md)** - Accounts Section
   - User authentication
   - Role-based permissions (BCBA, RBT, Caregiver)
   - Account management

3. **[03-clients.md](03-clients.md)** - Clients Section
   - Client profiles
   - Client management
   - Auto-assignment on save

4. **[04-programs.md](04-programs.md)** - Programs Section
   - Program creation
   - AI-powered stimulus generation
   - 4 program types support

5. **[05-review.md](05-review.md)** - Review Section
   - Human-in-the-loop review
   - Regenerate, enlarge, and edit capabilities
   - Content approval workflow

6. **[06-sessions.md](06-sessions.md)** - Sessions Section
   - Session running
   - Standardized trial flow
   - Consistent data capture

7. **[07-reporting.md](07-reporting.md)** - Reporting Section
   - Trial-by-trial outcome data
   - Automatic recap generation
   - Role-based communication

## How to Use These Instructions

Each milestone file includes:

- **Prerequisites** - What needs to be set up first
- **What You're Building** - Overview of the features
- **Step-by-Step Instructions** - Detailed implementation guide
- **Acceptance Criteria** - Checklist to verify completion
- **Common Issues & Solutions** - Troubleshooting tips
- **Next Steps** - Link to the next milestone

## Getting Started

1. Start with [01-shell.md](01-shell.md)
2. Complete all acceptance criteria before moving to the next milestone
3. Test thoroughly at each step
4. Refer to `product-plan/sections/` for detailed specifications

## Reference Documentation

- **Specifications**: `../sections/` - Detailed feature specs
- **Design System**: `../design-system/` - UI/UX guidelines
- **Data Models**: `../data-shape/` - Schema definitions
- **Prompts**: `../prompts/` - AI prompt templates
