import { ios as iOSUtils } from "tns-core-modules/utils/utils";
import { ios as iOSApplication } from "tns-core-modules/application";
import { AppShortcutsAPI, LaunchQuickAction, QuickAction } from "./app-shortcuts.common";

let quickActionCallback: (data: LaunchQuickAction) => void = null;
let lastQuickAction: any = null;

const callback = function (application, shortcutItem, completionHandler) {
  if (quickActionCallback !== null) {
    quickActionCallback(shortcutItem);
  } else {
    lastQuickAction = shortcutItem;
  }
};

class AppShortcutsUIApplicationDelegate extends UIResponder implements UIApplicationDelegate {
  public static ObjCProtocols = [UIApplicationDelegate];

  applicationPerformActionForShortcutItemCompletionHandler(application: UIApplication, shortcutItem: UIApplicationShortcutItem, completionHandler: (p1: boolean) => void): void {
    callback(application, shortcutItem, completionHandler);
  }
}

(() => {
  if (iOSApplication.delegate !== undefined) {
    // Play nice with other plugins by not completely ignoring anything already added to the appdelegate
    iOSApplication.delegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = callback;
  } else {
    iOSApplication.delegate = AppShortcutsUIApplicationDelegate;
  }
})();

export class AppShortcuts implements AppShortcutsAPI {
  // caching for efficiency
  private availability = null;

  public available(): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (this.availability !== null) {
        resolve(this.availability);
        return;
      }

      // With iOS 13 probably any iOS device supports this feature, because 3D Touch is no longer required
      if (iOSUtils.MajorVersion >= 13) {
        resolve(true);
        return;
      }

      // iOS 9 added 3D Touch capability
      if (iOSUtils.MajorVersion >= 9) {
        // .. but not all devices running iOS 9 support it
        if (iOSApplication.nativeApp.keyWindow === null) {
          // (especially) in Angular apps, this might run too soon. Wrapping it in a timeout solves that issue.
          setTimeout(() => {
            this.availability = UIForceTouchCapability.Available === iOSApplication.nativeApp.keyWindow.rootViewController.traitCollection.forceTouchCapability;
            resolve(this.availability);
          });
        } else {
          this.availability = UIForceTouchCapability.Available === iOSApplication.nativeApp.keyWindow.rootViewController.traitCollection.forceTouchCapability;
          resolve(this.availability);
        }
      } else {
        this.availability = false;
        resolve(this.availability);
      }
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
      this.available().then(avail => {
        if (!avail) {
          reject("3D Touch not available");
          return;
        }

        const items = [];

        actions.map(action => {
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
    });
  }
}
