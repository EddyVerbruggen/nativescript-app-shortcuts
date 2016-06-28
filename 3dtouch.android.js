"use strict";
var ThreeDeeTouch = (function () {
    function ThreeDeeTouch() {
    }
    ThreeDeeTouch.prototype.available = function (avail) {
        return new Promise(function (resolve, reject) {
            resolve(false);
        });
    };
    ThreeDeeTouch.prototype.configureQuickActions = function (actions) {
        return new Promise(function (resolve, reject) {
            reject("3D Touch not available");
        });
    };
    ThreeDeeTouch.prototype.setQuickActionCallback = function (callback) {
    };
    return ThreeDeeTouch;
}());
exports.ThreeDeeTouch = ThreeDeeTouch;
