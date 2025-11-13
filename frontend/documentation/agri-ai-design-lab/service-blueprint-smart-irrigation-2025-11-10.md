# AI Service Blueprint

**Scenario:** Irrigation Alert & Scheduling Cycle
**Date:** 2025-11-10

| Stage | User Actions | Frontstage (UX/UI) | Backstage (Ops) | AI Assist | Support Systems |
| --- | --- | --- | --- | --- | --- |
| Awareness | Farmer hears about companion via cooperative briefing | Poster QR code, SMS invite | Cooperative ambassador explains benefits | AI-generated outreach messages tailored by persona | Notion knowledge base, WhatsApp broadcast |
| Prepare | Farmer updates profile, sets preferred channel | Figma-designed onboarding wizard, SMS prompts | Field ethnographer collects baseline data | AI recommends default settings based on crop + location | Supabase profiles, MeteoMada baseline data |
| Receive Alert | Farmer gets watering recommendation at dawn | Mobile push & SMS alert with rationale | Scheduling engine queues alert | AI combines weather forecast + pump availability + soil data | MeteoMada API, scheduling microservice |
| Confirm & Execute | Farmer acknowledges alert, updates status | Confirmation button, offline SMS keyword | Cooperative verifies pump availability | AI detects conflicts, suggests alternative slot if clash | Bubble admin dashboard, Twilio logs |
| Log Feedback | Farmer records success or issues | Voice/text feedback form | Agronomist reviews and flags anomalies | AI summarizes feedback, flags risk patterns | OpenAI summarizer (human-in-loop), Supabase feedback table |
| Report Impact | Cooperative and sponsor review metrics | Analytics dashboard with KPIs | CX strategist compiles report | AI auto-generates weekly summary + SDG alignment | Supabase analytics, Google Sheets export |

## Risks & Safeguards
- Human-in-the-loop: Agronomist approval for AI schedule overrides; cooperative coordinator validates alerts weekly.
- Fail-safes: Offline SMS fallback, manual logs kept for audit, escalation workflow for critical alerts.
- Training & change needs: Training modules for alert interpretation, pump maintenance guidelines, data entry SOP.

## Metrics
- Success indicators: Alert acknowledgment rate ≥ 75%, schedule conflicts resolved < 12h, water savings 20%, user satisfaction ≥ 4/5.
- Monitoring plan: Daily alert logs, weekly cooperative review, monthly impact report to sponsors.

## Next Steps
- Build service blueprint visual in Figma for workshops.
- Align operations playbook with cooperative champions.
- Integrate blueprint checkpoints into bootcamp lesson materials.
