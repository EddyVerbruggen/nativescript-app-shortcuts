import * as application from "application";

// if you want to act upon quick action presses, add this:
import {ThreeDeeTouch} from "nativescript-3dtouch";

// .. and set a callback handler as well
new ThreeDeeTouch().setQuickActionCallback(function(shortcutItem) {
    console.log("app was launched by shortcut type '" + shortcutItem.type + "' with title '" + shortcutItem.localizedTitle + "'");
    // this is where you handle any specific case for the shortcut
    if (shortcutItem.type === "beer") {
        // this is an example of 'deeplinking' through a shortcut
        let frames = require("ui/frame");
        frames.topmost().navigate("beer-page");
    } else {
        // .. any other shortcut handling
    }
});

application.start({ moduleName: "main-page" });
