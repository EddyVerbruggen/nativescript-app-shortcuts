import * as application from "application";

// START 3DTouch wiring
var MyDelegate = (function (_super) {
    __extends(MyDelegate, _super);
    function MyDelegate() {
        _super.apply(this, arguments);
    }
    MyDelegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = function (application, shortcutItem, completionHandler) {
        console.log("app was launched by shortcut type '" + shortcutItem.type + "' with title '" + shortcutItem.localizedTitle + "'");
        // this is where you handle any specific case for the shortcut
        if (shortcutItem.type === "beer") {
          // this is an example of 'deeplinking' through a shortcut
          var frames = require("ui/frame");
          frames.topmost().navigate("beer-page");
        } else {
          // .. any other shortcut handling
        }
    };
    MyDelegate.ObjCProtocols = [UIApplicationDelegate];
    return MyDelegate;
})(UIResponder);
application.ios.delegate = MyDelegate;
// END 3DTouch wiring

application.start({ moduleName: "main-page" });
