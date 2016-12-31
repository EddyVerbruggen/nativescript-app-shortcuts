import {LaunchQuickAction} from "nativescript-3dtouch";

export class ThreeDeeTouch {

  public available(avail: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }

  public configureQuickActions(actions: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
        reject("3D Touch not available");
    });
  }

  public setQuickActionCallback(callback: (data: LaunchQuickAction) => void) {
    // noop
  }
}