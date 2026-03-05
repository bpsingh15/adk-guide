import { Action, z } from "@botpress/runtime";

const examples: Record<string, { description: string; code: string }> = {
  conversation: {
    description: "A basic conversation handler that responds on all channels",
    code: `import { Conversation } from "@botpress/runtime";

export default new Conversation({
  channel: "*",
  handler: async ({ execute }) => {
    await execute({
      instructions: "You are a helpful assistant.",
    });
  },
});`,
  },

  "conversation-with-tools": {
    description: "A conversation handler that provides tools to the LLM",
    code: `import { Conversation, actions } from "@botpress/runtime";

export default new Conversation({
  channel: "*",
  handler: async ({ execute }) => {
    await execute({
      instructions: "You are a helpful assistant.",
      tools: [actions.calculateTotal.asTool()],
    });
  },
});`,
  },

  action: {
    description: "A reusable action with typed input/output",
    code: `import { Action, z } from "@botpress/runtime";

export default new Action({
  name: "calculateTotal",
  input: z.object({
    items: z.array(z.object({
      price: z.number(),
      quantity: z.number(),
    })),
  }),
  output: z.object({ total: z.number() }),
  handler: async ({ input }) => {
    const total = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
    return { total };
  },
});`,
  },

  tool: {
    description: "An autonomous tool the LLM can call during execute()",
    code: `import { Autonomous, z } from "@botpress/runtime";

export default new Autonomous.Tool({
  name: "lookupUser",
  description: "Look up a user by email address",
  input: z.object({ email: z.string().email() }),
  output: z.object({
    name: z.string(),
    plan: z.string(),
  }),
  handler: async ({ email }) => {
    // Your lookup logic here
    return { name: "Jane Doe", plan: "pro" };
  },
});`,
  },

  table: {
    description: "A table definition with searchable columns",
    code: `import { Table, z } from "@botpress/runtime";

export default new Table({
  name: "OrderTable",
  columns: {
    userId: { schema: z.string(), searchable: true },
    items: z.array(z.string()),
    total: z.number(),
    status: z.string(),
    createdAt: z.string().datetime(),
  },
});`,
  },

  trigger: {
    description: "A trigger that fires when a webchat conversation starts",
    code: `import { Trigger } from "@botpress/runtime";

export default new Trigger({
  name: "conversationStarted",
  events: ["webchat:conversationStarted"],
  handler: async ({ event }) => {
    console.log("New conversation:", event.conversationId);
  },
});`,
  },

  knowledge: {
    description: "A knowledge base sourced from a website sitemap",
    code: `import { DataSource, Knowledge } from "@botpress/runtime";

const DocsSource = DataSource.Website.fromSitemap(
  "https://www.botpress.com/docs/sitemap.xml",
  {
    filter: ({ url }) => !url.includes("llms-full.txt"),
  }
);

export const DocsKB = new Knowledge({
  name: "BotpressDocs",
  description: "Botpress documentation knowledge base.",
  sources: [DocsSource],
});`,
  },

  workflow: {
    description: "A workflow that creates and queries table rows",
    code: `import { Workflow } from "@botpress/runtime";
import OrderTable from "../tables/order-table";

export default new Workflow({
  name: "processOrder",
  handler: async ({ step }) => {
    const { rows } = await OrderTable.createRows({
      rows: [{
        userId: "user123",
        total: 99.99,
        status: "pending",
      }],
    });

    const { rows: pending } = await OrderTable.findRows({
      filter: { status: "pending" },
      orderBy: "createdAt",
      orderDirection: "desc",
      limit: 10,
    });
  },
});`,
  },

  zai: {
    description: "Using the Zai utility library for AI operations",
    code: `import { adk, z } from "@botpress/runtime";

// Extract structured data from text
const product = await adk.zai.extract(
  "Blueberries are 3.99$ and are in stock.",
  z.object({
    name: z.string(),
    price: z.number(),
    inStock: z.boolean(),
  })
);

// Filter an array with natural language
const clean = await adk.zai.filter(
  comments,
  "is not spam or inappropriate"
);

// Label content
const result = await adk.zai.label(email, {
  spam: "is this email spam?",
  urgent: "requires immediate attention?",
});`,
  },

  config: {
    description: "Agent configuration with state schemas and integrations",
    code: `import { z, defineConfig } from "@botpress/runtime";

export default defineConfig({
  name: "my-agent",
  description: "My awesome agent",
  defaultModels: {
    autonomous: "openai:gpt-4o-mini",
    zai: "openai:gpt-4o-mini",
  },
  user: {
    state: z.object({
      name: z.string().optional(),
      preferences: z.record(z.string()).optional(),
    }),
  },
  dependencies: {
    integrations: {
      webchat: { version: "webchat@latest", enabled: true },
      chat: { version: "chat@latest", enabled: true },
    },
  },
});`,
  },
};

export default new Action({
  name: "getCodeExample",
  input: z.object({
    topic: z
      .string()
      .describe(
        "The ADK concept to get a code example for. One of: conversation, conversation-with-tools, action, tool, table, trigger, knowledge, workflow, zai, config"
      ),
  }),
  output: z.object({
    description: z.string(),
    code: z.string(),
    topic: z.string(),
  }),
  handler: async ({ input }) => {
    const key = input.topic.toLowerCase().trim();
    const example = examples[key];

    if (!example) {
      const available = Object.keys(examples).join(", ");
      return {
        topic: key,
        description: `No example found for "${key}". Available topics: ${available}`,
        code: "",
      };
    }

    return {
      topic: key,
      description: example.description,
      code: example.code,
    };
  },
});
