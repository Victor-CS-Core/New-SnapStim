# SnapStim

An ABA skill-acquisition tool that reduces the time and friction BCBAs spend building, organizing, and running programs.

## Project Overview

SnapStim improves team consistency across staff and devices while maintaining clinical quality and data integrity. It produces cleaner session data for clinical decision-making through AI-assisted program creation and standardized trial flows.

## Key Features

- **Role-based accounts and permissions** (BCBA, RBT, Caregiver)
- **Client profiles and program management** with auto-assign on save
- **AI-powered stimulus generation** across 4 program types
- **Human-in-the-loop review** with regenerate, enlarge, and edit capabilities
- **Standardized trial flow** with consistent data capture
- **Role-separated communication** with appropriate privacy boundaries

## Problems Solved

1. **Time-Consuming Program Creation** - AI-assisted program creation eliminates manual work
2. **Inconsistent Implementation** - Standardized trial flow ensures consistency
3. **Messy Session Data** - Clean trial-by-trial outcome data with automatic recap generation
4. **Tedious Content Review** - Streamlined review process with regeneration capabilities
5. **Communication Gaps** - Role-based program-level comments with privacy boundaries

## Project Structure

```
SnapStim/
├── product-plan/              # Product planning and design documentation
│   ├── product-overview.md    # Project description and key features
│   ├── product-roadmap.md     # Development roadmap
│   ├── instructions/          # Implementation guides (7 modules)
│   │   ├── 01-shell.md
│   │   ├── 02-accounts.md
│   │   ├── 03-clients.md
│   │   ├── 04-programs.md
│   │   ├── 05-review.md
│   │   ├── 06-sessions.md
│   │   └── 07-reporting.md
│   ├── prompts/               # Templates and prompts
│   │   └── section-prompt.md
│   ├── sections/              # Detailed feature specifications
│   │   ├── accounts/
│   │   ├── clients/
│   │   ├── programs/
│   │   ├── review/
│   │   ├── sessions/
│   │   └── reporting/
│   ├── design-system/         # UI/UX design specifications
│   ├── data-shape/            # Data models and schemas
│   └── shell/                 # Application shell structure
└── README.md
```

## Documentation

- [Product Overview](product-plan/product-overview.md) - Detailed project description
- [Product Roadmap](product-plan/product-roadmap.md) - Development timeline and milestones
- [Implementation Instructions](product-plan/instructions/) - Step-by-step guides for each module

## Getting Started

This project is currently in the planning and design phase. The `product-plan` directory contains comprehensive specifications including:

- **Instructions** - Detailed implementation guides for each major feature
- **Sections** - Technical specifications for all components
- **Design System** - UI/UX guidelines and patterns
- **Data Models** - Schema definitions and data structures

## Development Status

🚧 **Planning Phase** - Product specifications and design documentation are complete. Ready for implementation.

## License

TBD

## Contributing

TBD
