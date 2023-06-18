import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Simple datastore to collect the mapping of reaction with text and link.
 */
const FAQsDatastore = DefineDatastore({
  name: "faqs",
  primary_key: "id",
  attributes: {
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
});

export default FAQsDatastore;
