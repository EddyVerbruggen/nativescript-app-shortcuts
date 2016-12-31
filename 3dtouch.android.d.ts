import { LaunchQuickAction } from "nativescript-3dtouch";
export declare class ThreeDeeTouch {
    available(avail: boolean): Promise<boolean>;
    configureQuickActions(actions: Array<any>): Promise<any>;
    setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}
