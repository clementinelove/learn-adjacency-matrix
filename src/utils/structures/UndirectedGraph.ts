import * as reorder from "reorder.js";
import {Equatable, Range, shuffled, sumOfArithmeticSequence} from "../Utils";
import {ObjectSet} from "./ObjectSet";
import {Vertex} from "../../data/animations/network/GenerateLabels";
import {OrderedLabels} from "./OrderedLabels";
import {CellPosition, PositionedCell} from "../../components/svg/MatrixView";
import {Order} from "reorder.js";

export class Edge implements Equatable<Edge> {
    readonly vertex0: Vertex
    readonly vertex1: Vertex
    readonly weight: number

    constructor(v0: Vertex, v1: Vertex, weight: number = null)
    {
        this.vertex0 = v0;
        this.vertex1 = v1;
        this.weight = weight;
    }

    static tuples(...tuples: [v0: Vertex, v1: Vertex][]) {
        return tuples.map((tuple) => new Edge(tuple[0], tuple[1]))
    }

    equals = (anotherValue: Edge): boolean => {
        return this.weight === anotherValue.weight
            && ((this.vertex0 === anotherValue.vertex0 && this.vertex1 === anotherValue.vertex1) ||
                (this.vertex0 === anotherValue.vertex1 && this.vertex1 === anotherValue.vertex0))
    }


    isConnected = (vertex0: Vertex, vertex1: Vertex): boolean => {
        return (vertex0 === this.vertex0 && vertex1 === this.vertex1 ||
            vertex1 === this.vertex0 && vertex0 === this.vertex1)
    }

    get isReflexive(): boolean {
        return this.vertex0 === this.vertex1
    }
}

type VertexTuple = [Vertex, Vertex]

interface LabeledPosition {
    rowLabel: string
    columnLabel: string
}

// if relationship is a number, it exists and the number represent it's weight (null means no weight)
// if relationship is false, it doesn't exist
type Relationship = number | false

export interface DrawingInstruction {
    position: LabeledPosition
    filling: Relationship
}

export function drawingInstructionToPositionedCell(di: DrawingInstruction, vertexOrder: Vertex[]) : PositionedCell {
    const {rowLabel, columnLabel} = di.position
    const rowIndex = vertexOrder.indexOf(rowLabel)
    const colIndex = vertexOrder.indexOf(columnLabel)
    return {
        position: new CellPosition(rowIndex, colIndex),
        value: di.filling === false ? 0 : 1
    }
}

export class UndirectedGraph extends EventTarget {

    // todo: consider replacing the implementation using a dict
    //       e.g. row['labelZ'] : Vertex[]=> ['labelX', 'labelY']
    //       benefit: might get value faster
    //       drawbacks: duplicate relationship references

    private _edges: ObjectSet<Edge>
    private _vertices: Array<Vertex>

    private constructor(vertices: Vertex[], ...edges: Edge[])
    {
        super()
        this._vertices = vertices
        if (new Set(vertices).size < vertices.length)
        {
            throw new Error("Input vertex names are not unique.")
        }
        this._edges = new ObjectSet(edges);
    }

    get vertices(): Array<Vertex>
    {
        return this._vertices
    }

    get edges(): Array<Edge>
    {
        return this._edges.toArray()
    }

    addVertex = (vertex: Vertex) =>
    {
        this._vertices.push(vertex)

        this.dispatchEvent(new CustomEvent<Vertex>(UndirectedGraph.Event.nodeAdded, {
            detail: vertex
        }))
    }

    removeVertex = (vertex: Vertex) => {
        this._vertices = this._vertices.filter(v => v !== vertex)

        this.dispatchEvent(new CustomEvent<Vertex>(UndirectedGraph.Event.nodeRemoved, {
            detail: vertex
        }))
    }

    addEdge = (edge: Edge) =>
    {
        this._edges.add(edge)
        this.dispatchEvent(new CustomEvent<Edge>(UndirectedGraph.Event.edgeAdded, {
            detail: edge
        }))
    }

    removeEdge = (edge: Edge) =>
    {
        this._edges.remove(edge)

        this.dispatchEvent(new CustomEvent<Edge>(UndirectedGraph.Event.edgeRemoved, {
            detail: edge
        }))
    }

    static fromMatrix(matrix: Relationship[][], orderedLabels: OrderedLabels)
    {
        const MATRIX_SIZE = matrix.length
        const orderedVertex = orderedLabels.labelArray(MATRIX_SIZE)
        const edges: Edge[] = []
        for (let row = 0; row < MATRIX_SIZE; row++)
        {
            const currentVertex = orderedVertex[row]
            const currentRow = matrix[row]
            for (let column = row; column < MATRIX_SIZE; column++)
            {
                const relationship = currentRow[column]

                if (relationship !== 0)
                {
                    edges.push(new Edge(currentVertex, orderedVertex[column], null))
                }
            }
        }
        return new UndirectedGraph(orderedVertex, ...edges)
    }

