# Madagascar Agriculture Stakeholders Directory: Real-World, Persona-Driven Crawl4AI Pipeline Plan

## 1. Stakeholder Categories & Real-World Use Cases

**A. Government institutions, agencies, research centers**
- Persona: Policy analyst, ministry official, agri project manager
- Use case: Find all regulatory bodies, research centers, and their mandates, contacts, and current agri policy priorities.

**B. Public policy programmes and projects**
- Persona: Donor project officer, local implementer, journalist
- Use case: Map all active and recent government/donor agri programmes (PNIA, PAPRIZ, etc.), with scope, partners, and impact metrics.

**C. International organisations, development banks, donors**
- Persona: Donor coordination lead, grant applicant, evaluator
- Use case: List all orgs funding or implementing agri projects in Madagascar, with project portfolios, contacts, and funding rounds.

**D. Farmers’ associations, cooperatives, unions**
- Persona: Cooperative leader, extension agent, agri input supplier
- Use case: Identify all registered and informal farmer groups, their crops, regions, leadership, and contact points.

**E. Private agribusinesses (production, processing, inputs, logistics, finance, insurance, marketplaces)**
- Persona: SME founder, exporter, agri-fintech, insurance agent
- Use case: List all major and emerging agri companies, their products, value chain roles, and business contacts.

**F. AgriTech, FoodTech, ClimateTech, bio-innovation startups**
- Persona: Startup founder, VC, accelerator manager
- Use case: Map all agri/food/climate tech startups, their solutions, funding, and leadership.

**G. NGOs and non-profits (rural dev, food security, climate, biodiversity)**
- Persona: NGO program manager, donor, community leader
- Use case: List all NGOs, their focus areas, projects, and local contacts.

**H. Academic bodies, universities, vocational schools, incubators**
- Persona: Student, researcher, incubator manager
- Use case: Identify all agri-focused academic and training institutions, research labs, and incubators.

**I. Investors, accelerators, venture funds, business-angel networks**
- Persona: Startup founder, investor, accelerator scout
- Use case: List all agri-focused investors, accelerators, and their portfolios.

**J. Professional federations, chambers, think-tanks**
- Persona: Policy advocate, business leader, researcher
- Use case: Map all federations, chambers, and think-tanks influencing agri policy and business.

**K. Certification bodies and laboratories**
- Persona: Exporter, quality manager, standards officer
- Use case: List all certifiers (organic, fair-trade, quality) and labs, with scope and contacts.

**L. Major events, trade fairs, hackathons, competitions**
- Persona: Startup, SME, donor, journalist
- Use case: List all major agri events, fairs, hackathons, and competitions.

---

## 2. Seed URLs & Expansion Strategy

- For each category, start with 3–5 authoritative seed URLs (official portals, directories, donor project pages, press, LinkedIn, Crunchbase, AngelList, academic journals).
- Use Crawl4AI to crawl each seed, extract links, and expand to new relevant pages (max depth 2–3).
- For each new page, use LLM extraction to identify new actors, URLs, and data fields.
- Log every query, crawl, and extraction step.

---

## 3. Iterative Deep Search & Convergence Logic

- For each category:
  - Crawl seeds, extract actors, expand to new links.
  - After every 10 queries, compute % of new unique actors.
  - Stop if new unique actors <2% over last 10 queries, or after 10 queries with no new actors.
  - Log all queries, URLs, and actor discoveries.

---

## 4. Data Validation & Cross-Source Consistency

- For each actor, crawl at least two independent sources (e.g., official site + donor registry, or press + LinkedIn).
- Use LLM to merge/validate fields (e.g., leadership, metrics, contacts).
- Flag actors with conflicting or missing data for manual review.

---

## 5. Output & Reproducibility

- Save all actors to a deduplicated CSV (`stakeholders_madagascar.csv`).
- Print a Markdown report with clickable sources, real-world personas, and use cases.
- Summarize key insights, gaps, and trends (≤ 500 words).
- Output the full query/crawl log and all code snippets used.
- All code and logs are reproducible; user can re-run with Crawl4AI and OpenAI API key.

---

## 6. Example Crawl4AI Extraction Flow (per category)

1. For each seed URL:
   - Run Crawl4AI with LLM extraction using the Stakeholder schema.
   - For each extracted actor, add to database if new.
   - For each actor, extract all available fields and primary sources.
   - For each actor, crawl at least one additional source for validation.
   - Expand crawl to new links found on each page (within allowed domains).
2. After each batch, check convergence criteria.
3. When converged, deduplicate, validate, and output.

---

## 7. Real-World Persona Examples

- **Marie, a rice cooperative leader in Alaotra-Mangoro:** Needs to find all government and donor programs supporting rice value chain, and connect with agri insurance providers.
- **Jean, a startup founder in Antananarivo:** Wants to pitch his agri-fintech to local accelerators and find investors focused on Madagascar.
- **Lalao, a donor project officer:** Needs a full list of NGOs and cooperatives in the vanilla sector, with contacts and recent project metrics.
- **Hery, a policy analyst:** Needs to map all certification bodies and labs for Madagascar’s export crops, and cross-check their international recognitions.

---

## 8. Next Steps

- Expand and refine seed URLs for each category.
- Implement the full async Crawl4AI pipeline as per the plan.
- Run, validate, and output all results as specified.