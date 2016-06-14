import * as observable from "data/observable";
import * as pages from "ui/page";

// Event handler for Page "loaded" event attached in beer-page.xml
export function pageLoaded(args: observable.EventData) {
    console.log("--- beers page loaded!");
}