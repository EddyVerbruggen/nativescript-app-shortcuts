import * as observable from "tns-core-modules/data/observable";

// Event handler for Page "loaded" event attached in beer-page.xml
export function pageLoaded(args: observable.EventData) {
  console.log("--- beers page loaded!");
}