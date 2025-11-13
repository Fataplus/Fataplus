# Agri-AI Design Lab Workflow Runbook

This runbook explains how to reproduce the Smart Irrigation deliverables using BMAD agents and workflows.

## Prerequisites
- BMAD CLI available (`workflow` command).
- Environment variables configured for any external integrations (e.g., FIGMA_PAT, BUBBLE_API_KEY) before running connector tasks.
- Project root set to `fataplus-website`.

## Core Workflow Sequence
1. **Kickoff Canvas**
   ```bash
   workflow run \
     --config .bmad/custom/modules/agri-ai-design-lab/workflows/engagement-kickoff/workflow.yaml \
     --output docs/agri-ai-design-lab/engagement-kickoff-smart-irrigation-$(date +%F).md
   ```
   - Inputs: project name, client profile, success metrics.
   - Recommended agent: `studio orchestrator` (`*kickoff-engagement`).

2. **Asset Ingestion**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/asset-ingestor/workflow.yaml
   ```
   - Provide research files via prompts or `--input` flag.
   - Agent: `field ethnographer` (`*ingest-assets`).

3. **Insight to Concept**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/insight-to-concept/workflow.yaml
   ```
   - Agent: `ai solution crafter` (`*map-ai-usecases`).

4. **Concept to Prototype**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/concept-to-prototype/workflow.yaml
   ```
   - Agent: `product experience engineer` (`*concept-to-prototype`).

5. **Data Readiness Audit**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/data-readiness-audit/workflow.yaml
   ```
   - Agent: `ai solution crafter` (`*data-readiness`).

6. **Service Blueprint**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/ai-service-blueprint/workflow.yaml
   ```
   - Agent: `cx/dx strategist` (`*plan-adoption`).

7. **CX Journey Map**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/cx-journey-map/workflow.yaml
   ```
   - Agent: `cx/dx strategist` (`*cx-journey`).

8. **Bootcamp Lesson + Feedback**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/bootcamp-lesson-kit/workflow.yaml
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/bootcamp-feedback/workflow.yaml
   ```
   - Agent: `bootcamp mentor` (`*create-lesson`, `*review-cohort`).

9. **Playbook Export**
   ```bash
   workflow run --config .bmad/custom/modules/agri-ai-design-lab/workflows/playbook-exporter/workflow.yaml
   ```
   - Agent: `studio orchestrator` (`*export-playbook`).
   - Compiles all previous outputs into `docs/agri-ai-design-lab/playbooks/`.

## Tips
- Use `*bootcamp-mode` before lesson workflows to toggle cohort output settings.
- After each workflow run, verify saved files in `docs/agri-ai-design-lab/*`.
- For iterative updates, rerun workflows with new timestamps to keep history.

## Agents Quick Commands
| Agent | Trigger | Description |
| --- | --- | --- |
| Studio Orchestrator | `*kickoff-engagement`, `*insight-to-concept`, `*concept-to-prototype`, `*export-playbook` | Run orchestration workflows |
| Field Ethnographer | `*ingest-assets`, `*persona-forge`, `*storyboard` | Research synthesis |
| AI Solution Crafter | `*map-ai-usecases`, `*data-readiness`, `*service-blueprint` | AI opportunity analysis |
| Product Experience Engineer | `*concept-to-prototype`, `*nocode-sprint`, `*cx-journey` | UX + no-code delivery |
| CX/DX Strategist | `*plan-adoption`, `*define-kpis`, `*cx-journey` | Adoption planning |
| Bootcamp Mentor | `*bootcamp-mode`, `*create-lesson`, `*review-cohort` | Training workflows |

## Validation Checklist
- [ ] Workflows produce outputs without errors.
- [ ] Agents respect bilingual communication settings.
- [ ] Playbook includes latest analysis artifacts.
- [ ] Connector tasks run separately once credentials are configured.
