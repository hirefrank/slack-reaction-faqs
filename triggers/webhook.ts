import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import OnChangeWorkflow from "../workflows/on_change.ts";

/**
 * Webhook trigger for receiving gsheet changes
 */

const trigger: Trigger<typeof OnChangeWorkflow.definition> = {
  type: TriggerTypes.Webhook,
  name: "Sends FAQ changes",
  description: "Sends gsheet changes as a webhook",
  workflow: "#/workflows/on_change",
  inputs: {
    id: {
      value: "{{data.row_number}}",
    },
    reaction: {
      value: "{{data.reaction}}",
    },
    text: {
      value: "{{data.text}}",
    },
    link: {
      value: "{{data.link}}",
    },
  },
};

export default trigger;
