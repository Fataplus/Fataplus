import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono().basePath("/api");

// Onboarding Route
const onboardingSchema = z.object({
    companyName: z.string(),
    contactName: z.string(),
    projectType: z.string(),
    description: z.string(),
});

app.post(
    "/onboarding/generate-brief",
    zValidator("json", onboardingSchema),
    async (c) => {
        const data = c.req.valid("json");

        // TODO: Integrate with real LLM using Better Agents / LangChain
        // For now, we simulate the AI response based on the prompt template

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockBrief = `
# 🚀 Project Brief: ${data.projectType} for ${data.companyName}

## Executive Summary
${data.companyName} aims to launch a **${data.projectType}** to address key market needs. This project will leverage modern web technologies to ensure scalability and a premium user experience.

## Core Objectives
- **Digital Presence**: Establish a strong online footprint for ${data.companyName}.
- **User Engagement**: Create an intuitive interface for ${data.contactName}'s target audience.
- **Scalability**: Build on a robust stack capable of handling future growth.

## Recommended Tech Stack (Fataplus Standard)
- **Frontend**: Next.js 15 + Tailwind CSS + Shadcn/UI
- **Backend**: Cloudflare Workers + HonoJS
- **Database**: Cloudflare D1
- **Auth**: BetterAuth

## Estimated Timeline
1. **Discovery (1 week)**: Requirements gathering and scope definition.
2. **Design (2 weeks)**: UX/UI wireframes and high-fidelity mockups.
3. **Development (4 weeks)**: Agile implementation of core features.
4. **Launch (1 week)**: QA, deployment, and training.

## Next Steps
Ready to move forward? Let's schedule a kickoff meeting to refine this brief into a technical specification.
    `;

        return c.json({ brief: mockBrief });
    }
);

// Example route
app.get("/hello", (c) => {
    return c.json({
        message: "Hello from Hono!",
    });
});

// Export the handler for Next.js
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
