# Reaction to FAQs

Simple workflow that replies to a post in thread based on the reaction. My usecase is responding with answers to commonly asked questions with a link to an article for more information. This is particularly effective when on your phone and you don't want to type much. ;)

**Guide Outline**:

- [Setup](#setup)
  - [Install the Slack CLI](#install-the-slack-cli)
  - [Clone the Template](#clone-the-template)
- [Running Your Project Locally](#running-your-project-locally)
- [Creating Triggers](#creating-triggers)
- [Workflow Usage](#workflow-usage)
- [Deploying Your App](#deploying-your-app)
- [Future Considerations](#future-considerations)
- [Viewing Activity Logs](#viewing-activity-logs)
- [Capabilities Demonstrated](#capabilities-demonstrated)
- [Project Structure](#project-structure)
- [Resources](#resources)

---

## Setup

Before getting started, first make sure you have a development workspace where
you have permission to install apps. **Please note that the features in this
project require that the workspace be part of
[a Slack paid plan](https://slack.com/pricing).**

### Install the Slack CLI

To use this template, you need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/automation/quickstart).

### Clone the Template

Start by cloning this repository:

```zsh
# Clone this project onto your machine
$ slack create my-app -t hirefrank/slack-reaction-faqs

# Change into the project directory
$ cd my-app
```

### Add your content

Add your dataset of content as a csv in `functions/content.ts`. To generate a csv you can export from Google Sheets. See `functions/example.content.ts` as an example.


### Configure trigger

Update line 33 in `triggers/reaction.ts` with the channel id(s) you want to use the workflow in (only messages in these channels will listen for reactions to post replies.)


## Running Your Project Locally

While building your app, you can see your changes appear in your workspace in
real-time with `slack run`. You'll know an app is the development version if the
name has the string `(local)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

To stop running locally, press `<CTRL> + C` to end the process.

## Creating Triggers

[Triggers](https://api.slack.com/automation/triggers) are what cause workflows
to run. These triggers can be invoked by a user, or automatically as a response
to an event within Slack.

When you `run` or `deploy` your project for the first time, the CLI will prompt
you to create a trigger if one is found in the `triggers/` directory. For any
subsequent triggers added to the application, each must be
[manually added using the `trigger create` command](#manual-trigger-creation).

When creating triggers, you must select the workspace and environment that you'd
like to create the trigger in. Each workspace can have a local development
version (denoted by `(local)`), as well as a deployed version. _Triggers created
in a local environment will only be available to use when running the
application locally._

### Event Triggers

A [event trigger](https://api.slack.com/automation/triggers/event) is a type of
trigger that invokes a workflow based on an event.

**Note: triggers won't run the workflow unless the app is either running locally
or deployed!**

### Manual Trigger Creation

You need to create two triggers for this automation. To manually create the first trigger, use the following command:

```zsh
$ slack trigger create --trigger-def triggers/reaction.ts
```

:bulb: You need to add your app to the channel(s) you want to use.

## Workflow Usage

Add one of your reactions to a post and watch the magic happen!

## Future Considerations

- Add filtering to the event trigger to make it more efficient (only execute if a match)

## Deploying Your App

Once development is complete, deploy the app to Slack infrastructure using
`slack deploy`:

```zsh
$ slack deploy
```

When deploying for the first time, you'll be prompted to
[create the event trigger](#creating-triggers) for the deployed version of your
app. When that trigger is invoked, the workflow should run just as it did when
developing locally (but without requiring your server to be running). 

## Viewing Activity Logs

Activity logs of your application can be viewed live and as they occur with the
following command:

```zsh
$ slack activity --tail
```

## Capabilities Demonstrated
- Event triggers (reaction added)
= Parsing incoming webhook and saving to datastore
= Datastores
- Posting Messages
- Custom Functions


## Project Structure

### `.slack/`

Contains `apps.dev.json` and `apps.json`, which include installation details for
development and deployed apps.

### `functions/`

[Functions](https://api.slack.com/automation/functions) are reusable building
blocks of automation that accept inputs, perform calculations, and provide
outputs. Functions can be used independently or as steps in workflows.

### `triggers/`

[Triggers](https://api.slack.com/automation/triggers) determine when workflows
are run. A trigger file describes the scenario in which a workflow should be
run, such as a user pressing a button or when a specific event occurs.

### `workflows/`

A [workflow](https://api.slack.com/automation/workflows) is a set of steps
(functions) that are executed in order.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/automation/forms) before
continuing to the next step.

### `manifest.ts`

The [app manifest](https://api.slack.com/automation/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.

## Resources

To learn more about developing automations on Slack, visit the following:

- [Automation Overview](https://api.slack.com/automation)
- [CLI Quick Reference](https://api.slack.com/automation/cli/quick-reference)
- [Samples and Templates](https://api.slack.com/automation/samples)
