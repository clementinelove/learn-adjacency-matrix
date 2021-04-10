import {AdjacencyMatrixIntro} from "../controller/tutorials/AdjacencyMatrixIntro";
import {ViewController} from "../UI/ViewController";
import {HomeController} from "../controller/HomeController";
import {PatternViewer} from "../controller/PatternViewer";
import {MatrixReorderingIntro} from "../controller/tutorials/MatrixReorderingIntro";
import {PatternsIntro} from "../controller/tutorials/PatternsIntro";
import {MatrixSorting} from "../controller/MatrixSorting";

export interface Page {
    name: string,
    description: string
    targetController: () => ViewController
}
export const pagesData : Page[] = [
    {
        name: "Home",
        description: "Home Page",
        targetController: () => new HomeController()
    },
    {
        name: "Introduction",
        description: "From Node-Link Diagram to Matrix",
        targetController: () => new AdjacencyMatrixIntro()
    },
    {
        name: "Matrix Patterns",
        description: "Common Patterns for Adjacency Matrix",
        targetController: () => new PatternsIntro()
    },
    {
        name: "Reordering",
        description: "Reordering Matrix to find patterns",
        targetController: () => new MatrixReorderingIntro()
    },
    {
        name: "Lyon Metro",
        description: "Lyon Metro Testing",
        targetController: () => new MatrixSorting()
    }
    // ,
    // {
    //     name: "Lyon Metro",
    //     description: "Lyon Metro Testing",
    //     targetController: () => new MatrixSorting()
    // }
]