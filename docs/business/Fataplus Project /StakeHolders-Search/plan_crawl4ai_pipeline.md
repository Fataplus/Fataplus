# Build & Run: Full Persona-Driven Crawl4AI Pipeline for Madagascar Agri Stakeholders

## 1. Pipeline Steps

1. **Initialize**
   - Load all category personas, expanded seed URLs, and query templates.
   - Set up logging for all queries, URLs, and extraction steps.

2. **Iterative Crawl & Extraction (per category)**
   - For each persona and category:
     - For each seed URL:
       - Run Crawl4AI with LLM extraction (Stakeholder schema, persona-driven prompt).
       - For each extracted actor:
         - Add to database if new.
         - Log all sources, queries, and URLs.
         - For each actor, crawl at least one additional independent source (from known registries, press, LinkedIn, donor project pages, or extracted links).
         - Use LLM to merge/validate all fields; set validation_status and notes.
         - If conflicting or missing data, flag for manual review.
       - Expand crawl to new links found on each page (within allowed domains, max depth 2–3).
     - After every 10 queries, check convergence criteria (new unique actors <2% or 10 queries with no new actors).
     - Stop when converged; log all steps.

3. **Deduplication & Validation**
   - Deduplicate all actors by official name and web domain.
   - For each, ensure at least two sources and validation_status.
   - Output validation log.

4. **Output**
   - Save deduplicated, validated CSV (`stakeholders_madagascar.csv`).
   - Print Markdown report with clickable sources, personas, and use cases.
   - Summarize key insights, gaps, and trends (≤ 500 words).
   - Output the full query/crawl log and all code snippets for reproducibility.

## 2. Logging

- Log every query, crawl, and extraction step (query_log.jsonl).
- Log all validation steps and sources (validation_log.jsonl).
- Log convergence status and reason for stopping per category.

## 3. Code Snippet (Main Loop Skeleton)

```python
import os
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, LLMConfig, LLMExtractionStrategy
from pydantic import BaseModel, Field

# ... (schemas and config as in madagascar_stakeholders_pipeline.py) ...

async def crawl_category(category, persona, seeds, llm_config, query_log, seen_urls, seen_names):
    # Main crawl loop with convergence logic and validation
    pass

async def main():
    # For each category/persona, run crawl_category
    # Merge, deduplicate, validate, output
    pass

if __name__ == "__main__":
    asyncio.run(main())
```

## 4. Next Step

- Integrate all plans ([plan_persona_crawl4ai.md](plan_persona_crawl4ai.md), [plan_personas_seeds.md](plan_personas_seeds.md), [plan_crawl4ai_strategy.md](plan_crawl4ai_strategy.md), [plan_crawl4ai_convergence.md](plan_crawl4ai_convergence.md), [plan_crawl4ai_validation.md](plan_crawl4ai_validation.md)) into the pipeline script.
- Build and run the full pipeline, ensuring all actors are validated, deduplicated, and all steps are logged.