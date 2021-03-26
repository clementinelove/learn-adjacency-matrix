import {AdjacencyMatrixIntro} from "../controller/tutorials/AdjacencyMatrixIntro";
import {ViewController} from "../UI/ViewController";
import {HomeController} from "../controller/HomeController";
import {PatternViewer} from "../controller/PatternViewer";

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
        targetController: () => new AdjacencyMatrixIntro()
    },
    {
        name: "Matrix Patterns",
        targetController: () => new PatternViewer()
    },
    {
        name: "Sorting Matrix",
        targetController: () => new AdjacencyMatrixIntro()
    }
]