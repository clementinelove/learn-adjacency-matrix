import {UndirectedGraph} from "../utils/structures/UndirectedGraph";
import {OrderedLabels} from "../utils/structures/OrderedLabels";

export namespace ExampleGraphs {

    export const lyonMetro =
        UndirectedGraph.fromMatrix(
            [
              // A  B  C  D  E  F  G  H  I  J  K
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // A
                [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // B
                [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0], // C
                [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0], // D
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1], // E
                [1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0], // F
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // G
                [0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0], // H
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // I
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // J
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // K
            ]
            , OrderedLabels.alphabeticUppercase)

    const exampleGraphs = [

        [
            [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
            [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
        ],
        [
            [0, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1, 0],
            [1, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1, 1],
            [1, 1, 1, 1, 0, 1],
        ],
        [
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0],
        ],
        [
            [0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 0, 1],
            [1, 1, 0, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 1, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0],
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        [
            [1, 1, 1, 0, 1, 1],
            [1, 1, 1, 0, 0, 1],
            [1, 1, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1],
            [1, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 0]
        ]
    ]

    export function getExample(exampleIndex: number): UndirectedGraph
    {
        return UndirectedGraph.fromMatrix(exampleGraphs[exampleIndex], OrderedLabels.numeric)
    }
}