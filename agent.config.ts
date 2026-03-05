import { z, defineConfig } from "@botpress/runtime";

export default defineConfig({
  name: "adk-guide",
  description:
    "An interactive guide to the Botpress ADK — built with the ADK itself. Ask me anything about building agents with the Botpress Agent Development Kit.",

  defaultModels: {
    autonomous: "openai:gpt-4o-mini",
    zai: "openai:gpt-4o-mini",
  },

  bot: {
    state: z.object({}),
    tags: {},
  },

  user: {
    state: z.object({
      experienceLevel: z
        .enum(["beginner", "intermediate", "advanced"])
        .optional()
        .describe("The user's self-reported experience level with Botpress"),
      topicsExplored: z
        .array(z.string())
        .optional()
        .describe("ADK topics the user has already asked about"),
    }),
    tags: {},
  },

  conversation: {
    tags: {},
  },

  message: {
    tags: {},
  },

  workflow: {
    tags: {},
  },

  configuration: {
    schema: z.object({}),
  },

  dependencies: {
    integrations: {
      webchat: { version: "webchat@0.3.0", enabled: true },
      chat: { version: "chat@0.7.6", enabled: true },
    },
  },
});
