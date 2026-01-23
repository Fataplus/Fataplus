---
name: folder-organizer
description: Reorganize multi-project workspaces with automated auditing, categorization, and restructuring. Tailored for Fataplus-style directories containing web apps, mobile apps, scripts, documentation, and business files.
license: MIT
compatibility: opencode, claude-code
metadata:
  audience: developers
  workflow: filesystem
  project: fataplus
---

# Folder Organizer Skill

Intelligent workspace reorganization for multi-project directories.

## Overview

This skill analyzes a multi-project workspace and provides:
1. **Comprehensive audit** of all files and directories
2. **Smart categorization** by type, tech stack, and purpose
3. **Restructuring proposals** with migration plans
4. **Safe execution** with rollback capability

## When to Use This Skill

Use this skill when you need to:
- Reorganize a messy multi-project workspace
- Consolidate scattered documentation
- Archive inactive projects
- Establish consistent folder structure
- Create navigation indexes

## Workflow

### Phase 1: Audit

Scan the workspace and gather:
- All top-level directories and files
- Tech stack detection (package.json, requirements.txt, pubspec.yaml, etc.)
- File counts and modification dates
- Hidden directories and configuration files
- Git repository status

**Output:** `audit-report.json` in workspace root

### Phase 2: Categorize

Classify items into categories:

| Category | Pattern Detection |
|----------|-------------------|
| `apps/web` | package.json + (next, astro, react, vue) |
| `apps/mobile` | pubspec.yaml OR react-native |
| `apps/api` | package.json + (hono, express, fastify) |
| `repos` | Cloned external repositories |
| `docs/strategy` | Markdown files with strategy/planning content |
| `docs/technical` | API specs, architecture docs |
| `docs/financial` | PDFs, CSVs with financial data |
| `data/banking` | Bank statements, CSV exports |
| `data/social` | Social media exports, scraping results |
| `scripts/python` | .py files at root or scripts/ |
| `scripts/shell` | .sh files |
| `resources/assets` | Images, logos, SVGs |
| `resources/guides` | PDF guides, tutorials |
| `archive/inactive` | Repos with no commits in 6+ months |
| `archive/legacy` | Deprecated code |
| `config` | Hidden config directories (.bmad, .claude, etc.) |

**Output:** `categorization-plan.md` with proposed structure

### Phase 3: Propose

Generate a restructuring plan:

```
proposed-structure/
├── apps/
│   ├── web/
│   │   ├── agency-web/          # Astro marketing site
│   │   └── fataplus-os/         # Next.js SaaS dashboard
│   ├── mobile/
│   │   └── tsena-ny-tantsaha/   # Flutter marketplace
│   └── api/
│       └── fataplus-builder/    # Cloudflare Workers
├── repos/                        # External/cloned repositories
│   ├── active/
│   └── archive/
├── docs/
│   ├── strategy/                 # Business planning, GTM
│   ├── technical/                # Architecture, API specs
│   ├── financial/                # PIC reports, treasury
│   └── business/                 # PDFs, pitch decks
├── data/
│   ├── banking/                  # MCB statements
│   ├── social/                   # Facebook exports
│   └── exports/                  # Generated data
├── scripts/
│   ├── python/                   # Python utilities
│   └── shell/                    # Shell scripts
├── resources/
│   ├── assets/                   # Logos, images
│   └── guides/                   # Reference PDFs
├── config/                       # Framework configs
│   ├── bmad/                     # BMAD methodology
│   └── superdesign/              # UI design workflow
└── archive/                      # Inactive/legacy items
```

**User confirmation required before proceeding.**

### Phase 4: Execute

For each move operation:
1. Check if source exists
2. Create target directory if needed
3. Move with `git mv` if in git repo, else `mv`
4. Update any index files
5. Log operation to `migration-log.md`

**Safety features:**
- Dry-run mode available
- Rollback script generated
- No destructive operations without confirmation

### Phase 5: Document

Generate/update navigation files:
- `PROJECT_INDEX.md` - Main workspace navigation
- `docs/README.md` - Documentation hub
- `apps/README.md` - Applications catalog
- Update existing `FATAPLUS_INDEX.md`

## Commands

### Full Reorganization
```
/folder-organizer
```
Runs all phases with user confirmation.

### Audit Only
```
/folder-organizer audit
```
Generates audit report without changes.

### Propose Only
```
/folder-organizer propose
```
Generates restructuring plan without execution.

### Archive Inactive
```
/folder-organizer archive
```
Moves inactive projects to archive/.

### Update Indexes
```
/folder-organizer index
```
Regenerates all navigation files.

## Configuration

Create `.opencode/skill/folder-organizer/config.yaml` to customize:

```yaml
# Categories to skip
skip_categories:
  - config  # Don't move hidden config dirs

# Custom category mappings
custom_mappings:
  "Bank docs": data/banking
  "fataplus": docs/business
  "temp_scraper": apps/tools

# Archive threshold (days since last commit)
archive_threshold_days: 180

# Protected directories (never move)
protected:
  - .git
  - node_modules
  - .next
  - venv

# Index files to update
index_files:
  - FATAPLUS_INDEX.md
  - project-context.md
  - agent.md
```

## Fataplus-Specific Mappings

Based on the workspace analysis, these mappings are recommended:

| Current Location | Proposed Location | Reason |
|------------------|-------------------|--------|
| `Agency-Web/` | `apps/web/agency-web/` | Astro marketing site |
| `fataplus-os/` | `apps/web/fataplus-os/` | Next.js SaaS app |
| `temp_scraper/` | `apps/tools/facebook-scraper/` | Python tool |
| `Bank docs/` | `data/banking/` | Financial data |
| `fataplus/` | `docs/business/` | Business PDFs |
| `Documentation/` | `docs/technical/` | Technical reports |
| `docs/` | `docs/strategy/` | 2026 planning |
| `Repos/` | `repos/` | Git repositories |
| `Resources/` | `resources/` | Assets and guides |
| `Facturation/` | `docs/financial/invoices/` | Invoicing |
| `CodeAndScale/` | `docs/proposals/` | Vendor proposals |
| `Fataplus-Master-Dashboard/` | `apps/tools/dashboard/` | Internal tool |
| `.bmad/` | `config/bmad/` | Keep at root (special) |
| Root Python scripts | `scripts/python/` | Utility scripts |
| Root JSON data | `data/exports/` | Data files |

## Notes

- This skill respects the BMAD framework already in place
- French language documentation is preserved
- Index files are updated to reflect new structure
- Git history is preserved when using `git mv`

## Error Handling

| Error | Recovery |
|-------|----------|
| File in use | Skip and log for manual handling |
| Permission denied | Report and continue |
| Git conflict | Abort and show resolution steps |
| Missing source | Log warning and skip |

## Rollback

A rollback script is generated at `migration-rollback.sh`:

```bash
#!/bin/bash
# Generated: [timestamp]
# Reverses all move operations

mv apps/web/agency-web Agency-Web
mv apps/web/fataplus-os fataplus-os
# ... etc
```

Run with `bash migration-rollback.sh` to undo changes.

---

## Quick Start

1. **Audit your workspace:**
   ```
   Analyze the Fataplus directory structure and categorize all items
   ```

2. **Review the proposal:**
   ```
   Show me the proposed restructuring plan for Fataplus
   ```

3. **Execute with confirmation:**
   ```
   Reorganize the Fataplus workspace according to the plan
   ```

4. **Update documentation:**
   ```
   Regenerate all index and navigation files
   ```

---

**Version:** 1.0.0
**Author:** Generated for Fataplus project
**Last Updated:** 2026-01-15
