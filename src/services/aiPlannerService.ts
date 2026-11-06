import type { TaskPriority } from "../hooks/useStore";

export interface GeneratedTask {
    title: string;
    priority: TaskPriority;
    color: string;
    dueDateOffsetDays: number; // e.g. 1 = tomorrow, 3 = in 3 days
    subtasks: string[];
    columnTitle?: string;
}

export interface GeneratedPlan {
    projectName: string;
    tasks: GeneratedTask[];
}

// Built-in intelligent template generator for instant offline/keyless AI generation
const getSmartFallbackPlan = (prompt: string): GeneratedPlan => {
    const p = prompt.toLowerCase();

    if (p.includes("typescript") || p.includes("ts") || p.includes("javascript") || p.includes("js")) {
        return {
            projectName: prompt,
            tasks: [
                {
                    title: "Master TypeScript Types & Interfaces",
                    priority: "high",
                    color: "#06B6D4",
                    dueDateOffsetDays: 2,
                    columnTitle: "To do",
                    subtasks: [
                        "Learn primitive & literal types",
                        "Understand Interfaces vs Type Aliases",
                        "Practice Union & Intersection types",
                        "Implement Type Narrowing & Guards"
                    ]
                },
                {
                    title: "Deep Dive into Generics & Utility Types",
                    priority: "urgent",
                    color: "#6366F1",
                    dueDateOffsetDays: 4,
                    columnTitle: "To do",
                    subtasks: [
                        "Generic functions and constraints",
                        "Master Partial, Required, Readonly",
                        "Implement Pick, Omit, and Record",
                        "Explore ReturnType and Parameters"
                    ]
                },
                {
                    title: "Migrate React App to Strict TypeScript",
                    priority: "medium",
                    color: "#A855F7",
                    dueDateOffsetDays: 7,
                    columnTitle: "To do",
                    subtasks: [
                        "Type React functional components & Props",
                        "Type useState, useEffect & Custom Hooks",
                        "Type Form events and DOM refs",
                        "Enable strict mode in tsconfig.json"
                    ]
                },
                {
                    title: "Build & Deploy a Production TS Library",
                    priority: "low",
                    color: "#10B981",
                    dueDateOffsetDays: 10,
                    columnTitle: "To do",
                    subtasks: [
                        "Setup tsup / rollup bundler",
                        "Generate d.ts type declaration files",
                        "Write unit tests with Vitest",
                        "Publish to npm package registry"
                    ]
                }
            ]
        };
    }

    if (p.includes("interview") || p.includes("job") || p.includes("career") || p.includes("resume")) {
        return {
            projectName: prompt,
            tasks: [
                {
                    title: "Revamp Tech Resume & LinkedIn Profile",
                    priority: "urgent",
                    color: "#F43F5E",
                    dueDateOffsetDays: 1,
                    columnTitle: "To do",
                    subtasks: [
                        "Tailor bullet points with metrics & impact",
                        "Update GitHub portfolio & pinned repos",
                        "Optimize LinkedIn headline & skills",
                        "Export clean single-page PDF resume"
                    ]
                },
                {
                    title: "Core Data Structures & Algorithms Practice",
                    priority: "high",
                    color: "#F97316",
                    dueDateOffsetDays: 3,
                    columnTitle: "To do",
                    subtasks: [
                        "Arrays, Hash Maps & Two Pointer problems",
                        "Binary Trees & Depth First Search",
                        "Sliding Window algorithms",
                        "Solve 10 LeetCode Medium questions"
                    ]
                },
                {
                    title: "System Design & Architecture Prep",
                    priority: "high",
                    color: "#6366F1",
                    dueDateOffsetDays: 5,
                    columnTitle: "To do",
                    subtasks: [
                        "Study horizontal vs vertical scaling",
                        "Caching strategies (Redis, CDN)",
                        "Database indexing & sharding",
                        "Design TinyURL or Twitter feed"
                    ]
                },
                {
                    title: "Conduct Mock Technical Interviews",
                    priority: "medium",
                    color: "#10B981",
                    dueDateOffsetDays: 7,
                    columnTitle: "To do",
                    subtasks: [
                        "Behavioral STAR method practice",
                        "Record audio answering 'Tell me about yourself'",
                        "Pair programming mock session",
                        "Submit 15 targeted job applications"
                    ]
                }
            ]
        };
    }

    if (p.includes("saas") || p.includes("mvp") || p.includes("startup") || p.includes("launch")) {
        return {
            projectName: prompt,
            tasks: [
                {
                    title: "Validate Problem & Define Core MVP Scope",
                    priority: "urgent",
                    color: "#F43F5E",
                    dueDateOffsetDays: 1,
                    columnTitle: "To do",
                    subtasks: [
                        "Interview 5 potential target users",
                        "List the single primary user problem",
                        "Cut secondary features out of scope",
                        "Create high-fidelity Figma wireframes"
                    ]
                },
                {
                    title: "Build Core Product Features & Database",
                    priority: "high",
                    color: "#6366F1",
                    dueDateOffsetDays: 4,
                    columnTitle: "To do",
                    subtasks: [
                        "Setup Auth, Database schema & API",
                        "Implement primary workflow/feature",
                        "Setup user dashboard & onboarding",
                        "Connect Stripe / payment gateway"
                    ]
                },
                {
                    title: "Landing Page & Waitlist Setup",
                    priority: "medium",
                    color: "#06B6D4",
                    dueDateOffsetDays: 6,
                    columnTitle: "To do",
                    subtasks: [
                        "Write clear value-prop copy",
                        "Add interactive demo / video tour",
                        "Setup email collection & welcome flow",
                        "Verify SEO meta tags & social cards"
                    ]
                },
                {
                    title: "Product Launch & Early User Acquisition",
                    priority: "medium",
                    color: "#10B981",
                    dueDateOffsetDays: 8,
                    columnTitle: "To do",
                    subtasks: [
                        "Launch on Product Hunt & Hacker News",
                        "Share build story on X / LinkedIn",
                        "Direct message 50 warm leads",
                        "Collect feedback & fix top 3 bug reports"
                    ]
                }
            ]
        };
    }

    if (p.includes("design") || p.includes("ui") || p.includes("ux") || p.includes("figma") || p.includes("website") || p.includes("portfolio")) {
        return {
            projectName: prompt,
            tasks: [
                {
                    title: "Design System & Visual Identity",
                    priority: "high",
                    color: "#A855F7",
                    dueDateOffsetDays: 2,
                    columnTitle: "To do",
                    subtasks: [
                        "Choose typography pairings & scale",
                        "Define vibrant cyber/dark & light color palette",
                        "Design button, input & card components",
                        "Setup auto-layout components in Figma"
                    ]
                },
                {
                    title: "Wireframes & Responsive Layouts",
                    priority: "high",
                    color: "#6366F1",
                    dueDateOffsetDays: 4,
                    columnTitle: "To do",
                    subtasks: [
                        "Hero section with dynamic visual hook",
                        "Interactive case studies / projects showcase",
                        "About section and skills visualizer",
                        "Mobile & tablet responsive viewports"
                    ]
                },
                {
                    title: "Frontend Implementation & Micro-animations",
                    priority: "medium",
                    color: "#06B6D4",
                    dueDateOffsetDays: 6,
                    columnTitle: "To do",
                    subtasks: [
                        "Build layout with modern CSS / Tailwind",
                        "Add smooth scroll & entry transitions",
                        "Implement Dark / Light mode toggle",
                        "Optimize image formats (WebP/SVG)"
                    ]
                },
                {
                    title: "Performance Audit & Live Deployment",
                    priority: "low",
                    color: "#10B981",
                    dueDateOffsetDays: 8,
                    columnTitle: "To do",
                    subtasks: [
                        "Run Lighthouse 95+ score audit",
                        "Test accessibility (a11y) & keyboard navigation",
                        "Setup custom domain & SSL",
                        "Deploy to Vercel / Netlify"
                    ]
                }
            ]
        };
    }

    // Generic intelligent project plan for any custom prompt
    return {
        projectName: prompt,
        tasks: [
            {
                title: `Research & Requirements for ${prompt}`,
                priority: "high",
                color: "#6366F1",
                dueDateOffsetDays: 2,
                columnTitle: "To do",
                subtasks: [
                    "Clarify end goals and target outcome",
                    "Collect essential references & documentation",
                    "Identify key constraints & dependencies",
                    "Break milestones into actionable steps"
                ]
            },
            {
                title: `Phase 1: Foundation & Initial Setup`,
                priority: "urgent",
                color: "#F43F5E",
                dueDateOffsetDays: 4,
                columnTitle: "To do",
                subtasks: [
                    "Prepare tools and working environment",
                    "Complete preliminary prototype / structure",
                    "Review initial feedback and adjust",
                    "Establish daily check-in routine"
                ]
            },
            {
                title: `Phase 2: Core Execution & Implementation`,
                priority: "medium",
                color: "#06B6D4",
                dueDateOffsetDays: 7,
                columnTitle: "To do",
                subtasks: [
                    "Execute primary deliverables",
                    "Test and refine quality standards",
                    "Document progress and edge cases",
                    "Iterate based on test results"
                ]
            },
            {
                title: `Phase 3: Final Review & Polish`,
                priority: "low",
                color: "#10B981",
                dueDateOffsetDays: 10,
                columnTitle: "To do",
                subtasks: [
                    "Perform final inspection and quality check",
                    "Resolve remaining loose ends",
                    "Share completion results with stakeholders",
                    "Plan next iterations and retrospective"
                ]
            }
        ]
    };
};

