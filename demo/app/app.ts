import * as application from "tns-core-modules/application";
import { AppShortcuts } from "nativescript-app-shortcuts";

// .. and set a callback handler as well
new AppShortcuts().setQuickActionCallback(shortcutItem => {
  console.log(`The app was launched by shortcut type '${shortcutItem.type}'`);

  // this is where you handle any specific case for the shortcut
  if (shortcutItem.type === "beer") {
    // this is an example of 'deeplinking' through a shortcut
    let frames = require("ui/frame");
    // on Android we need a little delay
    setTimeout(() => {
      frames.topmost().navigate("beer-page");
    });
  } else {
    // .. any other shortcut handling
  }
});

application.start({moduleName: "main-page"});
