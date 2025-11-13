# Data Readiness Audit

**Engagement:** Smart Irrigation Companion
**Concept:** Predictive Watering Advisor & Cooperative Scheduling
**Date:** 2025-11-10

## 1. Data Inventory
| Source | Owner | Format | Refresh | Access | Notes |
| --- | --- | --- | --- | --- | --- |
| MeteoMada Forecast API | MeteoMada | JSON REST | Hourly | API key (in negotiation) | Provides temp, humidity, rainfall; requires caching |
| FOFIFA Historical Yields | FOFIFA Data Lab | CSV (Google Drive) | Seasonal | ShareLink + manual download | Need 2019-2023 data, currently partial |
| Cooperative Pump Logs | Alaotra Cooperatives | Paper + Excel | Daily manual | Physical notebooks / shared PC | Requires digitization; propose Google Forms |
| Farmer Feedback Diaries | Pilot farmers | WhatsApp voice/text | Ad hoc | WhatsApp export | Must transcribe (FR/MG) and anonymize |
| Soil Moisture Sensors (limited plots) | NGO Partner | MQTT feed | 10 min | Local gateway | Small coverage (15 plots); calibrate vs ground truth |

## 2. Quality & Governance
| Criterion | Assessment | Gaps | Actions |
| --- | --- | --- | --- |
| Completeness | Medium | Missing evapotranspiration data; pump logs not digitized | Launch data digitization sprint with cooperative interns |
| Accuracy | Medium | Manual entries prone to error | Cross-verify with agronomist audits weekly |
| Latency | Medium-High | Weather API is real-time; cooperative data delayed | Automate data capture to reduce lag to <24h |
| Security & Privacy | Medium | Farmer identifiers in WhatsApp logs | Apply anonymization; align with Malagasy data protection law |
| Governance | Low | No defined ownership for data QA | Assign data steward (FOFIFA) and create SOP |

## 3. Infrastructure Review
- Current stack & integrations: Mix of Google Drive, paper ledgers, MeteoMada REST API, pilot MQTT device. No centralized data warehouse.
- Connectivity & offline considerations: Cooperatives rely on intermittent 3G; need local caching + sync.
- Security & compliance notes: Sensitive farmer data stored in ad hoc channels; must implement secure storage (Supabase with RLS, encryption).

## 4. Readiness Summary
- Overall readiness rating: **Medium-Low**.
- Key blockers: Lack of digitized pump logs, incomplete historical weather/soil data, unclear governance.
- Remediation roadmap:
  1. Digitize pump logs via Google Forms/Sheets by 2025-11-20.
  2. Secure MeteoMada API contract + caching layer by 2025-11-25.
  3. Assign data steward and define QA SOP by 2025-11-18.
  4. Implement secure data storage (Supabase + retention policy) by Sprint 1.

## 5. Next Steps
- Schedule workshop with FOFIFA and cooperative data leads to confirm remediation owners.
- Prioritize data ingestion scripts within Sprint 0.
- Update connector roadmap once API contracts finalized.
