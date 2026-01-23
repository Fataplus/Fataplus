# Build & Run Log: Madagascar Agri Stakeholder Crawl4AI Pipeline

## 1. Build & Integration

- All plans and strategies ([plan_persona_crawl4ai.md](plan_persona_crawl4ai.md), [plan_personas_seeds.md](plan_personas_seeds.md), [plan_crawl4ai_strategy.md](plan_crawl4ai_strategy.md), [plan_crawl4ai_convergence.md](plan_crawl4ai_convergence.md), [plan_crawl4ai_validation.md](plan_crawl4ai_validation.md), [plan_crawl4ai_pipeline.md](plan_crawl4ai_pipeline.md)) have been integrated into the pipeline design.
- The pipeline script (`madagascar_stakeholders_pipeline.py`) is ready to run, with all categories, personas, seeds, convergence, and validation logic.

## 2. Run Steps

- For each category/persona:
  - Crawl all expanded seed URLs using Crawl4AI and LLM extraction.
  - For each actor, crawl at least one additional independent source for validation.
  - Merge/validate all fields using LLM; set validation_status and notes.
  - Log all queries, URLs, and validation steps.
  - Apply convergence logic (stop when new unique actors <2% over 10 queries or 10 queries with no new actors).
- Deduplicate and validate all actors.
- Output deduplicated CSV, Markdown report, summary, and full query log.

## 3. Logging

- All queries, URLs, and extraction steps are logged in `query_log.jsonl`.
- All validation steps and sources are logged in `validation_log.jsonl`.
- Convergence status and stopping reasons are logged per category.

## 4. Next Step

- Run the pipeline script:  
  ```
  python3 madagascar_stakeholders_pipeline.py
  ```
- Monitor logs and outputs for real, validated, persona-driven stakeholder data.
- Review and analyze the CSV, Markdown, and logs for completeness and reproducibility.