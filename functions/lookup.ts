import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import FAQsDatastore from "../datastores/faqs.ts";

/**
 * Custom function for looking up faq by reaction
 */

export const ReactionLookupFunction = DefineFunction({
  callback_id: "reaction_lookup_function",
  title: "Lookup FAQ by reaction",
  description: "A function for looking up the FAQ by reaction.",
  source_file: "functions/lookup.ts",
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
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  ReactionLookupFunction,
  async ({ inputs, client }) => {
    console.log(`searching for ${inputs.reaction}`);
    const getResponse = await client.apps.datastore.query<
      typeof FAQsDatastore.definition
    >({
      datastore: "faqs",
      expression: "#reaction = :reaction",
      expression_attributes: { "#reaction": "reaction" },
      expression_values: { ":reaction": (inputs.reaction).trim() },
    });

    if (!getResponse.ok) {
      const error = `Failed to query datastore: ${getResponse.error}`;
      return { error };
    }

    if (getResponse.items.length == 1) {
      const msgResponse = await client.chat.postMessage({
        channel: inputs.channel,
        thread_ts: inputs.message_ts,
        mrkdwn: true,
        text: `${getResponse.items[0].text} \n\n:arrow_right: <${
          getResponse.items[0].link
        }|More info>`,
      });

      if (!msgResponse.ok) {
        console.log(
          "Error during request chat.postMessage!",
          msgResponse.error,
        );
      }
    } else {
      console.log("No reaction match");
    }

    return { outputs: {} };
  },
);
