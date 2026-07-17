import { defineMcp } from "@lovable.dev/mcp-js";
import listCharactersTool from "./tools/list-characters";
import getCharacterTool from "./tools/get-character";

export default defineMcp({
  name: "script-world-builder-mcp",
  title: "互动文游 MCP",
  version: "0.1.0",
  instructions:
    "Tools for exploring characters in this interactive Chinese-language story app (《重生之贵女难求》). Use list_characters to browse and get_character for full backstory.",
  tools: [listCharactersTool, getCharacterTool],
});
