import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SaveFAQDefinition } from "../functions/save_faq.ts";
import { UpdateEventTriggerDefinition } from "../functions/reaction_trigger.ts";

/**
 * Workflow for processing gsheet changes to datastore.
 */

const OnChangeWorkflow = DefineWorkflow({
  callback_id: "on_change",
  title: "Save changes",
  description: "A workflow for saving gsheets changes to datastore.",
  input_parameters: {
    properties: {
      id: {
        type: Schema.types.string,
      },
      reaction: {
        type: Schema.types.string,
      },
      text: {
        type: Schema.types.string,
      },
      link: {
        type: Schema.types.string,
      },
    },
    required: ["id", "reaction", "text", "link"],
  },
});

// custom function to save changes to datastore
OnChangeWorkflow.addStep(
  SaveFAQDefinition,
  {
    id: OnChangeWorkflow.inputs.id,
    reaction: OnChangeWorkflow.inputs.reaction,
    text: OnChangeWorkflow.inputs.text,
    link: OnChangeWorkflow.inputs.link,
  },
);

OnChangeWorkflow.addStep(
  UpdateEventTriggerDefinition,
  {},
);

export default OnChangeWorkflow;
