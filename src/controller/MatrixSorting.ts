import {ViewController} from "../UI/ViewController";
import {AdjacencyMatrix} from "../components/svg/AdjacencyMatrix";
import {ExampleGraphs} from "../data/ExampleGraphs";
import {TitledButton} from "../components/TitledButton";

export class MatrixSorting extends ViewController {

    constructor()
    {
        super('matrixSorting');

        const adjacencyMatrix = this.allocate(new AdjacencyMatrix(ExampleGraphs.getExample(4)))
        const button = this.allocate(new TitledButton("Generate to Console"))

        button.on('click', () => {
            console.log(adjacencyMatrix.graph.toNumbersArray(adjacencyMatrix.graph.vertices))
        })

        this.view.add(adjacencyMatrix)
        this.view.add(button)

    }


}