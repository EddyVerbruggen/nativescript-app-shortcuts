import { EventData } from "@nativescript/core";

// Event handler for Page "loaded" event attached in beer-page.xml
export function pageLoaded(args: EventData) {
  console.log("--- beers page loaded!");
}