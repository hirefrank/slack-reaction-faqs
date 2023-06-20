import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  createOrUpdateTrigger,
  findTriggerToUpdate,
} from "./internals/trigger_operations.ts";
import FAQsDatastore from "../datastores/faqs.ts";

/**
 * Custom function for generating the reaction event trigger.
 */

export const UpdateEventTriggerDefinition = DefineFunction({
  callback_id: "update_trigger_function",
  title: "Update event trigger",
  description: "A function for updating trigger with reactions from datastore.",
  source_file: "functions/reaction_trigger.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  UpdateEventTriggerDefinition,
  async ({ client }) => {
    const result = await client.apps.datastore.query<
      typeof FAQsDatastore.definition
    >({
      datastore: "faqs",
    });

    if (!result.ok) {
      const error = `Failed to query datastore: ${result.errors.message}`;
      return { error };
    }

    // deno-lint-ignore no-explicit-any
    const reactions_filter: any[] = [];
    result.items.forEach((item) => {
      reactions_filter.push(
        { statement: `{{data.reaction}} == ${item.reaction}` },
      );
    });

    const workflow_callback_id = "reaction_2_faq";
    const triggerToUpdate = await findTriggerToUpdate(
      client,
      workflow_callback_id,
    );

    console.log(triggerToUpdate);

    // If the trigger already exists, we update it.
    // Otherwise, we create a new one.
    await createOrUpdateTrigger(
      client,
      workflow_callback_id,
      ["C05CY240HKP"],
      reactions_filter,
      triggerToUpdate,
    );

    return { outputs: {} };
  },
);
