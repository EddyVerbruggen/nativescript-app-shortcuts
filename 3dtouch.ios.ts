import {ios as iOSUtils} from "utils/utils";
import {ios as iOSApplication} from "application";
import {QuickAction, LaunchQuickAction} from "nativescript-3dtouch";

declare var UIApplicationDelegate, UIForceTouchCapabilityAvailable, UIApplicationShortcutIcon, UIApplicationShortcutItem, __extends;

let quickActionCallback: (data: LaunchQuickAction) => void = null;
let lastQuickAction: any = null;

(function() {

  let callback = function (application, shortcutItem, completionHandler) {
    if (quickActionCallback !== null) {
      quickActionCallback(shortcutItem);
    } else {
      lastQuickAction = shortcutItem;
    }
  };

  if (iOSApplication.delegate !== undefined) {
    // Play nice with other plugins by not completely ignoring anything already added to the appdelegate
    iOSApplication.delegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = callback;
  } else {

    let MyDelegate = (function (_super) {
        __extends(MyDelegate, _super);
        function MyDelegate() {
            _super.apply(this, arguments);
        }
        MyDelegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = callback;
        (MyDelegate as any).ObjCProtocols = [UIApplicationDelegate];
        return MyDelegate;
    })(UIResponder);
    iOSApplication.delegate = MyDelegate;
  }
})();

export class ThreeDeeTouch {

  // caching for efficiency
  private availability = null;

  private avail() {
    if (this.availability === null) {
      let avail = false;

      // iOS 9 added 3D Touch capability
      if (iOSUtils.MajorVersion >= 9) {
        // .. but not all devices running iOS 9 support it
        avail = UIForceTouchCapabilityAvailable === iOSApplication.nativeApp.keyWindow.rootViewController.traitCollection.forceTouchCapability;
      }

      this.availability = avail;
    }
    return this.availability;
  }

  public available(avail: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(this.avail());
    });
  }

  public setQuickActionCallback(callback: (data: LaunchQuickAction) => void) {
    quickActionCallback = callback;
    if (lastQuickAction !== null) {
      quickActionCallback(lastQuickAction);
      lastQuickAction = null;
    }
  }

  public configureQuickActions(actions: Array<QuickAction>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.avail()) {
        reject("3D Touch not available");
        return;
      }

      let items = [];

      actions.forEach((action) => {
        let uiApplicationShortcutIcon = null;

        if (action.iconType) {
          uiApplicationShortcutIcon = UIApplicationShortcutIcon.iconWithType(action.iconType);
        } else if (action.iconTemplate) {
          uiApplicationShortcutIcon = UIApplicationShortcutIcon.iconWithTemplateImageName(action.iconTemplate);
        }

        items.push(
            UIApplicationShortcutItem.alloc().initWithTypeLocalizedTitleLocalizedSubtitleIconUserInfo(
                action.type,
                action.title,
                action.subtitle,
                uiApplicationShortcutIcon,
                null));
      });

      iOSApplication.nativeApp.shortcutItems = items;

      resolve();
    });
  }
}