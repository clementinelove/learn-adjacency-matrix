import {AdjacencyMatrixIntro} from "../controller/tutorials/AdjacencyMatrixIntro";
import {ViewController} from "../UI/ViewController";
import {HomeController} from "../controller/HomeController";
import {PatternViewer} from "../controller/PatternViewer";
import {MatrixReorderingIntro} from "../controller/tutorials/MatrixReorderingIntro";
import {PatternsIntro} from "../controller/tutorials/PatternsIntro";
import {MatrixSorting} from "../controller/MatrixSorting";

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
        name: "From Node-Link Diagram To Matrix Intro",
        targetController: () => new AdjacencyMatrixIntro()
    },
    {
        name: "Matrix Patterns Intro",
        targetController: () => new PatternsIntro()
    },
    {
        name: "Sorting Matrix Intro",
        targetController: () => new MatrixReorderingIntro()
    },
    {
        name: "Pattern Viewer",
        targetController: () => new PatternViewer()
    },
    {
        name: "Reordering",
        targetController: () => new MatrixSorting()
    }
]