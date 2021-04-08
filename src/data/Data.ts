import {Component} from "../UI/Component";

type Cell = [number, number]
type Area = [Cell, Cell]

export namespace Highlight {

    export const defaultHighlightColor = "#0a7fcf"

    export interface LabelHighlight {
        indexes: number[]
        color?: string
    }

    export const label = (index: number, color = defaultHighlightColor) => {
        return [index, color]
    }

    export const area = (area: Area,
                         highlightFilledOnly: boolean = true,
                         oneByOne: boolean = false,
                         color: string = defaultHighlightColor) => {
        return new AreaHighlight([area], false, oneByOne, highlightFilledOnly, color)
    }

    export const areas = (areas: Area[],
                          union: boolean = true,
                          highlightFilledOnly: boolean = true,
                          oneByOne: boolean = false, color: string = defaultHighlightColor) => {
        return new AreaHighlight(areas, union, oneByOne, highlightFilledOnly, color)
    }

    export const cells = (cells: Cell[],
                          oneByOne: boolean = false,
                          color: string = defaultHighlightColor) => {
        return new CellGroupHighlight(cells, oneByOne, color)
    }

    export const cell = (cell: Cell,
                         oneByOne: boolean = false,
                         color: string = defaultHighlightColor) => {
        return new CellGroupHighlight([cell], oneByOne, color)
    }

    export class AreaHighlight {

        private _areas: Area[]
        private _color: string
        private _highlightFilledOnly: boolean
        private _isOneByOne: boolean
        private _isReverse: boolean
        _exceptions: Cell[] = []
        private _duration: number = 500
        private _delay: number = 50
        private _union: boolean


        get union(): boolean
        {
            return this._union;
        }

        get isOneByOne(): boolean
        {
            return this._isOneByOne;
        }

        get isReverse(): boolean
        {
            return this._isReverse;
        }

        get exceptions(): Cell[]
        {
            return this._exceptions
        }

        get areas(): Area[]
        {
            return this._areas;
        }

        get color(): string
        {
            return this._color;
        }

        get highlightFilledOnly(): boolean
        {
            return this._highlightFilledOnly;
        }


        get duration(): number
        {
            return this._duration;
        }

        get delay(): number
        {
            return this._delay;
        }

        constructor(areas: Area[],
                    union: boolean = true,
                    oneByOne: boolean,
                    highlightFilledOnly: boolean = true, color: string = 'blue')
        {
            this._areas = areas
            this._union = union
            this._isOneByOne = oneByOne
            this._highlightFilledOnly = highlightFilledOnly
            this._color = color
        }

        animateOneByOne(v: boolean, reverseDirection: boolean = false): AreaHighlight
        {
            this._isOneByOne = v
            this._isReverse = reverseDirection
            return this
        }

        highlightColor(color: string): AreaHighlight
        {
            this._color = color
            return this
        }

        animateDuration(duration: number)
        {
            this._duration = duration
            return this
        }

        animateDelay(delay: number)
        {
            this._delay = delay
            return this
        }

        except(...cells: Cell[]): AreaHighlight
        {
            this._exceptions = cells
            return this
        }
    }

    export class CellGroupHighlight {
        readonly cells: Cell[]
        readonly color: string
        readonly oneByOne: boolean

        constructor(cells: Cell[], oneByOne: boolean = false, color: string)
        {
            this.cells = cells;
            this.color = color;
            this.oneByOne = oneByOne;
        }
    }

}

export namespace Data {
    export namespace MatrixPatterns {

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
            ]
        }

        const connectionDelay = 300
        const connectionColor = '#ff4b78'
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
                                ]).highlightColor('#f3b70a'),
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
            labelHighlight: {
                indexes: [1, 5],
                color: Highlight.defaultHighlightColor
            }
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
    labelHighlight? : Highlight.LabelHighlight
}


