import { Trigger } from "@botpress/runtime";

export default new Trigger({
  name: "welcomeNewUser",
  events: ["webchat:conversationStarted"],
  handler: async ({ event }) => {
    // This trigger fires when a user opens the webchat widget.
    // The conversation handler will take over from here,
    // but we log the event for observability.
    console.log(
      `[ADK Guide] New conversation started: ${event.conversationId}`
    );
  },
});
