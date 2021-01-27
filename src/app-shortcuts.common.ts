export interface QuickAction {
  /**
   * Can be used in the onHomeIconPressed callback
   */
  type: string;

  /**
   * The largest text that's displayed for the action
   */
  title: string;

  /**
   * Smaller text, shown below the 'title'.
   * iOS only.
   */
  subtitle?: string;

  /**
   * One of the built-in iOS icons, like UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto,
   * full list here (Objective-C): https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationShortcutIcon_Class/#//apple_ref/c/tdef/UIApplicationShortcutIconType
   * iOS only.
   */
  iconType?: any /* UIApplicationShortcutIconType */;

  /**
   * A custom image, resolves to app/App_Resources/iOS/<inconTemplate>(.png),
   * use a transparent black and white png of 70*70 or 105*105 for easiest setup.
   * Will be ignored if (on iOS) an iconType is also set.
   */
  iconTemplate?: string;
}

export interface LaunchQuickAction {
  /**
   * The type you previously passed in as QuickAction.type.
   */
  type?: string;

  /**
   * The text you previously passed in as QuickAction.title.
   * iOS only.
   */
  localizedTitle?: string;
}

export interface AppShortcutsAPI {
  available(): Promise<boolean>;
  configureQuickActions(actions: Array<QuickAction>): Promise<void>;
  setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}