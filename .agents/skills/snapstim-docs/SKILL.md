---
name: snapstim-docs
description: Documentation management for SnapStim ProjectUI. Use when creating or updating project documentation, tracking implementation milestones, documenting new features, updating changelogs, or maintaining technical documentation throughout the development lifecycle.
---

# SnapStim ProjectUI - Documentation Manager

This skill helps maintain comprehensive, up-to-date documentation for the SnapStim ProjectUI project throughout its 10-12 week implementation lifecycle.

## When to Use This Skill

Use this skill when the user:

- Asks to "update documentation" after completing a feature
- Says "document this feature" or "add this to the docs"
- Requests "create a changelog entry"
- Asks "what documentation exists?"
- Wants to "track progress" or "update implementation status"
- Needs to "document API endpoints" or "update integration guide"
- Requests "create release notes"
- Asks about documentation standards or structure

## Project Overview

**Project:** SnapStim ProjectUI  
**Type:** Web-based ABA therapy session management platform  
**Tech Stack:** React 18, TypeScript, Vite, Firebase, Tailwind CSS, shadcn/ui  
**Timeline:** 10-12 weeks (10 phases)  
**Backend:** Node.js + Express (existing mobile app backend)

## Documentation Structure

```
docs/
├── README.md                   # Project overview, setup, quick start
├── IMPLEMENTATION-GUIDE.md     # 10-phase implementation roadmap
├── USER-GUIDE.md              # End-user documentation
├── CHANGELOG.md               # Version history (to be created)
└── CONTRIBUTING.md            # Contribution guidelines (to be created)
```

## Core Documentation Tasks

### 1. Track Implementation Progress

When a phase is completed, update [docs/IMPLEMENTATION-GUIDE.md](../docs/IMPLEMENTATION-GUIDE.md):

**What to update:**
- Mark completed tasks with ✅
- Update completion status sections
- Add notes about implementation decisions
- Document any deviations from original plan

**Example:**
```markdown
## Phase 1: Backend Connection (Week 1) ✅ COMPLETED

### Completed Tasks:
- ✅ Firebase SDK installed and configured
- ✅ API client created and tested
- ✅ Environment variables configured
- ✅ Backend health check passing

**Notes:** Used firebase@12.8.0, all tests passing
**Date Completed:** February 15, 2026
```

### 2. Document New Features

When a major feature is implemented, create or update documentation:

**For User-Facing Features:**
- Update [docs/USER-GUIDE.md](../docs/USER-GUIDE.md)
- Add feature description
- Include screenshots/examples
- Document user workflows

**For Developer Features:**
- Update [docs/README.md](../docs/README.md) if it affects setup
- Document API endpoints in API reference section
- Add code examples

### 3. Maintain Changelog

