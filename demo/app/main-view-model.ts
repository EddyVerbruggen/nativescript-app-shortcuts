import { Observable } from "tns-core-modules/data/observable";
import { AppShortcuts } from "nativescript-app-shortcuts";
import { isIOS } from "tns-core-modules/platform";

declare const UIApplicationShortcutIconType;

export class HelloWorldModel extends Observable {
  private appShortcuts: AppShortcuts;

  constructor() {
    super();
    this.appShortcuts = new AppShortcuts();
  }

  public isAvailable() {
    this.appShortcuts.available().then((avail) => {
      alert("Available? " + avail);
    });
  }

  public configure1QuickAction() {
    this.appShortcuts.configureQuickActions([
      {
        type: "capturePhoto", // optional, but can be used in the onHomeIconPressed callback
        title: "Snag a pic", // mandatory
        subtitle: "You have 18 snags left", // optional
        iconType: isIOS ? UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto : null,
        iconTemplate: "eye" // refers to an image in app/App_Resources
      }
    ]).then(() => {
      alert("Added 1 action, close the app and apply pressure to the app icon to check it out!");
    }, (errorMessage) => {
      alert(errorMessage);
    });
  }

  public configure2QuickActions() {
    this.appShortcuts.configureQuickActions([
      {
        type: "capturePhoto", // optional, but can be used in the onHomeIconPressed callback
        title: "Snag a pic", // mandatory
        subtitle: "You have 8 snags left", // optional
        iconType: isIOS ? UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto : null,
        iconTemplate: "eye" // refers to an image in app/App_Resources
      },
      {
        type: "beer",
        title: "Beer-tastic!",
        subtitle: "Check in & share", // optional
        iconTemplate: "beer" // refers to an image in app/App_Resources
      }
    ]).then(() => {
      alert("Added 2 actions, close the app and apply pressure to the app icon to check it out!");
    }, (errorMessage) => {
      alert(errorMessage);
    });
  }
}
