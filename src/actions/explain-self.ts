import { Action, z } from "@botpress/runtime";

export default new Action({
  name: "explainSelf",
  input: z.object({
    aspect: z
      .string()
      .optional()
      .describe(
        "Which aspect of this agent's architecture to explain. Options: overview, conversation, tools, knowledge, config, or 'all' for a full breakdown."
      ),
  }),
  output: z.object({
    explanation: z.string(),
  }),
  handler: async ({ input }) => {
    const aspect = (input.aspect ?? "overview").toLowerCase().trim();

    const explanations: Record<string, string> = {
      overview: `I'm **ADK Guide** — a Botpress agent built entirely with the ADK itself. Here's my architecture:

• **agent.config.ts** — Defines my name, default models (gpt-4o-mini), user state schema (tracking experience level and topics explored), and webchat + chat integration dependencies.
• **src/conversations/index.ts** — My main conversation handler. It uses execute() with a detailed system prompt and provides three actions as tools via asTool().
• **src/actions/** — Three callable actions: getCodeExample (returns TypeScript snippets for ADK concepts), getSetupGuide (returns step-by-step walkthroughs), and explainSelf (this very action — hi!).
• **src/knowledge/** — A knowledge base sourced from the Botpress ADK documentation sitemap, so I always have the latest docs context.
• **src/triggers/** — A welcome trigger that fires on webchat:conversationStarted to greet new users.

I'm self-referential by design: I'm the medium AND the message. Every pattern I teach, I also use.`,

      conversation: `My conversation handler lives in \`src/conversations/index.ts\`. Key design choices:

1. I use \`channel: "*"\` to respond on all channels (webchat, chat API, etc.)
2. I read \`user.state.experienceLevel\` to adapt my response depth
3. I provide three actions as tools via \`asTool()\` so the LLM can call them during the conversation
4. My system prompt is detailed and structured — it covers my personality, knowledge domains, and response patterns

The execute() function is doing the heavy lifting: it runs the LLM with my instructions, tools, and any knowledge base context.`,

      tools: `I have three actions exposed as tools:

1. **getCodeExample** — Takes a topic name (like "conversation", "tool", "zai") and returns a working TypeScript code snippet. This is defined in \`src/actions/get-code-example.ts\` with a Record<string, {description, code}> lookup.

2. **getSetupGuide** — Takes a guide name (like "getting-started", "deploy") and returns a step-by-step walkthrough. Lives in \`src/actions/get-setup-guide.ts\`.

3. **explainSelf** — This action! It explains my own architecture. Meta, right?

Each action uses Zod schemas for type-safe input/output and is provided to execute() via \`actions.myAction.asTool()\`.`,

      knowledge: `My knowledge base is defined in \`src/knowledge/adk-docs.ts\`:

\`\`\`typescript
const AdkDocsSource = DataSource.Website.fromSitemap(
  "https://www.botpress.com/docs/sitemap.xml",
  { filter: ({ url }) => url.includes("/adk/") }
);

export const AdkDocsKB = new Knowledge({
  name: "AdkDocs",
  description: "Official Botpress ADK documentation",
  sources: [AdkDocsSource],
});
\`\`\`

This indexes the ADK section of the Botpress docs. During execute(), the LLM automatically searches this knowledge base to ground its answers in the latest documentation.`,

      config: `My \`agent.config.ts\` includes:

• **defaultModels**: Using gpt-4o-mini for both autonomous and zai operations (fast + cheap)
• **user.state**: Zod schema tracking experienceLevel (beginner/intermediate/advanced) and topicsExplored (array of strings)
• **dependencies.integrations**: webchat and chat, both at latest versions
• No custom bot state or configuration schema needed for this project`,
    };

    const all = Object.values(explanations).join("\n\n---\n\n");
    const result = aspect === "all" ? all : explanations[aspect] ?? explanations["overview"];

    return { explanation: result };
  },
});
