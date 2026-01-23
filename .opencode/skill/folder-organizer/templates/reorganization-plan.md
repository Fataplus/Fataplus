# Fataplus Workspace Reorganization Plan

**Generated:** 2026-01-15
**Workspace:** /Users/fefe/Documents/Fataplus
**Status:** PROPOSED (Awaiting Approval)

---

## Executive Summary

This plan proposes reorganizing the Fataplus workspace from a flat structure with 18+ directories into a well-organized hierarchy of 6 main categories.

| Metric | Current | Proposed |
|--------|---------|----------|
| Top-level directories | 18 | 6 |
| Root-level files | 12 | 5 |
| Maximum depth | Varies | 3-4 levels |
| Navigation index | Partial | Complete |

---

## Proposed Structure

```
Fataplus/
├── apps/                          # All applications
│   ├── web/
│   │   ├── agency-web/           # Astro 5 marketing site
│   │   └── fataplus-os/          # Next.js 15 SaaS dashboard
│   ├── mobile/
│   │   └── tsena-ny-tantsaha/    # Flutter marketplace
│   ├── tools/
│   │   ├── facebook-scraper/     # Python scraper (was temp_scraper)
│   │   └── master-dashboard/     # Internal dashboard
│   └── api/                       # Future API projects
│
├── repos/                         # Git repositories (cloned)
│   ├── active/
│   │   ├── Fataplus/
│   │   ├── Fataplus-Agritech-Platform/
│   │   ├── fataplus-cms/
│   │   ├── fataplus-builder/
│   │   └── fataplus-web25/
│   └── archive/
│       ├── fataplus-react/
│       ├── fataplus-app/
│       ├── fataplus-5faf2816/
│       └── FP-11/
│
├── docs/                          # All documentation
│   ├── strategy/                  # 2026 planning (was docs/)
│   │   ├── bmm-*.md
│   │   ├── brand-voice-2026.md
│   │   └── gtm-strategy-2026.md
│   ├── technical/                 # Technical reports (was Documentation/)
│   │   ├── rapport_financier_pic.md
│   │   └── rapport_technique_pic.md
│   ├── business/                  # Business docs (was fataplus/)
│   │   ├── pitch-decks/
│   │   ├── contracts/
│   │   └── proposals/
│   └── financial/                 # Financial (was Facturation/)
│       └── invoices/
│
├── data/                          # All data files
│   ├── banking/                   # Bank statements (was Bank docs/)
│   │   ├── statements/
│   │   └── converted_csvs/
│   ├── social/                    # Social media data
│   │   ├── facebook/
│   │   └── archive/
│   └── exports/                   # Generated exports
│
├── scripts/                       # Utility scripts
│   ├── python/                    # All root .py files
│   │   ├── analyze_facebook_data.py
│   │   ├── calculate_kpi.py
│   │   ├── scrape_facebook.py
│   │   └── clone_repos.py
│   └── shell/                     # Future shell scripts
│
├── resources/                     # Assets & guides (was Resources/)
│   ├── assets/
│   │   ├── logos/
│   │   └── icons/
│   └── guides/
│
├── archive/                       # Inactive/legacy items
│   └── legacy/
│
├── .bmad/                         # BMAD framework (keep at root)
├── .claude/                       # Claude settings (keep at root)
├── .superdesign/                  # SuperDesign (keep at root)
│
├── FATAPLUS_INDEX.md              # Main navigation (update)
├── project-context.md             # AI context (update)
└── agent.md                       # Agent reference (update)
```

---

## Migration Operations

### Phase 1: Move Applications (4 operations)

| Source | Destination | Action |
|--------|-------------|--------|
| `Agency-Web/` | `apps/web/agency-web/` | MOVE |
| `fataplus-os/` | `apps/web/fataplus-os/` | MOVE |
| `temp_scraper/` | `apps/tools/facebook-scraper/` | MOVE |
| `Fataplus-Master-Dashboard/` | `apps/tools/master-dashboard/` | MOVE |

### Phase 2: Organize Repositories (11 operations)

