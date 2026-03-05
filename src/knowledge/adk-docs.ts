import { DataSource, Knowledge } from "@botpress/runtime";

const AdkDocsSource = DataSource.Website.fromSitemap(
  "https://www.botpress.com/docs/sitemap.xml",
  {
    filter: ({ url }) => url.includes("/adk/"),
  }
);

export const AdkDocsKB = new Knowledge({
  name: "AdkDocs",
  description:
    "Official Botpress ADK documentation — covers quickstart, project structure, conversations, workflows, actions, tools, tables, triggers, knowledge bases, Zai, runtime utilities, managing integrations, and CLI reference.",
  sources: [AdkDocsSource],
});
