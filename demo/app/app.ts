import { Application, Frame } from "@nativescript/core";
import { AppShortcuts } from "nativescript-app-shortcuts";

// .. and set a callback handler as well
new AppShortcuts().setQuickActionCallback(shortcutItem => {
  console.log(`The app was launched by shortcut type '${shortcutItem.type}'`);

  // this is where you handle any specific case for the shortcut
  if (shortcutItem.type === "beer") {
    setTimeout(() => {
      Frame.getFrameById("appRootFrame") // see app-root.xml
          .navigate("beer-page");
    });
  } else {
    // .. any other shortcut handling
  }
});

Application.run({moduleName: "app-root"});
