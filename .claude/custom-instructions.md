# Fataplus AI Agent Instructions

## First Step
Always read `/Users/fefe/Documents/Fataplus/project-context.md` before any exploration.

## Key Rules
1. This is a **multi-project workspace** - ask which project to work on
2. **Fataplus targets** Madagascar/European markets
3. **French docs exist** - respond in English unless requested otherwise
4. **BMAD methodology** is used for product development
5. Use **Glob over Bash** for file searches
6. Prefer **Task tool with Explore agent** for codebase exploration

## Quick Reference
- Main SaaS: `fataplus-os/` (Next.js 15)
- Agency site: `Agency-Web/` (Astro 5)
- Scraper: `temp_scraper/` (Python)
- Strategy docs: `docs/`
- Repos: `Repos/` (10+ Git repos)

## When Indexing
- Create/maintain `project-context.md` as single source of truth
- Don't re-explore entire structure unnecessarily
- Focus on active project being modified
