# NativeScript 3D Touch plugin

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[npm-image]:http://img.shields.io/npm/v/nativescript-3dtouch.svg
[npm-url]:https://npmjs.org/package/nativescript-3dtouch
[downloads-image]:http://img.shields.io/npm/dm/nativescript-3dtouch.svg
[twitter-image]:https://img.shields.io/twitter/follow/eddyverbruggen.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/eddyverbruggen

### Use when you want to
* add those fancy home icon actions to your iPhone app,
* add them either statically or dynamically,
* use those to optionally deeplink inside your app.


<img src="screenshots/iOS screenshot - 4 quick actions.PNG" width="360"/>


### Supported platforms
* iPhone 6s / 6s Plus or newer, running iOS 9 or newer
* A simulator running the above, with a 3D Touch enabled touchpad

## Installation
From the command prompt go to your app's root folder and execute:

```
tns plugin add nativescript-3dtouch
```

And do yourself a favor by adding TypeScript support to your nativeScript app:

```
tns install typescript
```

Then open `references.d.ts` in the root of your project and add this line
to get autocompletion and type-checking for this plugin:

```js
/// <reference path="./node_modules/nativescript-3dtouch/3dtouch.d.ts" />
```

## Demo app
Want to dive in quickly? Check out [the demo app](demo)! Otherwise, continue reading.

You can run the demo app from the root of the project by typing `npm run demo.ios.device` (see [`package.json`](package.json) for other commands).

## API

### `available`
Check whether or not the device is capable.
Android devices will also report `false`, so you can use this cross platform.

##### JavaScript
```js
// require the plugin
var ThreeDeeTouch = require("nativescript-3dtouch").ThreeDeeTouch;

// instantiate the plugin
var threeDeeTouch = new ThreeDeeTouch();

threeDeeTouch.available().then(
  function(available) {
    if (available) {
      console.log("This device is 3D Touch capable");
    } else {
      console.log("No 3D Touch capability, ask the user to upgrade");
    }
  }
);
```

##### TypeScript
```typescript
// require the plugin
import {ThreeDeeTouch} from "nativescript-3dtouch";

// instantiate the plugin
let threeDeeTouch = new ThreeDeeTouch();

threeDeeTouch.available().then((available) => {
  if (available) {
    console.log("This device is 3D Touch capable");
  } else {
    console.log("No 3D Touch capability, ask the user to upgrade");
  }
});
```

### `configureQuickActions`
When your app is running you can add those fancy Quick Actions to the Home Screen icon. You can configure up to four icons and they are 'cached' by iOS until you pass in a new set of icons. So you don't need to do this every time your app loads, but it can't really hurt of course.

The `type` param (see the code sample below) is the most convenient way to relate the icon to the event you'll receive when the action was used to launch your app. So make sure it's unique amongst your icons.

There are two types of icons currently supported: `iconType` and `iconTemplate`.

