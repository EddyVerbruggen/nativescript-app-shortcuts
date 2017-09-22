import { AppShortcutsAPI, LaunchQuickAction, QuickAction } from "./app-shortcuts.common";
import * as application from "tns-core-modules/application";
import { ad } from "tns-core-modules/utils/utils";

declare const android: any;

let quickActionCallback: (data: LaunchQuickAction) => void = null;
let lastQuickAction: any = null;

const SHORTCUT_PREFIX = "shortcut.type.";

(() => {
  const iconHandler = args => {
    if (!args || !args.android || !args.android.getAction) {
      return;
    }

    const launchAction = args.android.getAction();

    const isShortcutAction = launchAction && launchAction.indexOf(SHORTCUT_PREFIX) > -1;
    if (isShortcutAction) {
      // "clear" the intent
      args.android.setAction("");

      const quickAction = {
        type: launchAction.substring(SHORTCUT_PREFIX.length)
      };
      if (quickActionCallback) {
        quickActionCallback(quickAction);
      } else {
        lastQuickAction = quickAction;
      }
    }
  };

  application.on("launch", (args) => iconHandler(args));
})();

export class AppShortcuts implements AppShortcutsAPI {

  private supported(): boolean {
    return android.os.Build.VERSION.SDK_INT >= 25; // Android 7.1+
  }

  available(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(this.supported());
    });
  }

  configureQuickActions(actions: Array<QuickAction>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.supported()) {
          reject("Not supported on this API level. Requires minimum of API level 25 (Android 7.1).");
          return;
        }

        const shortcuts = new java.util.ArrayList();

        actions.map((action, i) => {
          const intent = new android.content.Intent(application.android.context, application.android.foregroundActivity.getClass());
          intent.setAction(SHORTCUT_PREFIX + action.type);

          const shortcutBuilder = new android.content.pm.ShortcutInfo.Builder(application.android.context, `id${i}`)
              .setShortLabel(action.title)
              .setLongLabel(action.title) // TODO add property some day
              .setIntent(intent);

          if (action.iconTemplate) {
            let res = ad.getApplicationContext().getResources();
            let identifier = res.getIdentifier(action.iconTemplate, "drawable", ad.getApplication().getPackageName());
            if (identifier === 0) {
              console.log(`No icon found for this device density for icon '${action.iconTemplate}'. Falling back to the default icon.`);
            } else {
              shortcutBuilder.setIcon(android.graphics.drawable.Icon.createWithResource(application.android.context, identifier));
            }
          }
          shortcuts.add(shortcutBuilder.build());
        });

        const shortcutManager = application.android.context.getSystemService(android.content.pm.ShortcutManager.class);
        shortcutManager.setDynamicShortcuts(shortcuts);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void {
    quickActionCallback = callback;
    if (lastQuickAction !== null) {
      quickActionCallback(lastQuickAction);
      lastQuickAction = null;
    }
  }
}