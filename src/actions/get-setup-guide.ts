import { Action, z } from "@botpress/runtime";

const guides: Record<string, { title: string; steps: string[] }> = {
  "getting-started": {
    title: "Getting Started with the Botpress ADK",
    steps: [
      '**Install the ADK CLI**\n- macOS/Linux: `curl -fsSL https://github.com/botpress/adk/releases/latest/download/install.sh | bash`\n- Windows (PowerShell):\n```powershell\nInvoke-WebRequest -Uri "https://github.com/botpress/adk/releases/download/v1.4.2/adk-windows-x64.zip" -OutFile "adk.zip"\nExpand-Archive -Path "adk.zip" -DestinationPath "$env:LOCALAPPDATA\\Programs\\adk"\n$env:PATH += ";$env:LOCALAPPDATA\\Programs\\adk"\n[Environment]::SetEnvironmentVariable("PATH", $env:PATH, "User")\n```\n- Verify: `adk --version`',
      "**Create a new project**\n`adk init my-agent`\nSelect the **Hello World** template for your first project (or Blank if you're experienced).",
      "**Install dependencies**\n`cd my-agent && npm install` (or use pnpm/bun/yarn)",
      "**Log in and link your agent**\n`adk login`\n`adk link` → Select 'Create new Bot' when prompted",
      "**Start development**\n`adk dev` — starts the dev server with hot reloading\nVisit `http://localhost:3001/` for the ADK console",
      "**Chat with your agent**\nOpen a new terminal: `adk chat`",
      "**Deploy when ready**\n`adk build` to compile\n`adk deploy` to push to Botpress Cloud",
    ],
  },

  "add-knowledge-base": {
    title: "Adding a Knowledge Base to Your Agent",
    steps: [
      "**Create a knowledge file** in `src/knowledge/`\nExample: `src/knowledge/docs.ts`",
      '**Define your data source**\n```typescript\nimport { DataSource, Knowledge } from "@botpress/runtime";\n\nconst DocsSource = DataSource.Website.fromSitemap(\n  "https://example.com/sitemap.xml"\n);\n```',
      '**Create the Knowledge instance**\n```typescript\nexport const DocsKB = new Knowledge({\n  name: "MyDocs",\n  description: "Documentation for my product.",\n  sources: [DocsSource],\n});\n```',
      "**Sync your knowledge base**\n`adk kb sync` to index the content",
      "**Your agent will automatically use the KB** when answering questions through `execute()`. The LLM searches the knowledge base as part of its reasoning.",
    ],
  },

  "create-custom-tool": {
    title: "Creating a Custom Tool for Your Agent",
    steps: [
      "**Create a tool file** in `src/tools/`\nExample: `src/tools/lookup.ts`",
      '**Define the tool with Zod schemas**\n```typescript\nimport { Autonomous, z } from "@botpress/runtime";\n\nexport default new Autonomous.Tool({\n  name: "lookupUser",\n  description: "Look up a user by their email",\n  input: z.object({ email: z.string().email() }),\n  output: z.object({ name: z.string(), plan: z.string() }),\n  handler: async ({ email }) => {\n    // Your logic here\n    return { name: "Jane", plan: "pro" };\n  },\n});\n```',
      "**Or create an Action and use asTool()**\nActions in `src/actions/` can be provided to `execute()` via `actions.myAction.asTool()`",
      "**Provide the tool in your conversation**\n```typescript\nawait execute({\n  instructions: \"You are a helpful assistant.\",\n  tools: [actions.lookupUser.asTool()],\n});\n```",
      "**Test it** with `adk dev` + `adk chat` — ask a question that would trigger the tool",
    ],
  },

  deploy: {
    title: "Deploying Your Agent to Botpress Cloud",
    steps: [
      "**Make sure you're logged in**\n`adk login`",
      "**Link to a bot** (if not already)\n`adk link` → Create new Bot or select existing",
      "**Build your agent**\n`adk build`\nThis compiles to `.adk/bot/.botpress/dist`",
      "**Deploy**\n`adk deploy`\nYour agent will be live on Botpress Cloud with a Bot ID and Workspace ID",
      "**Test via Webchat** — go to your Botpress dashboard to find the webchat embed code, or use the Chat integration",
    ],
  },

  troubleshooting: {
    title: "Common Troubleshooting Steps",
    steps: [
      '**"adk: command not found"** — Make sure the CLI is in your PATH. On Windows, restart your terminal after installing.',
      "**Node.js version errors** — The ADK requires Node.js v22.0.0 or higher. Run `node --version` to check.",
      "**Type errors after adding integrations** — Run `adk dev` to regenerate TypeScript types in `.adk/bot/.botpress/types/`",
      "**Build failures** — Check that your table names follow the convention (≤30 chars, end with 'Table', no leading numbers).",
      "**Login issues** — Try `adk login` again. Make sure you have a Botpress Cloud account at sso.botpress.cloud.",
      "**Knowledge base not updating** — Run `adk kb sync` to re-index your sources.",
    ],
  },
};

export default new Action({
  name: "getSetupGuide",
  input: z.object({
    guide: z
      .string()
      .describe(
        "Which guide to retrieve. One of: getting-started, add-knowledge-base, create-custom-tool, deploy, troubleshooting"
      ),
  }),
  output: z.object({
    title: z.string(),
    steps: z.array(z.string()),
    guide: z.string(),
  }),
  handler: async ({ input }) => {
    const key = input.guide.toLowerCase().trim();
    const guide = guides[key];

    if (!guide) {
      const available = Object.keys(guides).join(", ");
      return {
        guide: key,
        title: `Guide not found: "${key}"`,
        steps: [`Available guides: ${available}`],
      };
    }

    return { guide: key, ...guide };
  },
});
