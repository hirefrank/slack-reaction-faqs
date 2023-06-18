import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import FAQsDatastore from "../datastores/faqs.ts";

/**
 * Custom function for saving FAQ changes to a datastore.
 */

export const SaveFAQDefinition = DefineFunction({
  callback_id: "save_faq_function",
  title: "Save FAQ to datastore function",
  description: "A function for saving FAQ changes to datastore.",
  source_file: "functions/save_faq.ts",
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
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  SaveFAQDefinition,
  async ({ inputs, client }) => {
    console.log(inputs.id);
    console.log(inputs.reaction);
    console.log(inputs.text);
    console.log(inputs.link);

    const create_or_update = await client.apps.datastore.put<
      typeof FAQsDatastore.definition
    >({
      datastore: "faqs",
      item: {
        id: inputs.id,
        reaction: inputs.reaction.trim(),
        text: inputs.text.trim(),
        link: inputs.link.trim(),
      },
    });

    if (!create_or_update.ok) {
      const error =
        `Failed to add row to datastore: ${create_or_update.errors.message}`;
      return { error };
    }

    return { outputs: {} };
  },
);