#### iconType
A value from a [fixed list of icons which have been provided by Apple](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationShortcutIcon_Class/index.html#//apple_ref/c/tdef/UIApplicationShortcutIconType) and look great (scroll down to the Objective-C enum and look at the sample below how to use them).

#### iconTemplate
Can be used to provide your own icon. It must be a valid name of an icon template in your Assets catalog. NativeScript allows you to add the icon to the `app/App_Resources/iOS` folder. If you add a file called `Eye.png` then reference it as `Eye`. More on these images below when we discuss static actions.

##### JavaScript
```js
threeDeeTouch.configureQuickActions([
  {
    type: "capturePhoto",
    title: "Snag a pic",
    subtitle: "You have 23 snags left",
    iconType: UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto
  },
  {
    type: "beer",
    title: "Beer-tastic!",
    subtitle: "Check in & share",
    iconTemplate: "Beer"
  }
]).then(function() {
  alert("Added 2 actions, close the app and apply pressure to the app icon to check it out!");
}, function(errorMessage) {
  alert(errorMessage);
});
```

##### TypeScript
```typescript
threeDeeTouch.configureQuickActions([
  {
    type: "capturePhoto",
    title: "Snag a pic",
    subtitle: "You have 23 snags left",
    iconType: UIApplicationShortcutIconType.UIApplicationShortcutIconTypeCapturePhoto
  },
  {
    type: "beer",
    title: "Beer-tastic!",
    subtitle: "Check in & share",
    iconTemplate: "Beer"
  }
]).then(() => {
  alert("Added 2 actions, close the app and apply pressure to the app icon to check it out!");
}, (errorMessage) => {
  alert(errorMessage);
});
```

## Capturing the Action
When a home icon is pressed, your app launches. You probably want to perform different actions based on the home icon action
that was picked (like routing to a different page), so you need a way to capture the event.

### NativeScript with XML
In a non-Angular NativeScript app we need to extend `app.js` or `app.ts` and import he plugin,
then call the `setQuickActionCallback` function. So in case of `app.ts` change it from something like this:

```js
import * as application from "application";
application.start({ moduleName: "main-page" });
```

To this:

```js
import * as application from "application";

// import the plugin
import {ThreeDeeTouch} from "nativescript-3dtouch";

// instantiate it and call setQuickActionCallback
new ThreeDeeTouch().setQuickActionCallback(function(shortcutItem) {
    console.log("app was launched by shortcut type '" + shortcutItem.type + "' with title '" + shortcutItem.localizedTitle + "'");
    // this is where you handle any specific case for the shortcut
    if (shortcutItem.type === "beer") {
        // this is an example of 'deeplinking' through a shortcut
        let frames = require("ui/frame");
        frames.topmost().navigate("beer-page");
    } else {
        // .. any other shortcut handling
    }
});

application.start({ moduleName: "main-page" });
```

### NativeScript with Angular
If you're using Angular, the best place to add the handler is in `app.module.ts`,
and use `NgZone` to help Angular knowing about the route change you're performing:

```typescript
import { NgZone } from "@angular/core";
import { isIOS } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular";
import { ThreeDeeTouch } from "nativescript-3dtouch";

export class AppModule {
  constructor(private routerExtensions: RouterExtensions,
              private zone: NgZone) {

    if (isIOS) {
      new ThreeDeeTouch().setQuickActionCallback(shortcutItem => {
        console.log(`The app was launched by shortcut type '${shortcutItem.type}' with title '${shortcutItem.localizedTitle}`);

        // this is where you handle any specific case for the shortcut, based on its type
        if (shortcutItem.type === "page1") {
          this.deeplink("/page1");
        } else if (shortcutItem.type === "page2") {
          this.deeplink("/page2");
        }
      });
    }
  }

  private deeplink(to: string): void {
    this.zone.run(() => {
      this.routerExtensions.navigate([to], {
        animated: false
      });
    });
  }
}
```

## Configuring Static Actions
With `configureQuickActions` you can configure dynamic actions,
but what if you want actions to be available immediately after the app
was installed from the AppStore?

You can, but you need to manually edit the `.plist`.
Fortunately NativeScript allows you to change this file through `app/App_Resources/iOS/Info.plist`. Anything added there is added to the final `.plist` during a build.

Note that dynamic actions will never replace static actions, so if you have two static actions you can add up to two dynamic ones. Any more will be ignored.

Here's an example which you can paste anywhere in the `.plist` file:

```xml
<key>UIApplicationShortcutItems</key>
<array>
  <dict>
    <key>UIApplicationShortcutItemIconFile</key>
    <string>Eye</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>Eye from plist</string>
    <key>UIApplicationShortcutItemSubtitle</key>
    <string>Awesome subtitle</string>
    <key>UIApplicationShortcutItemType</key>
    <string>eyefromplist</string>
  </dict>
  <dict>
    <key>UIApplicationShortcutItemIconType</key>
    <string>UIApplicationShortcutIconTypeCompose</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>Compose</string>
    <key>UIApplicationShortcutItemType</key>
    <string>compose</string>
  </dict>
</array>
```

### These XML tags deserve a bit of explanation

#### UIApplicationShortcutItemIconFile

The second action above uses the built-in `UIApplicationShortcutIconTypeCompose` icon, but the first one uses a custom icon: `Eye`. This expects the file `app/App_Resources/iOS/Eye.png`. According to Apple's docs this needs to be a single color, transparent, square, `35x35` icon - but that size will look pixelated on retina devices so go ahead and use a `70x70` or `105x105` icon if you please.

#### UIApplicationShortcutItemTitle / UIApplicationShortcutItemSubtitle

You can guess what those do, right? Only the title is mandatory.

#### UIApplicationShortcutItemType

This is the same as the `type` param of `configureQuickActions`, so it's what you'll receive in the callback you may have configured in `app.js` / `app.ts`  as `payload.type`. Just do something cool with that info (like routing to a specific page and loading some content).