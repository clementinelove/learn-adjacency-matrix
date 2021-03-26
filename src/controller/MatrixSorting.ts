import {ViewController} from "../UI/ViewController";
import {AdjacencyMatrix} from "../components/svg/AdjacencyMatrix";
import {ExampleGraphs} from "../data/ExampleGraphs";

export class MatrixSorting extends ViewController {

    constructor()
    {
        super('matrixSorting');

        const adjacencyMatrix = this.allocate(new AdjacencyMatrix(ExampleGraphs.getExample(0)))

        this.dom.add(adjacencyMatrix)
    }


}