"use strict";
var utils_1 = require("utils/utils");
var application_1 = require("application");
var quickActionCallback = null;
var lastQuickAction = null;
(function () {
    var callback = function (application, shortcutItem, completionHandler) {
        if (quickActionCallback !== null) {
            quickActionCallback(shortcutItem);
        }
        else {
            lastQuickAction = shortcutItem;
        }
    };
    if (application_1.ios.delegate !== undefined) {
        application_1.ios.delegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = callback;
    }
    else {
        var MyDelegate = (function (_super) {
            __extends(MyDelegate, _super);
            function MyDelegate() {
                _super.apply(this, arguments);
            }
            MyDelegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = callback;
            MyDelegate.ObjCProtocols = [UIApplicationDelegate];
            return MyDelegate;
        })(UIResponder);
        application_1.ios.delegate = MyDelegate;
    }
})();
var ThreeDeeTouch = (function () {
    function ThreeDeeTouch() {
        this.availability = null;
    }
    ThreeDeeTouch.prototype.avail = function () {
        if (this.availability === null) {
            var avail = false;
            if (utils_1.ios.MajorVersion >= 9) {
                avail = UIForceTouchCapabilityAvailable === application_1.ios.nativeApp.keyWindow.rootViewController.traitCollection.forceTouchCapability;
            }
            this.availability = avail;
        }
        return this.availability;
    };
    ThreeDeeTouch.prototype.available = function (avail) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.avail());
        });
    };
    ThreeDeeTouch.prototype.setQuickActionCallback = function (callback) {
        quickActionCallback = callback;
        if (lastQuickAction !== null) {
            quickActionCallback(lastQuickAction);
            lastQuickAction = null;
        }
    };
    ThreeDeeTouch.prototype.configureQuickActions = function (actions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.avail()) {
                reject("3D Touch not available");
                return;
            }
            var items = [];
            actions.forEach(function (action) {
                var uiApplicationShortcutIcon = null;
                if (action.iconType) {
                    uiApplicationShortcutIcon = UIApplicationShortcutIcon.iconWithType(action.iconType);
                }
                else if (action.iconTemplate) {
                    uiApplicationShortcutIcon = UIApplicationShortcutIcon.iconWithTemplateImageName(action.iconTemplate);
                }
                items.push(UIApplicationShortcutItem.alloc().initWithTypeLocalizedTitleLocalizedSubtitleIconUserInfo(action.type, action.title, action.subtitle, uiApplicationShortcutIcon, null));
            });
            application_1.ios.nativeApp.shortcutItems = items;
            resolve();
        });
    };
    return ThreeDeeTouch;
}());
exports.ThreeDeeTouch = ThreeDeeTouch;