    static fromTuples(vertices: Vertex[], edges: [Vertex, Vertex, number][]): UndirectedGraph
    {
        const undirectedEdges = edges.map((edgeTuple) => new Edge(edgeTuple[0], edgeTuple[1], edgeTuple[2]))
        return new UndirectedGraph(vertices, ...undirectedEdges)
    }

    /**
     * Test whether two vertex are connected in this graph.
     * @param vertex0
     * @param vertex1
     * @return `false` if they are not connected, or the weight of the edge if they do.
     */
    isConnected = (vertex0: Vertex, vertex1: Vertex): number | false => {
        for (const edge of this._edges.toArray())
        {
            if (edge.isConnected(vertex0, vertex1))
            {
                return edge.weight
            }
        }
        return false
    }

    // closure


    toMatrix = (orderedLabels: Vertex[]) => {
        // undirected: fill both cell
        // directed: fill only one cell
        // ask: does this relationship exist in the graph?
        const LABEL_COUNT = orderedLabels.length
        const matrix: (Relationship[])[] = Array(LABEL_COUNT)
        for (let rowIndex = 0; rowIndex < orderedLabels.length; rowIndex++)
        {
            const row: Relationship[] = Array(LABEL_COUNT)
            const rowVertex = orderedLabels[rowIndex] // the vertex represented by the row index
            for (let columnIndex = 0; columnIndex < orderedLabels.length; columnIndex++)
            {
                const columnVertex = orderedLabels[columnIndex]
                row[columnIndex] = this.isConnected(rowVertex, columnVertex)
            }
            matrix[rowIndex] = row
        }
        return matrix
    }


    toReorderJSGraph = (orderedLabels: Vertex[]) => {
        const leafOrder = reorder.optimal_leaf_order()
                                 .distance(reorder.distance.manhattan)
                                 .reorder(this.toNumbersArray(orderedLabels, false))
    }

    toNumbersArray(orderedLabels: Vertex[] = this._vertices, weighted: boolean = false): number[][]
    {
        const resultArray: number[][] = Array(orderedLabels.length)
        for (let rowIndex = 0; rowIndex < orderedLabels.length; rowIndex++)
        {
            const rowArray: number[] = Array(orderedLabels.length)
            const rowVertex = orderedLabels[rowIndex] // the vertex represented by the row index
            for (let columnIndex = 0; columnIndex < orderedLabels.length; columnIndex++)
            {
                const columnVertex = orderedLabels[columnIndex]
                const connected = this.isConnected(rowVertex, columnVertex)
                if (weighted)
                {
                    rowArray[columnIndex] = connected === false ? 0 : connected
                }
                else
                {
                    rowArray[columnIndex] = connected === false ? 0 : 1
                }
            }
            resultArray[rowIndex] = rowArray
        }
        return resultArray
    }

    toDrawingInstructionArray(orderedLabels: Vertex[]): DrawingInstruction[]
    {
        const verticesCount = this._vertices.length
        const totalInstructionCount = verticesCount * verticesCount
        const drawingInstructionArray: DrawingInstruction[] = Array(totalInstructionCount)
        let instructionCount = 0
        for (let rowIndex = 0; rowIndex < orderedLabels.length; rowIndex++)
        {
            const rowVertex = orderedLabels[rowIndex] // the vertex represented by the row index
            for (let columnIndex = 0; columnIndex < orderedLabels.length; columnIndex++)
            {
                const columnVertex = orderedLabels[columnIndex]
                drawingInstructionArray[instructionCount] = {
                    position: {rowLabel: orderedLabels[rowIndex], columnLabel: orderedLabels[columnIndex]},
                    filling: this.isConnected(rowVertex, columnVertex)
                }
                instructionCount = instructionCount + 1
            }
        }
        return drawingInstructionArray
    }

    static reorderedLabels(orderedLabels: string[], graph: UndirectedGraph): string[]
    {
        const newOrder = reorder.optimal_leaf_order()
                                .distance(reorder.distance.manhattan)
                                .reorder(graph.toNumbersArray(orderedLabels))
        return newOrder.map((labelIndex: number) => {
            return orderedLabels[labelIndex]
        })
    }

}

enum Pattern {
    NodeClique,
    NodeCluster,
    SelfLinks,
    Paths,
    Connectors,
    HubNodes
}

/*
nodeCount: number,
patternCount: number,
patternSize: number
*/