/**
 * Generate plan using Google Gemini API if API key exists, otherwise fallback to smart planner
 */
export const generatePlanWithAI = async (prompt: string, apiKey?: string): Promise<GeneratedPlan> => {
    const key = apiKey || localStorage.getItem("flowboard_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;

    if (!key) {
        // No key supplied - use built-in smart AI planning engine with realistic delay
        await new Promise((resolve) => setTimeout(resolve, 850));
        return getSmartFallbackPlan(prompt);
    }

    try {
        const systemPrompt = `You are an expert Agile Scrum master and project manager. The user wants to plan a project: "${prompt}".
Generate 4 to 6 highly structured, actionable tasks.
For each task provide:
- title: concise, action-oriented task name
- priority: one of "urgent", "high", "medium", "low"
- color: vibrant hex code (e.g. #6366F1, #06B6D4, #A855F7, #10B981, #F59E0B, #F43F5E)
- dueDateOffsetDays: integer (e.g. 2, 4, 7)
- subtasks: array of 3 to 4 specific checklist step strings
- columnTitle: "To do"

Return ONLY valid JSON in this exact structure:
{
  "projectName": "${prompt}",
  "tasks": [
    {
      "title": "string",
      "priority": "high",
      "color": "#6366F1",
      "dueDateOffsetDays": 2,
      "subtasks": ["step 1", "step 2", "step 3"],
      "columnTitle": "To do"
    }
  ]
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.4,
                    },
                }),
            }
        );

        if (!response.ok) {
            console.warn("Gemini API error status:", response.status, "Falling back to smart planner.");
            return getSmartFallbackPlan(prompt);
        }

        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
            const parsed = JSON.parse(candidateText);
            if (parsed && Array.isArray(parsed.tasks)) {
                return parsed;
            }
        }

        return getSmartFallbackPlan(prompt);
    } catch (err) {
        console.error("Gemini generation error, falling back to smart planner:", err);
        return getSmartFallbackPlan(prompt);
    }
};

