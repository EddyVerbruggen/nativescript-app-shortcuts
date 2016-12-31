import {Observable} from "data/observable";
import {ThreeDeeTouch} from "nativescript-3dtouch";

declare const UIApplicationShortcutIconType;

export class HelloWorldModel extends Observable {
  private threeDeeTouch: ThreeDeeTouch;

  constructor() {
    super();
    this.threeDeeTouch = new ThreeDeeTouch();
  }

  public isAvailable() {
    this.threeDeeTouch.available().then((avail) => {
      alert("Available? " + avail);
    });
  }

  public configure1QuickAction() {
    this.threeDeeTouch.configureQuickActions([
        {
          type: "capturePhoto", // optional, but can be used in the onHomeIconPressed callback
          title: "Snag a pic", // mandatory
          subtitle: "You have 18 snags left", // optional
          iconType: UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto // optional
        }
    ]).then(() => {
      alert("Added 1 action, close the app and apply pressure to the app icon to check it out!");
    }, (errorMessage) => {
      alert(errorMessage);
    });
  }

  public configure2QuickActions() {
    this.threeDeeTouch.configureQuickActions([
        {
          type: "capturePhoto", // optional, but can be used in the onHomeIconPressed callback
          title: "Snag a pic", // mandatory
          subtitle: "You have 23 snags left", // optional
          iconType: UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto // optional
        },
        {
          type: "beer",
          title: "Beer-tastic!",
          subtitle: "Check in & share", // optional
          iconTemplate: "Beer" // resolves to app/App_Resources/iOS/Beer(.png)
        }
    ]).then(() => {
      alert("Added 2 actions, close the app and apply pressure to the app icon to check it out!");
    }, (errorMessage) => {
      alert(errorMessage);
    });
  }
}
