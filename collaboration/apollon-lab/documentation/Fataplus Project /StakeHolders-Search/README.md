# Madagascar Agriculture Stakeholders Directory

End-to-end, reproducible workflow to build an exhaustive directory of stakeholders involved in agriculture in Madagascar.

Scope confirmed
- Sources: Open + paid allowed (Crunchbase, LinkedIn Sales Navigator), public pages prioritized
- Languages: FR, EN, MG
- Recency: ≥ 2019
- Focus commodities: vanilla, cloves, rice, cacao, coffee
- Coverage priority: national first, then regional

Repository layout
- [`plan.md`](plan.md)
- [`data/actors.csv`](data/actors.csv)
- [`data/sources.csv`](data/sources.csv)
- [`logs/queries.csv`](logs/queries.csv)
- [`reports/Stakeholders-Madagascar.md`](reports/Stakeholders-Madagascar.md)
- [`scripts/search_scrape.py`](scripts/search_scrape.py)
- [`scripts/pdf_extract.py`](scripts/pdf_extract.py)
- [`scripts/deduplicate_normalize.py`](scripts/deduplicate_normalize.py)
- [`scripts/ingest_results.py`](scripts/ingest_results.py)
- [`requirements.txt`](requirements.txt)

Quickstart

1) Create virtual environment and install dependencies
- macOS/Linux:
  ```
  python3 -m venv .venv
  source .venv/bin/activate
  python -m pip install --upgrade pip
  python -m pip install -r requirements.txt
  ```
- Windows (PowerShell):
  ```
  py -m venv .venv
  .\.venv\Scripts\Activate.ps1
  python -m pip install --upgrade pip
  python -m pip install -r requirements.txt
  ```

2) Run a discovery batch (Government institutions)
- Save results to JSONL (HTML scraping of engines; add --scrape to fetch page signals):
  ```
  source .venv/bin/activate && \
  python scripts/search_scrape.py \
    --category "Government institutions" \
    --engine bing ddg \
    --limit 20 \
    --delay 1.5 \
    --locale fr \
    --scrape \
    > logs/gov_search_1.jsonl
  ```
- This appends the query metadata to [`logs/queries.csv`](logs/queries.csv)

3) Ingest results into CSVs
- Convert JSONL into initial rows in actors and source provenance:
  ```
  source .venv/bin/activate && \
  python scripts/ingest_results.py \
    --input logs/gov_search_1.jsonl \
    --category "Government institutions" \
    --locale fr
  ```

4) Deduplicate and normalize
- Merge near-duplicates using multi-signal grouping and fuzzy name matching:
  ```
  source .venv/bin/activate && \
  python scripts/deduplicate_normalize.py \
    --input data/actors.csv \
    --output data/actors_deduped.csv \
    --report logs/dedup_report.jsonl \
    --threshold 0.90
  ```

5) PDF/DOCX extraction (optional)
- Extract emails/phones/links from downloaded docs:
  ```
  source .venv/bin/activate && \
  python scripts/pdf_extract.py --dir ./downloads --recursive --output logs/pdf_scan.jsonl
  ```

Search templates (examples)
- Government
  - site:.gov.mg agriculture Madagascar
  - site:gouv.mg agriculture Madagascar
  - site:minae.gov.mg OR site:maep.gov.mg programme agriculture
  - filetype:pdf Madagascar agriculture rapport annuel site:.gov.mg
- Donors/IFIs
  - site:fao.org Madagascar agriculture project
  - site:ifad.org Madagascar project agriculture
  - site:worldbank.org Madagascar agriculture
  - site:usaid.gov Madagascar agriculture
  - site:afd.fr Madagascar agriculture
  - site:giz.de Madagascar agriculture
  - site:europa.eu Madagascar agriculture fund
- Cooperatives
  - coopérative agricole Madagascar
  - union coopérative agricole Madagascar
- Private/Commodities
  - Madagascar seed company
  - Madagascar fertilizer distributor
  - Madagascar food processing company
  - Madagascar agricultural export company vanilla OR cloves OR rice OR cacao OR coffee
- Academia
  - site:.mg université agriculture
  - centre de recherche agriculture Madagascar

Stop rules (enforced by the search tool)
- Stop when the rate of new unique actors discovered in the last 10 queries < 2%
- Or when 10 successive queries yield no novel actor

Data fields
- Master dataset: [`data/actors.csv`](data/actors.csv) (see headers)
- Provenance: [`data/sources.csv`](data/sources.csv) — each data point mapped to a source URL and date
- Queries log: [`logs/queries.csv`](logs/queries.csv)

Reproducibility
- All exact queries appended to [`logs/queries.csv`](logs/queries.csv)
- Scripts are plain Python, no browser automation by default
- For JS-heavy sites or large-scale crawling, use Hyperbrowser MCP tools (documented separately)

Notes
- Always cross-validate important fields (leadership, metrics, funding) with ≥ 2 independent sources
- Prefer official pages and donor registries; keep publication dates for each source in [`data/sources.csv`](data/sources.csv)
- Keep commodity focus in mind: vanilla, cloves, rice, cacao, coffee