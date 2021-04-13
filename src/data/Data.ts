import {Component} from "../UI/Component";
import {Highlight} from "../utils/Highlight";

export namespace Data {
    export namespace MatrixPatterns {

        import secondaryHighlightColor = Highlight.secondaryHighlightColor;
        export const clique: MatrixPatternData = {
            name: "Node Clique",
            shape: "Block",
            description: "Set of nodes where every node is connected to every other node.",
            typicalExample: [
                [0, 1, 1, 1, 1],
                [1, 0, 1, 1, 1],
                [1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1],
                [1, 1, 1, 1, 0]
            ],
            instances: [
                [
                    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                ]
            ],
            areaHighlights: [
                Highlight.areas([[[0, 0], [3, 3]], [[4, 4], [8, 8]], [[9, 9], [11, 11]]])
            ]
        }

        export const cluster: MatrixPatternData = {
            name: "Node Cluster",
            shape: "Cluster",
            description: "Set of nodes where almost all nodes are connected. If all links would be present, the cluster would be a clique.",
            typicalExample: [
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 1],
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 1],
                [0, 1, 0, 1, 0]
            ],
            instances: [
                [
                    [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
                    [0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                    [0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0]
                ]
            ],
            areaHighlights: [
                Highlight.area([[0, 0], [7, 7]])
            ]
            ,
            labelHighlight: [
                {
                    indexes: [0,1,2,3,4,5,6,7],
                    color: Highlight.mainHighlightColor
                }
            ]
        }

        export const selfLinks: MatrixPatternData = {
            name: "Self Links",
            shape: "Diagonals",
            description: "Self-links are the filled cells along the matrix diagonal that connect a node to itself. Examples include self-citations in citation networks.",
            typicalExample: [
                [1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ],
            instances: [
                [
                    [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0]
                ]
            ],
            cellGroupHighlights: [
                Highlight.cells([[3, 3], [4, 4], [5, 5], [7, 7], [8, 8], [9, 9]])
            ]
        }

        export const paths: MatrixPatternData = {
            name: "Paths",
            shape: "Stairs",
            description: "A set of nodes so that there is a set of connections that lead from the first to the last node in that set.",
            typicalExample: [
                [0, 0, 1, 1, 0],
                [0, 0, 0, 1, 1],
                [1, 0, 0, 0, 1],
                [1, 1, 0, 0, 0],
                [0, 1, 1, 0, 0]
            ],
            instances: [
                [
                    [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
                    [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
                    [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
                    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1]
                ]
            ],
            areaHighlights: [
                Highlight.area([[4, 0], [9, 5]], true, true).except([6, 4]),
                Highlight.area([[0, 4], [5, 9]], true, true).except([4, 6])
            ],
            labelHighlight: [
                {
                    indexes: [0, 4],
                    color: Highlight.mainHighlightColor
                },
                {
                    indexes: [5, 9],
                    color: Highlight.secondaryHighlightColor
                }
            ]
        }

        const connectionDelay = 300
        export const connectors: MatrixPatternData = {
            name: "Connectors",
            shape: "Off-diagonal cells",
            description: "Connectors indicate links between two cliques or clusters.",
            typicalExample: [
                [1, 1, 0, 1, 0],
                [1, 1, 0, 0, 1],
                [0, 0, 0, 0, 0],
                [1, 0, 0, 1, 1],
                [0, 1, 0, 1, 1]
            ],
            instances: [
                [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
                    [0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
                    [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0]
                ]
            ],
            areaHighlights: [
                // connectors
                Highlight.areas([
                                    [[1, 9], [4, 11]],
                                    [[9, 1], [11, 4]]
                                ]),
                // clusters
                Highlight.areas([
                                    [[1, 1], [4, 4]],
                                    [[8, 8], [11, 11]]
                                ]).highlightColor(secondaryHighlightColor),
            ],
            labelHighlight: [
                {
                    indexes: [1, 3, 10, 11],
                    color: Highlight.mainHighlightColor
                },
            ]
        }

        export const hub: MatrixPatternData = {
            name: "Hub Nodes",
            shape: "Dense row / column",
            description: "Highly connected nodes that are visible by row and columns with many cells. Cells do not need to be adjacent.",
            typicalExample: [
                [0, 1, 0, 0, 0],
                [1, 1, 1, 1, 1],
                [0, 1, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 1, 0, 0, 0]
            ],
            instances: [
                [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
                    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
                    [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
                    [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
                    [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1]
                ]
            ],
            areaHighlights: [
                Highlight.areas([
                                    [[0, 0], [0, 8]],
                                    [[0, 0], [8, 0]],
                                    [[2, 4], [7, 4]],
                                    [[4, 2], [4, 7]],
                                    [[4, 9], [4, 11]],
                                    [[9, 4], [11, 4]]
                                ])
            ],
            labelHighlight: [
                {
                    indexes: [0, 4],
                    color: Highlight.mainHighlightColor
                }
            ]
        }

// static readonly path = [
//     [1, 0, 0, 0, 0],
//     [1, 1, 0, 0, 0],
//     [0, 1, 1, 0, 0],
//     [0, 0, 1, 1, 0],
//     [0, 0, 0, 1, 1]
// ]

        export const allPatterns = [
            clique,
            cluster,
            selfLinks,
            paths,
            connectors,
            hub
        ]

    }
}

export interface MatrixPatternData {
    name: string
    shape: string
    typicalExample: number[][]
    description: string
    controls?: Component[]
    instances: number[][][]
    cellGroupHighlights?: Highlight.CellGroupHighlight[]
    areaHighlights?: Highlight.AreaHighlight[]
    labelHighlight?: Highlight.LabelHighlight[]
}


