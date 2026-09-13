# CalenTask - Project Journey

## Project Overview
- **Name:** CalenTask
- **Type:** Task Manager / Calendar App (UI Design Mockups)
- **Tech Stack:** HTML + Tailwind CSS (CDN)
- **Fonts:** Inter, JetBrains Mono
- **Icons:** Google Material Symbols Outlined
- **Status:** Design phase - 8 screens, light + dark themes

## Directory Structure
```
task_manager/
├── calentask/                  # Light theme design tokens (DESIGN.md)
├── calentask_dark/             # Dark theme design tokens (DESIGN.md)
├── calentask_brand_logo/       # SVG logo + screen.png
├── log_in/                     # Login screen (light)
├── log_in_dark/                # Login screen (dark)
├── sign_up/                    # Sign up screen (light)
├── sign_up_dark/               # Sign up screen (dark)
├── daily_calendar_view/        # Daily view (light)
├── daily_calendar_view_dark/   # Daily view (dark)
├── weekly_calendar_view/       # Weekly view (light)
├── weekly_calendar_view_dark/  # Weekly view (dark)
├── monthly_calendar_view/      # Monthly view (light)
├── monthly_calendar_view_dark/ # Monthly view (dark)
├── quick_add_task_popover/     # Quick add task (light)
├── quick_add_task_popover_dark/# Quick add task (dark)
├── task_detail_edit_modal/     # Task detail modal (light)
├── task_detail_edit_modal_dark/# Task detail modal (dark)
├── settings/                   # Settings screen (light)
├── settings_dark/              # Settings screen (dark)
└── journey.md                  # This file
```

## Screens (14 HTML files)
| Screen | Light | Dark |
|--------|-------|------|
| Brand Logo | ✓ | - |
| Log In | ✓ | ✓ |
| Sign Up | ✓ | ✓ |
| Daily Calendar View | ✓ | ✓ |
| Weekly Calendar View | ✓ | ✓ |
| Monthly Calendar View | ✓ | ✓ |
| Quick Add Task Popover | ✓ | ✓ |
| Task Detail Edit Modal | ✓ | ✓ |
| Settings | ✓ | ✓ |

## Changelog

### 2026-09-13 - Initial Setup
- [x] Git repository initialized
- [x] journey.md created
- [x] Project structure documented

### 2026-09-13 - Cleanup & Organization
- [x] Deleted unnecessary `professional_corporate_headshot` directory (accidental AI-generated image)
- [x] Deleted `.DS_Store` macOS artifacts
- [x] Added `.gitignore` for macOS/Node.js artifacts
- [x] Created `index.html` hub page linking all 15 screen mockups
- [x] Project ready for local development

## Git Commits
| Commit | Message |
|--------|---------|
| d33f6a6 | Initial commit |
| 930469e | Add journey.md to track project progress |
| 8453edd | Cleanup: add .gitignore, remove accidental headshot image and .DS_Store |
| baeee38 | Add index.html hub page linking all design mockups |
