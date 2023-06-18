import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ReactionLookupFunction } from "../functions/lookup.ts";

/**
 * Workflow for looking up FAQ answer based on reaction.
 */

const Reaction2FAQWorkflow = DefineWorkflow({
  callback_id: "reaction_2_faq",
  title: "Reply to posts via reaction.",
  description: "A workflow for replying to posts via reaction.",
  input_parameters: {
    properties: {
      reaction: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      message_ts: {
        type: Schema.types.string,
      },
    },
    required: ["reaction", "channel", "message_ts"],
  },
});

// custom function looks up rection to get faq
Reaction2FAQWorkflow.addStep(
  ReactionLookupFunction,
  {
    reaction: Reaction2FAQWorkflow.inputs.reaction,
    channel: Reaction2FAQWorkflow.inputs.channel,
    message_ts: Reaction2FAQWorkflow.inputs.message_ts,
  },
);

export default Reaction2FAQWorkflow;
