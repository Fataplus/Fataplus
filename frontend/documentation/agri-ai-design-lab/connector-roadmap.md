# Connector Roadmap – Agri-AI Design Lab

## Priority Integrations

1. **Figma API Sync**
   - Purpose: Pull component tokens, publish redlines, attach prototype links automatically.
   - Actions: Create Figma personal access token, map style IDs to design system root, script exporter task (`scripts/figma-sync.mjs` now available).
   - Status: Pending token + component inventory.

2. **Bubble / FlutterFlow Deployment Hooks**
   - Purpose: Trigger environment deploys and retrieve build URLs from workflows.
   - Actions: Secure API keys, define REST calls for deployment status, add task scripts for nocode updates (`scripts/nocode-deploy.mjs` for dry runs).
   - Status: Specs drafted in no-code sprint plan.

3. **Notion / Confluence Playbook Publishing**
   - Purpose: Sync playbook outputs to knowledge base with bilingual formatting.
   - Actions: Configure integration token, map database/page IDs, transform Markdown to Notion blocks (`scripts/notion-sync.mjs` preview payload ready).
   - Status: Requires content model definitions.

4. **Twilio SMS Alerts**
   - Purpose: Validate alert flows during prototype pilots.
   - Actions: Provision test numbers, set up webhook endpoints, capture usage metrics.
   - Status: Awaiting budget approval.

## Automation Backlog
- Design token sync task (Figma → JSON → CSS/Flutter).
- MeteoMada API monitor with fallback cache refresh.
- Translation helper leveraging DeepL/LLM for FR/MG parity.
- Bootcamp cohort tracker (attendance, submissions, feedback loops).

## Next Steps
- Assign technical owner per integration.
- Draft security checklist for API credential storage.
- Create tasks stubs under `.bmad/custom/modules/agri-ai-design-lab/tasks/` as connectors mature.
