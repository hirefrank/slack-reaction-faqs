import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";

export type TriggerFilter = {
  statement: string;
};

export async function findTriggerToUpdate(
  client: SlackAPIClient,
  workflowCallbackId: string,
) {
  // Check the existing triggers for this workflow
  const allTriggers = await client.workflows.triggers.list({ is_owner: true });
  console.log(`triggers: ${JSON.stringify(allTriggers)}`);
  let triggerToUpdate = undefined;

  // find the trigger to update
  if (allTriggers.triggers) {
    for (const trigger of allTriggers.triggers) {
      console.log(`trigger: ${trigger}`);
      if (
        trigger.workflow.callback_id === workflowCallbackId &&
        trigger.event_type === "slack#/events/reaction_added"
      ) {
        triggerToUpdate = trigger;
      }
    }
  }
  return triggerToUpdate;
}

const triggerInputs = {
  channel: { value: "{{data.channel_id}}" },
  message_ts: { value: "{{data.message_ts}}" },
  reaction: { value: "{{data.reaction}}" },
};

export async function createOrUpdateTrigger(
  client: SlackAPIClient,
  workflowCallbackId: string,
  channelIds: string[],
  reactions_filter: [TriggerFilter, ...TriggerFilter[]],
  triggerToUpdate?: Record<string, string>,
) {
  // deno-lint-ignore no-explicit-any
  const channel_ids = channelIds as any;

  if (triggerToUpdate === undefined) {
    // Create a new trigger
    const creation = await client.workflows.triggers.create({
      type: TriggerTypes.Event,
      name: "reaction_added event trigger",
      workflow: `#/workflows/${workflowCallbackId}`,
      event: {
        event_type: TriggerEventTypes.ReactionAdded,
        channel_ids,
        filter: {
          version: 1,
          root: {
            operator: "OR",
            inputs: reactions_filter,
          },
        },
      },
      inputs: triggerInputs,
    });
    if (creation.error) {
      throw new Error(
        `Failed to create a trigger! (response: ${JSON.stringify(creation)})`,
      );
    }
    // console.log(`A new trigger created: ${JSON.stringify(creation)}`);
  } else {
    // Update the existing trigger
    const update = await client.workflows.triggers.update({
      trigger_id: triggerToUpdate.id,
      type: TriggerTypes.Event,
      name: "reaction_added event trigger",
      workflow: `#/workflows/${workflowCallbackId}`,
      event: {
        event_type: TriggerEventTypes.ReactionAdded,
        channel_ids,
        filter: {
          version: 1,
          root: {
            operator: "OR",
            inputs: reactions_filter,
          },
        },
      },
      inputs: triggerInputs,
    });
    if (update.error) {
      throw new Error(
        `Failed to update a trigger! (response: ${JSON.stringify(update)})`,
      );
    }
    console.log(`The trigger updated: ${JSON.stringify(update)}`);
  }
}
