import { QuickAction, LaunchQuickAction } from "nativescript-3dtouch";
export declare class ThreeDeeTouch {
    private availability;
    private avail();
    available(avail: boolean): Promise<boolean>;
    setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
    configureQuickActions(actions: Array<QuickAction>): Promise<any>;
}
