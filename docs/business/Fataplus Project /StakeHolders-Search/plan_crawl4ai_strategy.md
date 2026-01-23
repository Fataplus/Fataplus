# Iterative Crawl4AI Search & Extraction Strategy for Madagascar Agri Stakeholders

## 1. Crawl4AI Extraction Strategy Overview

- For each category, use the expanded seed URLs (see [plan_personas_seeds.md](plan_personas_seeds.md)).
- For each seed, run Crawl4AI with LLM extraction using the Stakeholder schema and a persona-driven prompt.
- For each extracted actor, add to the database if new.
- For each actor, crawl at least one additional source (from extracted links, or a known registry/press/donor page) for cross-validation.
- Expand crawl to new links found on each page (within allowed domains, max depth 2–3).
- Log every query, crawl, and extraction step for reproducibility.

## 2. Advanced Query Simulation

- For each category, simulate advanced search queries (site:, filetype:, inurl:, intitle:, etc.) in Crawl4AI by:
  - Using seed URLs that match the query intent (e.g., site:maep.gov.mg for government, site:fao.org for donors).
  - Expanding to links that match the query pattern (e.g., URLs containing "programme", "project", "coop", "startup", "event", etc.).
  - Using LLM to extract and prioritize links likely to yield new actors.

## 3. LLM Extraction Prompt (per category/persona)

- Example prompt for Crawl4AI LLM extraction:
  ```
  Extract all real, up-to-date agriculture stakeholders in Madagascar in the category '{category}'.
  For each, extract: official name, legal status, year founded, domains of activity, value-chain segments, key products/services/technologies, geographic scope, contact info, leadership/ownership, partnerships/programmes/recognitions, latest metrics, and primary sources (URL, publication date).
  Use the persona: {persona}. Only return real organizations, companies, or events with verifiable web presence.
  ```

## 4. Link Expansion & Iteration

- After each crawl, extract all outbound links from the page.
- Filter links to:
  - Same domain or trusted partner domains (e.g., .mg, .org, .int, .com for known actors).
  - URLs containing category-relevant keywords (e.g., "cooperative", "startup", "event", "certification", "project", "programme").
- Add new links to the crawl queue if not already seen.
- Continue until convergence criteria are met.

## 5. Convergence Logic

- After every 10 queries/crawls per category:
  - Compute % of new unique actors discovered.
  - Stop if new unique actors <2% over last 10 queries, or after 10 queries with no new actors.
  - Log all queries, URLs, and actor discoveries.

## 6. Cross-Validation & Data Consistency

- For each actor, crawl at least two independent sources (e.g., official site + donor registry, or press + LinkedIn).
- Use LLM to merge/validate fields (e.g., leadership, metrics, contacts).
- Flag actors with conflicting or missing data for manual review.

## 7. Output & Logging

- Save all actors to a deduplicated CSV (`stakeholders_madagascar.csv`).
- Print a Markdown report with clickable sources, real-world personas, and use cases.
- Summarize key insights, gaps, and trends (≤ 500 words).
- Output the full query/crawl log and all code snippets used.
- All code and logs are reproducible; user can re-run with Crawl4AI and OpenAI API key.

---

**Next step:**  
- Implement this strategy in the pipeline script, using the personas and seeds for each category.
- Run the pipeline, monitor convergence, and validate all data as specified.