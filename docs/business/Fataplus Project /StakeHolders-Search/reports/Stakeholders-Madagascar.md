# Madagascar Agriculture Stakeholders Directory - Report
Status update (interim)
- Datasets created: [data/actors.csv](data/actors.csv), [data/sources.csv](data/sources.csv), [logs/queries.csv](logs/queries.csv)
- Scripts available: [scripts/search_scrape.py](scripts/search_scrape.py), [scripts/seed_crawl.py](scripts/seed_crawl.py), [scripts/ingest_results.py](scripts/ingest_results.py), [scripts/clean_filter.py](scripts/clean_filter.py), [scripts/deduplicate_normalize.py](scripts/deduplicate_normalize.py)
- Government batch: initial discovery, seed-crawl, and cleaning complete
  - Cleaned government subset: [data/actors_gov.csv](data/actors_gov.csv)
  - Sources log appended: [data/sources.csv](data/sources.csv)

Current government institutions captured (seed domains)
- Ministère de l’Agriculture et de l’Élevage (MAEP) — https://maep.gov.mg/
- FOFIFA (Centre National de la Recherche Appliquée au Développement Rural) — https://fofifa.mg/
- INSTAT (Institut National de la Statistique) — https://instat.mg/
- BNGRC (Bureau National de Gestion des Risques et des Catastrophes) — https://bngrc.gov.mg/
- ONN (Office National de Nutrition) — https://onn.mg/

Reproducibility commands (run from repo root)
- Seed-crawl core gov domains and ingest
  source .venv/bin/activate
  python scripts/seed_crawl.py --seeds https://maep.gov.mg/ https://fofifa.mg/ https://instat.mg/ https://bngrc.gov.mg/ https://onn.mg/ --max-pages 15 --delay 1.0 --output logs/gov_seed.jsonl
  python scripts/ingest_results.py --input logs/gov_seed.jsonl --category "Government institutions" --locale fr
  python scripts/clean_filter.py --input data/actors.csv --output data/actors_clean.csv --category "Government institutions"
  python scripts/deduplicate_normalize.py --input data/actors_clean.csv --output data/actors_gov.csv --report logs/dedup_gov.jsonl --threshold 0.90

Notes and next steps
- The initial search engine results contained travel/forum noise; filters are now in place and further domain-targeted queries will continue to improve precision.
- Next batches: Public policy programmes; International organisations/donors; Cooperatives; Private agribusinesses; Academia; NGOs; etc. Queries and ingestion will follow the same log-and-scrape pipeline.

Executive summary (≤ 500 words)

[To be auto-generated after data consolidation]

Methodology

- Data sources: government portals, donor databases, company sites, social media, press.
- Languages: FR, EN, MG. Recency: ≥ 2019.
- Paid sources used where necessary: Crunchbase, LinkedIn Sales Navigator (public pages prioritized).
- Reproducibility: exact queries logged in [logs/queries.csv](logs/queries.csv), scripts in [scripts/](scripts).

Ecosystem map by category

- Government institutions, agencies, research centers
- Public policy programmes and projects
- International organisations, development banks, donors
- Farmers’ associations, cooperatives, unions
- Private agribusinesses (inputs, production, processing, logistics, finance, insurance, marketplaces)
- AgriTech, FoodTech, ClimateTech, bio-innovations
- NGOs and non-profits
- Academic bodies, universities, vocational schools, incubators
- Investors, accelerators, venture funds, angel networks
- Professional federations, chambers, think-tanks
- Certification bodies and laboratories
- Major events, trade fairs, hackathons, competitions

Top actors by value-chain segment

[Summary tables will be generated from [data/actors.csv](data/actors.csv)]

Notable programmes and partnerships

[Highlights across FAO, IFAD, World Bank, USAID, EU, AFD, GIZ, SADC, COMESA; cross-linked to [data/sources.csv](data/sources.csv)]

Trends and gaps

[To be synthesized after dataset completion]

Appendix: reproducibility

- Exact search queries: see [logs/queries.csv](logs/queries.csv)
- Scraping and parsing snippets: see [scripts/search_scrape.py](scripts/search_scrape.py), [scripts/pdf_extract.py](scripts/pdf_extract.py), [scripts/deduplicate_normalize.py](scripts/deduplicate_normalize.py)
- Data dictionary: see [plan.md](plan.md) and headers inside [data/actors.csv](data/actors.csv) and [data/sources.csv](data/sources.csv)