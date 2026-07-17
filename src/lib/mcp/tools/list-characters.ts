import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CHARACTERS } from "@/lib/characters";

export default defineTool({
  name: "list_characters",
  title: "List characters",
  description:
    "List all playable characters in the interactive story, including their role, identity, personality, and short backstory.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = CHARACTERS.map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      gender: c.gender,
      age: c.age,
      tag: c.tag,
      identity: c.identity,
      personality: c.personality,
      motto: c.motto,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { characters: items },
    };
  },
});
