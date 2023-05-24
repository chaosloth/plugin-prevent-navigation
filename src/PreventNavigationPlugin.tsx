import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { Actions } from "@twilio/flex-ui";

const PLUGIN_NAME = "PreventNavigationPlugin";

export default class PreventNavigationPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    // Actions to hook:
    // - SelectTask
    // - NavigateToView

    const log = (msg: any) => {
      console.log("PREVENT HISTORY PLUGIN - ", msg);
    };

    const askToConfirmAction = (
      action: string,
      cancelActionInvocation: any = null,
      acceptActionInvocation: any = null
    ) => {
      const actionConfirmation = window.confirm(
        `Do you really want to prevent ${action} ?`
      );
      if (!actionConfirmation) {
        // abort/prevent action here
        log("Action aborted!");
        if (cancelActionInvocation) cancelActionInvocation();
      } else {
        log("Action confirmed!");
        if (acceptActionInvocation) acceptActionInvocation();
      }
    };
    const preventableActions = ["beforeSelectTask", "beforeNavigateToView"];

    preventableActions.map((action) => {
      Actions.addListener(action, (payload, cancelActionInvocation) => {
        log(action + " called");
        askToConfirmAction(action, null, cancelActionInvocation);
      });
    });

    window.addEventListener("popstate", function (event) {
      log("popstate" + " called");
      askToConfirmAction(
        "popstate",
        window.history.pushState(null, document.title, window.location.href),
        log("popstate - user accepted")
      );
    });
  }
}
