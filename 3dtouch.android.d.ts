export declare class ThreeDeeTouch {
    available(avail: boolean): Promise<boolean>;
    configureQuickActions(actions: Array<any>): Promise<any>;
    setQuickActionCallback(callback: Function): void;
}
