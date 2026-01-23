# Cross-Validation & Data Consistency for Madagascar Agri Stakeholder Pipeline

## 1. Cross-Validation Protocol

- For each extracted actor:
  - Crawl at least two independent sources (e.g., official site + donor registry, or press + LinkedIn, or donor project page + academic journal).
  - Use LLM to compare and merge all fields (official name, legal status, year founded, domains, value chain, products/services, scope, contacts, leadership, partnerships, metrics, sources).
  - If conflicting or missing data, flag for manual review and add a "validation_status" field:
    - "validated" (≥2 sources, consistent)
    - "conflict" (≥2 sources, conflicting)
    - "incomplete" (<2 sources or missing key fields)
  - Add a "validation_notes" field to explain any issues or manual review needs.

## 2. Implementation in Pipeline

- For each actor, after initial extraction:
  - If only one source, queue additional crawl(s) from:
    - Known registries (e.g., FAO, IFAD, World Bank, AFD, GIZ, SADC, COMESA, LinkedIn, Crunchbase, press, academic journals)
    - Outbound links from the actor’s page
    - Google/Bing/LinkedIn search for the actor’s name + "Madagascar"
  - Use LLM to merge/compare all fields and sources.
  - Set validation_status and validation_notes accordingly.
  - Log all validation steps and sources for reproducibility.

## 3. Output Fields

- Add to Stakeholder schema:
  - validation_status: str
  - validation_notes: str

## 4. Logging

- For each actor, log:
  - All sources used for validation
  - Validation status and notes
  - Any manual review required

---

**Next step:**  
- Integrate this cross-validation and logging logic into the pipeline script.
- Build and run the full pipeline, ensuring all actors are validated and all steps are logged.