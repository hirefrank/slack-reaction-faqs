import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { parse } from "https://deno.land/std@0.192.0/csv/parse.ts";
import { content } from "./content.ts";

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
    const faqs = parse(content, {
      skipFirstRow: true,
      columns: ["reaction", "text", "link"],
    });

    const map = new Map<string, string>();
    faqs.forEach((item) => {
      map.set(item.reaction, JSON.stringify(item));
    });

    const lookup = map.get(inputs.reaction);
    if (lookup) {
      const q = JSON.parse(lookup);

      // threads response under parent message
      const msgResponse = await client.chat.postMessage({
        channel: inputs.channel,
        thread_ts: inputs.message_ts,
        mrkdwn: true,
        text: `${q.text} \n ${q.link}`,
      });

      if (!msgResponse.ok) {
        console.log(
          "Error during request chat.postMessage!",
          msgResponse.error,
        );
      }
    }

    return { outputs: {} };
  },
);
