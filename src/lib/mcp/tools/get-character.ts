import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getCharacter } from "@/lib/characters";

export default defineTool({
  name: "get_character",
  title: "Get character detail",
  description:
    "Return full detail for a single character by id (e.g. hanyan, zhouyi, zhuangsy, yushan, moshen), including backstory, skills, secret and relations.",
  inputSchema: {
    id: z.string().describe("Character id, e.g. 'hanyan'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const c = getCharacter(id);
    if (!c) {
      return {
        content: [{ type: "text", text: `No character with id "${id}".` }],
        isError: true,
      };
    }
    const { img: _img, ...rest } = c;
    return {
      content: [{ type: "text", text: JSON.stringify(rest, null, 2) }],
      structuredContent: { character: rest },
    };
  },
});