export enum VertexNameStyle {
    Numeric,
    LowercasedAlphabetic,
    UppercasedAlphabetic
}

// {styleName: "Numeric", f: }

/**
 * @param style The style or styles for generating vertex names Use array if you want to use multiple name styles in the order specified by the array.
 */

// todo: - support multiple vertex name styles.
export function vertexArray(style: VertexNameStyle | VertexNameStyle[], ...counts: number[]): Vertex[][]
{
    // todo: check style array length === counts
    const arrays: Vertex[][] = Array(counts.length)

    let next = 0
    for (let i = 0; i < counts.length; i++)
    {
        const count = counts[i]
        if (count <= 0)
        {
            throw new Error('array count should be a positive number.')
        }
        else if (((style === VertexNameStyle.UppercasedAlphabetic) ||
            (style === VertexNameStyle.LowercasedAlphabetic)) && counts.length > 26)
        {
            throw new Error('Alphabetic names only ranged from a-z or A-Z. ')
        }
        else
        {
            const subArray: Vertex[] = Array(count)
            for (let i = 0; i < subArray.length; i++)
            {
                switch (style)
                {
                    case VertexNameStyle.Numeric:
                        subArray[i] = `${next + i + 1}`
                        break
                    case VertexNameStyle.LowercasedAlphabetic:
                        const charCodeOfLowercaseA = 'a'.charCodeAt(0)
                        subArray[i] = String.fromCharCode(charCodeOfLowercaseA + next + i)
                        break
                    case VertexNameStyle.UppercasedAlphabetic:
                        const charCodeOfUppercaseA = 'A'.charCodeAt(0)
                        subArray[i] = String.fromCharCode(charCodeOfUppercaseA + next + i)
                        break
                }
            }
            arrays[i] = subArray
            next = next + count
        }
    }
    console.log('names: ' + arrays)
    return arrays
}


// todo
export function randomGraph(vertices: Vertex[], reflexive: boolean, patternDensity: number): Edge[]
{
    const verticesCount = vertices.length
    const edgesCount = sumOfArithmeticSequence(1, 1, verticesCount - 1) - (reflexive ? verticesCount : 0)
    const filledEdgesCount = Math.floor(patternDensity * edgesCount)
    const extraVertexCount = edgesCount - filledEdgesCount

    let edges: Edge[] = []

    for (let i = 0; i < verticesCount; i++)
    {
        const sourceVertex = vertices[i]
        for (let j = i; j < verticesCount; j++)
        {
            const targetVertex = vertices[j]
            if (sourceVertex === targetVertex)
            {
                if (reflexive)
                {
                    edges.push(new Edge(sourceVertex, targetVertex))
                }
            }
            else
            {
                edges.push(new Edge(sourceVertex, targetVertex))
            }

        }
    }

    console.log(`edges count: ${edgesCount}`)
    console.log(`filled count: ${filledEdgesCount}`)
    console.log(`extra count: ${extraVertexCount}`)
    console.log(edges)

    edges = shuffled(edges)
    console.log(edges)
    edges = edges.slice(extraVertexCount)
    console.log(edges)
    return edges
}

export function cliqueEdges(vertices: Vertex[], reflexive: boolean)
{
    const verticesCount = vertices.length
    const edges = new ObjectSet<Edge>()

    for (let i = 0; i < verticesCount; i++)
    {
        const sourceVertex = vertices[i]
        for (let j = i; j < verticesCount; j++)
        {
            const targetVertex = vertices[j]
            if (sourceVertex === targetVertex)
            {
                if (reflexive)
                {
                    edges.add(new Edge(sourceVertex, targetVertex))
                }
            }
            else
            {
                edges.add(new Edge(sourceVertex, targetVertex))
            }
        }
    }
    return edges
}

function stair(vertices: Vertex[], reflexive: boolean, patternDensity: number)
{

}


function cluster(vertices: Vertex[], reflexive: boolean, patternDensity: number)
{

}

/*
function renameEdges(edges: Edge[], dict: ) {

}
*/

// todo
function graphWithClique(vertexCount: number = null,
                         patternCount: number,
                         patternSize: Range,
                         randomBits: boolean)
{
    const MINIMUM_REQUIRED_VERTEX_COUNT = 2
    if (patternCount > (vertexCount / MINIMUM_REQUIRED_VERTEX_COUNT))
    {
        throw new Error("vertex isn't enough with vertex count")
    }

}


export namespace UndirectedGraph {
    export enum Event {
        nodeRemoved= 'nodeRemoved',
        nodeAdded = 'nodeAdded',
        edgeAdded = 'edgeAdded',
        edgeRemoved = 'edgeRemoved'
    }
}