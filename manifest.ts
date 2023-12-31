import { Manifest } from "deno-slack-sdk/mod.ts";
import Reaction2FAQWorkflow from "./workflows/faq.ts";
import OnChangeWorkflow from "./workflows/on_change.ts";
import FAQsDatastore from "./datastores/faqs.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "reaction-faqs",
  description:
    "A workflow that replies based on a reaction. Great for responding to FAQs.",
  icon: "assets/thinking_app_icon.png",
  functions: [],
  workflows: [Reaction2FAQWorkflow, OnChangeWorkflow],
  datastores: [FAQsDatastore],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "reactions:read",
    "triggers:read",
    "triggers:write",
    "datastore:read",
    "datastore:write",
  ],
});
