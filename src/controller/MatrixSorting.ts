import {ViewController} from "../UI/ViewController";
import {AdjacencyMatrix} from "../components/svg/AdjacencyMatrix";
import {ExampleGraphs} from "../data/ExampleGraphs";
import {TitledButton} from "../components/TitledButton";

export class MatrixSorting extends ViewController {

    constructor()
    {
        super('matrixSorting');

        const adjacencyMatrix = this.allocate(new AdjacencyMatrix(AdjacencyMatrix.defaultStyle, ExampleGraphs.lyonMetro))
        const button = this.allocate(new TitledButton("Generate to Console"))

        button.on('click', () => {
            // console.log(adjacencyMatrix._graph.toNumbersArray(adjacencyMatrix.graph.vertices))
            adjacencyMatrix.autoReorderLabels()

        })

        this.view.add(adjacencyMatrix)
        this.view.add(button)

    }


}