Create and maintain [docs/CHANGELOG.md](../docs/CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Firebase Authentication integration
- Client management API endpoints

### Changed
- Reorganized project structure

### Fixed
- Mock data ID mismatches

## [0.2.0] - 2026-02-15

### Added
- Created comprehensive documentation structure
- Installed Firebase, React, and testing skills

### Changed
- Moved documentation to `/docs` folder
- Removed obsolete demo files
```

### 4. API Documentation

When implementing API integrations, document in [docs/README.md](../docs/README.md) or create new `docs/API.md`:

```markdown
## API Endpoints

### Authentication

**POST /api/auth/login**
- Description: Authenticate user with email/password
- Request: `{ email: string, password: string }`
- Response: `{ token: string, user: User }`
- Example:
  ```typescript
  const response = await api.login('user@example.com', 'password123');
  ```

### Clients

**GET /api/client/list?userId={userId}**
- Description: List all clients for a user
- Response: `{ ok: boolean, clients: Client[], count: number }`
```

### 5. Create Release Notes

For major milestones or releases:

**Create:** `docs/releases/v0.x.0.md`

```markdown
# Release v0.2.0 - Backend Integration

**Date:** February 15, 2026  
**Phase:** Phase 1-2 Complete

## Overview
This release completes the backend connection and Firebase setup.

## New Features
- 🔥 Firebase Authentication
- 📊 Real-time data sync with Firestore
- 🔐 Secure API client

## Breaking Changes
- Removed mock data dependencies
- Updated environment variable requirements

## Migration Guide
1. Update .env with Firebase credentials
2. Run `npm install` to get new dependencies
3. Start backend server before running app
```

## Documentation Standards

### Markdown Formatting

**Headers:**
- Use `#` for document title
- Use `##` for major sections
- Use `###` for subsections

**Code Blocks:**
- Always specify language: ```typescript, ```bash, ```json
- Include file paths in comments: `// src/lib/firebase.ts`

**Links:**
- Use relative paths: `[Implementation Guide](./IMPLEMENTATION-GUIDE.md)`
- Link to specific sections: `[Phase 1](#phase-1-backend-connection)`

**Lists:**
- Use `✅` for completed items
- Use `❌` for incomplete/broken items
- Use `⚠️` for warnings
- Use `🔥` for new features
- Use `🐛` for bug fixes

### Keeping Documentation Current

**Before Each Phase:**
1. Review current documentation
2. Note what needs updating
3. Plan documentation tasks

**During Implementation:**
1. Add inline code comments
2. Document complex logic
3. Note any deviations from plan

**After Phase Completion:**
1. Update implementation guide status
2. Add changelog entry
3. Update README if needed
4. Create release notes for major milestones

## Quick Commands

### Check Current Documentation

Read these files to understand current state:
```bash
docs/README.md
docs/IMPLEMENTATION-GUIDE.md
docs/USER-GUIDE.md
```

### After Completing a Feature

1. Identify what documentation needs updating
2. Read current content
3. Add/update relevant sections
4. Keep formatting consistent

### Creating New Documentation

When creating new docs:
1. Check if similar documentation exists
2. Follow existing structure and tone
3. Use consistent formatting
4. Add to main README's documentation list

## Templates

### Feature Documentation Template

```markdown
## [Feature Name]

**Status:** ✅ Complete | 🚧 In Progress | ❌ Not Started  
**Phase:** [Phase Number]  
**Date Implemented:** [Date]

### Overview
[Brief description of what the feature does]

### Usage
[How to use the feature]

```typescript
// Example code
```

### Configuration
[Any configuration required]

### Notes
[Implementation notes, caveats, known issues]
```

### Phase Completion Template

```markdown
## Phase [X]: [Phase Name] ✅ COMPLETED

**Duration:** [Start Date] - [End Date]  
**Estimated:** [X] weeks | **Actual:** [Y] weeks

### What Was Built
- Feature 1
- Feature 2
- Feature 3

### Key Decisions
- Decision 1: Rationale
- Decision 2: Rationale

### Lessons Learned
- Learning 1
- Learning 2

### Next Steps
→ Proceed to Phase [X+1]
```

## Best Practices

### DO:
✅ Update documentation immediately after completing features  
✅ Use clear, concise language  
✅ Include code examples  
✅ Link between related documentation  
✅ Keep changelog up to date  
✅ Document breaking changes  
✅ Add screenshots for UI features  
✅ Version documentation with code

### DON'T:
❌ Let documentation become outdated  
❌ Document implementation details that change frequently  
❌ Use vague descriptions  
❌ Forget to update links when renaming files  
❌ Mix different documentation styles  
❌ Write essays (be concise)  
❌ Skip documenting breaking changes

## Project-Specific Guidelines

### SnapStim ProjectUI Documentation

1. **Implementation Guide is Source of Truth**
   - All phase completion status tracked here
   - Reference this for progress updates

2. **User Guide is For End Users**
   - BCBAs, RBTs, and caregivers
   - Focus on workflows, not technical details
   - Use screenshots and examples

3. **README is For Developers**
   - Setup instructions
   - Project structure
   - Development workflow

4. **Changelog Follows Versions**
   - Format: `[Major].[Minor].[Patch]`
   - Major: Breaking changes or completed phases
   - Minor: New features
   - Patch: Bug fixes

### Key Milestones to Document

Track these major milestones with detailed documentation:

- **Phase 1-2:** Backend connection + Firebase setup
- **Phase 3-4:** Authentication + Data integration
- **Phase 5-6:** Session running + AI integration
- **Phase 7-8:** Advanced features + Polish
- **Phase 9-10:** Testing + Deployment

## Monitoring Documentation Health

### Weekly Documentation Review

Ask yourself:
1. Does README.md reflect current setup process?
2. Is IMPLEMENTATION-GUIDE.md up to date with progress?
3. Have recent features been documented?
4. Is changelog current?
5. Are there any broken links?

### Pre-Release Documentation Checklist

Before any release:
- [ ] Update version numbers
- [ ] Create release notes
- [ ] Update changelog
- [ ] Review all documentation for accuracy
- [ ] Test all code examples
- [ ] Check all links
- [ ] Update screenshots if UI changed

## Getting Started with This Skill

When the user asks to update documentation:

1. **Read current documentation first**
   ```
   Read docs/README.md
   Read docs/IMPLEMENTATION-GUIDE.md
   Read docs/USER-GUIDE.md
   ```

2. **Identify what needs updating**
   - What phase was completed?
   - What features were added?
   - What changed?

3. **Make updates following standards**
   - Use consistent formatting
   - Update all affected files
   - Add changelog entry

4. **Verify updates**
   - Check links work
   - Ensure formatting is correct
   - Confirm accuracy

## Example Workflows

### Workflow 1: Phase Completion

**User:** "I finished Phase 1, update the docs"

**Actions:**
1. Read `docs/IMPLEMENTATION-GUIDE.md`
2. Locate Phase 1 section
3. Update status to ✅ COMPLETED
4. Add completion date
5. Add implementation notes
6. Update checklist items
7. Add changelog entry in `docs/CHANGELOG.md`

### Workflow 2: New Feature

**User:** "Document the new authentication system"

**Actions:**
1. Read `docs/README.md` and `docs/USER-GUIDE.md`
2. Add authentication section to README (setup)
3. Add authentication section to USER-GUIDE (usage)
4. Add API endpoints documentation
5. Include code examples
6. Add to changelog

### Workflow 3: Creating Missing Documentation

**User:** "Create a CHANGELOG file"

**Actions:**
1. Check if `docs/CHANGELOG.md` exists
2. If not, create following Keep a Changelog format
3. Review git history for recent changes
4. Populate with historical entries
5. Add to main README documentation list

---

## Summary

This skill helps maintain living documentation that evolves with the SnapStim ProjectUI project. Use it regularly to ensure documentation stays synchronized with code, making onboarding easier and providing a clear development narrative.

**Key Principle:** Documentation is not a one-time task—it's an ongoing process that captures the project's evolution.
