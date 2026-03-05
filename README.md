# 🤖 ADK Guide — A Self-Referential Botpress ADK Agent

> An interactive guide to the Botpress Agent Development Kit, **built entirely with the ADK itself**.

Ask it how to create conversations, tools, knowledge bases, or deploy agents — and it'll answer with working TypeScript code. Ask it how _it_ was built, and it'll walk you through its own architecture.

## Why this exists

The Botpress ADK is in beta and the community is still small. **ADK Guide** fills that gap by being both a learning tool and a living demo of what you can build with the framework.

**The medium is the message** — every pattern this agent teaches, it also uses.

## What it does

- 💬 **Answers ADK questions** with working TypeScript code examples
- 📖 **Step-by-step guides** for getting started, adding knowledge bases, creating tools, deploying, and troubleshooting
- 🪞 **Self-referential architecture** — ask "how were you built?" and it explains its own source code
- 🧠 **Knowledge base** sourced from the official Botpress ADK documentation
- 🎯 **Adaptive responses** — tracks user experience level and adjusts depth accordingly

## Architecture

```
adk-guide/
├── agent.config.ts          # Agent config, models, user state schema
├── src/
│   ├── conversations/
│   │   └── index.ts          # Main conversation handler with system prompt + tools
│   ├── actions/
│   │   ├── get-code-example.ts   # Returns TypeScript snippets for 10+ ADK concepts
│   │   ├── get-setup-guide.ts    # Step-by-step walkthroughs (5 guides)
│   │   └── explain-self.ts       # Self-referential architecture explanation
│   ├── knowledge/
│   │   └── adk-docs.ts      # KB sourced from Botpress docs sitemap
│   └── triggers/
│       └── welcome.ts        # Greets users on webchat:conversationStarted
├── package.json
└── tsconfig.json
```

### ADK features demonstrated

| Feature              | Where                        | What it does                                |
| -------------------- | ---------------------------- | ------------------------------------------- |
| **Conversations**    | `src/conversations/index.ts` | Handles all channels with `execute()`       |
| **Actions as Tools** | `src/actions/*.ts`           | 3 actions exposed via `asTool()` to the LLM |
| **Zod schemas**      | All actions                  | Type-safe input/output for every action     |
| **Knowledge bases**  | `src/knowledge/adk-docs.ts`  | Sitemap-sourced KB from Botpress docs       |
| **Triggers**         | `src/triggers/welcome.ts`    | Event subscription for conversation start   |
| **User state**       | `agent.config.ts`            | Tracks experience level and topics explored |
| **Integration deps** | `agent.config.ts`            | Webchat + Chat integrations                 |

## Getting started

### Prerequisites

- Node.js v22+
- A [Botpress account](https://sso.botpress.cloud)
- ADK CLI installed ([instructions](https://botpress.com/docs/adk/quickstart))

### Run locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/adk-guide.git
cd adk-guide

# Install dependencies
npm install

# Log in and link to your Botpress workspace
adk login
adk link  # Select "Create new Bot"

# Sync knowledge base
adk kb sync

# Start dev server
adk dev

# In a new terminal — chat with it
adk chat
```

### Deploy

```bash
adk build
adk deploy
```

## Example conversations

**Getting started:**

> "I'm new to the ADK. How do I set up my first agent?"

**Code examples:**

> "Show me how to create a custom tool"

**Self-referential:**

> "How were you built?"

**Troubleshooting:**

> "I'm getting 'adk: command not found' on Windows"

## Built with

- [Botpress ADK](https://botpress.com/docs/adk/introduction) (beta)
- TypeScript
- OpenAI gpt-4o-mini (via Botpress model routing)

## Author

**Brij-Paul Singh** — CS @ McGill University

- [GitHub](https://github.com/bpsingh15)
- [LinkedIn](https://linkedin.com/in/brij-paul-singh)

---

_Built in a few hours as a showcase of the Botpress ADK. The best way to learn a framework is to build something that teaches it._
