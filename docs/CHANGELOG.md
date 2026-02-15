# Changelog

All notable changes to SnapStim ProjectUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation management skill (`snapstim-docs`) for maintaining project documentation

## [0.2.0] - 2026-02-15

### Added
- 📁 Created `/docs` folder for centralized documentation
- 📋 Comprehensive IMPLEMENTATION-GUIDE.md with 10-phase roadmap
- 📚 USER-GUIDE.md for end users (BCBAs, RBTs, Caregivers)
- 🤖 Agent skills integration:
  - `firebase-auth` - Firebase Authentication patterns
  - `firebase-firestore` - Firestore database integration
  - `firebase-storage` - Cloud Storage management
  - `react-dev` - React/TypeScript best practices
  - `webapp-testing` - Playwright testing toolkit
  - `find-skills` - Skills discovery and installation
- 🔧 VS Code workspace settings for better development experience
- 📝 New streamlined root README.md with quick start guide

### Changed
- 🗂️ Reorganized project structure for better clarity
- 📄 Moved all documentation from root to `/docs` folder
- 🔒 Updated .gitignore with better organization and security
- 📦 Cleaned up workspace (removed 76 unnecessary files)

### Removed
- 🗑️ Duplicate skill folders (`.agent/`, `.claude/`)
- 🗑️ Obsolete DEMO-INTEGRATION-ANALYSIS.md (superseded by IMPLEMENTATION-GUIDE.md)
- 🗑️ Unused Vite template files (App.css, react.svg, empty assets folder)
- 🗑️ Empty `.env` from version control (added to .gitignore)

## [0.1.0] - 2026-02-14

### Added
- 🎨 Initial UI implementation with 7 major sections:
  - Dashboard (overview & alerts)
  - Accounts (user management)
  - Clients (client profiles & programs)
  - Programs (program library)
  - Review (AI stimulus approval)
  - Sessions (therapy session management)
  - Reporting (data analytics & exports)
- 🎯 Navigation system with context passing
- 💾 Mock data structure for all sections
- 🧩 shadcn/ui component library integration
- 🎨 Tailwind CSS styling system
- 📱 Responsive layout with AppShell navigation

### Changed
- ♻️ Refactored components for improved readability and consistency
- 📝 Updated README and implementation documentation

## [0.0.1] - 2026-02-13

### Added
- ⚡ Initial project setup with Vite + React + TypeScript
- 🎨 Tailwind CSS configuration
- 📦 Project dependencies (React, TypeScript, Vite, shadcn/ui)
- 📋 Basic project structure

---

## Version History Summary

- **v0.2.0** - Project reorganization, documentation, and agent skills
- **v0.1.0** - Complete UI prototype with mock data
- **v0.0.1** - Initial project setup

## Upcoming Releases

### [0.3.0] - Phase 1-2: Backend Integration (Target: Week 1-2)
- Firebase SDK integration
- Backend API client
- Authentication system
- Environment configuration

### [0.4.0] - Phase 3-4: Data Integration (Target: Week 3-4)
- Replace mock data with Firebase
- Real-time data sync
- API endpoint integration

### [0.5.0] - Phase 5-6: Core Features (Target: Week 5-8)
- Session runner implementation
- AI integration (GetImg + Replicate)
- Program creation workflows

### [1.0.0] - Production Release (Target: Week 10-12)
- Complete feature set
- Testing coverage
- Production deployment
- User documentation

---

## Notes

- All dates follow YYYY-MM-DD format
- Version numbers follow semantic versioning (MAJOR.MINOR.PATCH)
- Links to issues/PRs will be added as project progresses
- See [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) for detailed phase planning

## Contributing

When contributing, please:
1. Update this CHANGELOG with your changes under [Unreleased]
2. Follow the format: Category (Added/Changed/Fixed/Removed) + descriptive bullet
3. Use emojis for visual scanning (🔥 features, 🐛 fixes, ♻️ refactor, 📝 docs)
4. Reference issue numbers when applicable
