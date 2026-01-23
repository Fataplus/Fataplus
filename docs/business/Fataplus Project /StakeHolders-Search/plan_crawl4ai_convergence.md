# Convergence Logic and Validation for Madagascar Agri Stakeholder Crawl4AI Pipeline

## 1. Convergence Logic

- **Windowed new actor rate:**  
  - After every 10 queries/crawls per category, compute the % of new unique actors discovered in the last 10 queries.
  - If the rate of new unique actors falls below 2% over the last 10 queries, stop crawling for that category.
  - If 10 successive queries yield no novel actor, stop crawling for that category.
  - Log the number of new actors, total unique actors, and the stop condition for each batch.

- **Implementation in code:**  
  - Maintain a rolling window (list) of new actor counts per query.
  - After each query, append the count of new unique actors.
  - If the window is full (10 queries), check the average new actor rate.
  - If the rate is below 2% or 10 queries in a row yield zero new actors, break the loop for that category.
  - Log all queries, URLs, and actor discoveries for reproducibility.

## 2. Cross-Validation & Data Consistency

- **For each actor:**
  - Crawl at least two independent sources (e.g., official site + donor registry, or press + LinkedIn).
  - Use LLM to merge/validate fields (e.g., leadership, metrics, contacts).
  - If conflicting or missing data, flag for manual review (add a "validation_status" field: "validated", "conflict", "incomplete").
  - Log all validation steps and sources.

- **Implementation in code:**  
  - For each extracted actor, check if at least two primary sources are present.
  - If not, crawl additional sources (from known registries, press, or extracted links).
  - Use LLM to compare and merge data fields.
  - Add a validation status and notes field to the Stakeholder schema.

## 3. Logging and Output

- **For each batch and category:**
  - Log all queries, URLs, and actor discoveries.
  - Log convergence status and reason for stopping.
  - Log validation status for each actor.
  - Output a deduplicated, validated CSV and a Markdown report with clickable sources.
  - Output the full query log and all code snippets for reproducibility.

---

**Next step:**  
- Integrate this convergence and validation logic into the pipeline script.
- Build and run the full pipeline, ensuring all actors are validated and all steps are logged.