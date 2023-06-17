import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";

import Reaction2FAQWorkflow from "../workflows/faq.ts";

/**
 * Intial trigger for the setup workflow. Must be created manually
 * when deployed.
 */

const trigger: Trigger<typeof Reaction2FAQWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Reaction event trigger",
  description: "Reaction trigger",
  workflow: "#/workflows/reaction_2_faq",
  inputs: {
    reaction: {
      value: "{{data.reaction}}",
    },
    channel: {
      value: TriggerContextData.Event.ReactionAdded.channel_id,
    },
    message_ts: {
      value: TriggerContextData.Event.ReactionAdded.message_ts,
    },
  },
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: ["C05CY240HKP"],
  },
};

export default trigger;
