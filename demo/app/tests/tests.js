var AppShortcuts = require("nativescript-app-shortcuts").AppShortcuts;
var appShortcuts = new AppShortcuts();

describe("available", function () {
  it("exists", function () {
    expect(appShortcuts.available).toBeDefined();
  });

  it("returns a promise", function () {
    expect(appShortcuts.available()).toEqual(jasmine.any(Promise));
  });
});

describe("configureQuickActions", function () {
  it("exists", function () {
    expect(appShortcuts.configureQuickActions).toBeDefined();
  });

  it("returns a promise", function () {
    expect(appShortcuts.configureQuickActions()).toEqual(jasmine.any(Promise));
  });
});

describe("configureQuickActions", function () {
  it("exists", function () {
    expect(appShortcuts.setQuickActionCallback).toBeDefined();
  });

  it("returns a promise", function () {
    expect(appShortcuts.setQuickActionCallback()).toEqual(undefined);
  });
});
