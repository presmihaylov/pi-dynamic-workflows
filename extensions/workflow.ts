import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createWorkflowTool } from "../src/index.js";

export default function extension(pi: ExtensionAPI) {
  // pi-subagents marks child sessions with PI_SUBAGENT_CHILD. Do not expose
  // workflow inside ordinary child agents, otherwise they can bypass the
  // subagent extension's orchestration/nesting boundary.
  if (process.env.PI_SUBAGENT_CHILD === "1") return;

  const workflowTool = createWorkflowTool();
  pi.registerTool(workflowTool);

  pi.on("session_start", () => {
    const active = pi.getActiveTools();
    if (!active.includes(workflowTool.name)) {
      pi.setActiveTools([...active, workflowTool.name]);
    }
  });
}
