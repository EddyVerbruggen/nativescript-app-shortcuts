import {ios as iOSUtils} from "utils/utils";
import {ios as iOSApplication} from "application";

declare var UIForceTouchCapabilityAvailable, UIApplicationShortcutIcon, UIApplicationShortcutItem;

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

export interface QuickAction {
  /**
   * Can be used in the onHomeIconPressed callback
   */
  type?: string;
  /**
   * The largest text that's displayed for the action
   */
  title: string;
  /**
   * Smaller text, shown below the 'title'
   */
  subtitle?: string;
  /**
   * One of the built-in iOS icons, like UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto,
   * full list here (Objective-C): https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationShortcutIcon_Class/#//apple_ref/c/tdef/UIApplicationShortcutIconType 
   */
  iconType?: string;
  /**
   * A custom image, resolves to app/App_Resources/iOS/<inconTemplate>(.png),
   * use a transparent black and white png of 70*70 or 105*105 for easiest setup.
   */
  iconTemplate?: string;
}