| Source | Destination | Action | Reason |
|--------|-------------|--------|--------|
| `Repos/Fataplus/` | `repos/active/Fataplus/` | MOVE | Active |
| `Repos/Fataplus-Agritech-Platform/` | `repos/active/Fataplus-Agritech-Platform/` | MOVE | Active |
| `Repos/fataplus-cms/` | `repos/active/fataplus-cms/` | MOVE | Active |
| `Repos/fataplus-builder/` | `repos/active/fataplus-builder/` | MOVE | Active |
| `Repos/fataplus-web25/` | `repos/active/fataplus-web25/` | MOVE | Active |
| `Repos/Fataplus---Tsena-ny-tantsaha/` | `apps/mobile/tsena-ny-tantsaha/` | MOVE | Mobile app |
| `Repos/fataplus-react/` | `repos/archive/fataplus-react/` | MOVE | Inactive |
| `Repos/fataplus-app/` | `repos/archive/fataplus-app/` | MOVE | Inactive |
| `Repos/fataplus-5faf2816/` | `repos/archive/fataplus-5faf2816/` | MOVE | Inactive |
| `Repos/Fataplus-Web/` | `repos/archive/Fataplus-Web/` | MOVE | Docs only |
| `Repos/FP-11/` | `repos/archive/FP-11/` | MOVE | Empty |

### Phase 3: Consolidate Documentation (5 operations)

| Source | Destination | Action |
|--------|-------------|--------|
| `docs/` | `docs/strategy/` | RENAME |
| `Documentation/` | `docs/technical/` | MERGE |
| `fataplus/` | `docs/business/` | MOVE |
| `CodeAndScale/` | `docs/proposals/` | MOVE |
| `Facturation/` | `docs/financial/invoices/` | MOVE |

### Phase 4: Organize Data (3 operations)

| Source | Destination | Action |
|--------|-------------|--------|
| `Bank docs/` | `data/banking/` | MOVE |
| Root JSON files | `data/social/` | MOVE |
| `Documents/` | `docs/justifications/` | MOVE |

### Phase 5: Move Scripts (6 operations)

| Source | Destination | Action |
|--------|-------------|--------|
| `analyze_facebook_data.py` | `scripts/python/` | MOVE |
| `calculate_kpi.py` | `scripts/python/` | MOVE |
| `scrape_facebook.py` | `scripts/python/` | MOVE |
| `scrape_test.py` | `scripts/python/` | MOVE |
| `clone_repos.py` | `scripts/python/` | MOVE |
| `extract_logs.py` | `scripts/python/` | MOVE |

### Phase 6: Organize Resources (1 operation)

| Source | Destination | Action |
|--------|-------------|--------|
| `Resources/` | `resources/` | RENAME (lowercase) |

### Phase 7: Clean Empty Directories (3 operations)

| Directory | Action |
|-----------|--------|
| `apps/` (current empty) | DELETE |
| `archive/` (current empty) | KEEP (will have content) |
| `data/` (current empty) | KEEP (will have content) |

---

## Files to Update

After migration, these files will be regenerated:

1. **FATAPLUS_INDEX.md** - Updated navigation tree
2. **project-context.md** - Updated paths and structure
3. **agent.md** - Updated file references
4. **docs/README.md** - New documentation hub
5. **apps/README.md** - New applications catalog

---

## Rollback Plan

A rollback script will be generated at:
```
.opencode/reports/migration-rollback.sh
```

To undo all changes:
```bash
bash .opencode/reports/migration-rollback.sh
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Broken imports | Medium | High | Update all path references |
| Git history loss | Low | Medium | Use `git mv` for all moves |
| Index file errors | Low | Low | Regenerate after migration |
| Hidden file issues | Low | Low | .bmad/.claude stay at root |

---

## Approval

To execute this plan:
1. Review all operations above
2. Confirm no active work in progress
3. Run: `/folder-organizer execute`

To modify the plan:
1. Edit `.opencode/skill/folder-organizer/config.yaml`
2. Run: `/folder-organizer propose`

---

**Status:** AWAITING APPROVAL
