# Agri-AI Design Lab Playbook

**Engagement:** Smart Irrigation Companion
**Version:** 0.1
**Prepared for:** FOFIFA Agritech Lab & Alaotra-Mangoro Cooperative Network
**Date:** 2025-11-10

## Executive Summary
The Smart Irrigation Companion combines predictive irrigation alerts, cooperative scheduling, and farmer feedback loops to raise yields by 15% and reduce water usage by 20%. Leveraging FOFIFA insights, MeteoMada forecasts, and Fataplus product design standards, the program delivers bilingual, offline-ready experiences alongside a no-code delivery plan and adoption roadmap suitable for both client pilots and the 2026 bootcamp cohorts.

## 1. Mission & Context
See kickoff canvas (`docs/agri-ai-design-lab/engagement-kickoff-smart-irrigation-2025-11-10.md`). Key highlights:
- **Problem:** Farmers lack timely irrigation guidance, leading to waste and crop stress.
- **Scope:** 800 rice farmers; 14-week pilot; €35k budget.
- **Stakeholders:** FOFIFA leadership, cooperative champions, MeteoMada data partners, Fataplus studio team, bootcamp cohort.

## 2. Insights & Personas
Reference research digest (`docs/agri-ai-design-lab/research/research-digest-smart-irrigation-2025-11-10.md`).
- Farmers copy neighboring plots due to uncertain weather.
- Trainers demand offline-first onboarding assets.
- Data team requires clear governance alignment.
- Persona spotlight: **Voahirana Randria** (cooperative irrigation scheduler) with JTBD to ensure equitable watering slots; opportunities include predictive dashboards and SMS alerts (`docs/agri-ai-design-lab/personas/persona-voahirana-irrigation-manager-2025-11-10.md`).

## 3. AI Concept Portfolio
Derived from `insight-to-concept` workflow (draft). Priority concepts:
1. **Predictive Watering Advisor** – SMS and app alerts with explainable recommendations.
2. **Cooperative Scheduling Optimizer** – Drag/drop calendar resolving pump conflicts.
3. **Impact Analytics Coach** – Automated reporting to MAEP and donors with SDG tracking.

Each concept scored high on impact and medium on feasibility, with data readiness contingent on MeteoMada API access and pump availability records.

## 4. Experience & Design System
Prototype plan (`docs/agri-ai-design-lab/concept-to-prototype-smart-irrigation-2025-11-10.md`) sets UX/UI direction:
- Alert feed, irrigation timeline, weather insight card, cooperative dashboard.
- Figma components: buttons, cards, badges, bilingual typography, offline states.
- Accessibility: high contrast for outdoor use, voice prompts, SMS fallback.

## 5. Build & Delivery Plan
No-code sprint plan (`docs/agri-ai-design-lab/nocode/nocode-mvp-sprint-smart-irrigation-2025-11-10.md`):
- **Stack:** Bubble admin app, FlutterFlow mobile companion, Supabase backend, Twilio SMS.
- **Sprints:** 0 (setup), 1 (alerts), 2 (scheduling), 3 (analytics & adoption).
- **Automations:** Bubble workflows, Supabase metrics, Zapier escalations, OpenAI prompts for human-readable tips.

## 6. Data & Infrastructure Readiness
Data readiness audit (`docs/agri-ai-design-lab/data-readiness/data-readiness-audit-smart-irrigation-2025-11-10.md`) rates the engagement **Medium-Low** with remediation roadmap:
- Digitize pump logs and assign data stewards.
- Secure MeteoMada API contract and caching layer by late November.
- Implement Supabase storage with governance and anonymization.

## 7. CX/DX Roadmap
Artifacts informing adoption strategy:
- Service blueprint (`docs/agri-ai-design-lab/service-blueprint-smart-irrigation-2025-11-10.md`) aligning frontstage/backstage operations, AI touchpoints, and safeguards.
- CX journey map (`docs/agri-ai-design-lab/journeys/cx-journey-smart-irrigation-2025-11-10.md`) detailing Voahirana’s path from awareness to advocacy with improvement experiments.
- Bootcamp lesson kit (`docs/agri-ai-design-lab/bootcamp-lessons/lesson-smart-irrigation-design-sprint-2025-11-10.md`) and feedback report (`docs/agri-ai-design-lab/bootcamp-feedback/feedback-smart-irrigation-lab-2025-11-19.md`) to keep training and delivery synchronized.

## 8. Metrics & Impact
- **Primary KPIs:** Yield lift (+15%), water savings (+20%), weekly active users (≥70%), NPS ≥35.
- **Supporting:** Onboarding time (<15 min), bootcamp satisfaction (≥4.2/5), schedule conflict resolution rate.
- Analytics instrumentation to capture alert acknowledgments, offline usage, feedback submissions.

## 9. Implementation Checklist
- [x] Kickoff canvas completed
- [x] Research digest created
- [x] Persona drafted
- [x] Prototype plan defined
- [x] No-code sprint backlog defined
- [x] Data readiness audit compiled
- [x] AI service blueprint drafted
- [x] CX journey map outlined
- [x] Bootcamp lesson kit + feedback captured
- [ ] Twilio pilot numbers provisioned

## Appendices
- **Links & Assets:** Figma board (to be added), Bubble workspace (pending), MeteoMada API docs, concept briefs.
- **Bootcamp Module Notes:** Convert this engagement into capstone sprint for 2026 cohort; Bootcamp Mentor to produce lesson kit using `bootcamp-lesson-kit` workflow.
- **Glossary:**
  - **MAEP:** Ministère de l’Agriculture, de l’Élevage et de la Pêche
  - **FOFIFA:** National Center for Applied Research and Rural Development
  - **SDG:** Sustainable Development Goals
