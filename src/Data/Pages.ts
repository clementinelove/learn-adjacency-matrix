import {ContentReaderController} from "../controller/ContentReaderController";
import {ViewController} from "../UI/ViewController";
import {HomeController} from "../controller/HomeController";

export interface Page {
    name: string,
    targetController: () => ViewController
}
export const pagesData : Page[] = [
    {
        name: "Home",
        targetController: () => new HomeController()
    },
    {
        name: "From Node-Link Diagram To Matrix",
        targetController: () => new ContentReaderController()
    },
    {
        name: "Matrix Patterns",
        targetController: () => new ContentReaderController()
    },
    {
        name: "Sorting Matrix",
        targetController: () => new ContentReaderController()
    }
]