import {controlPointPosition, distance, Point} from "../Geometry";
import {PointTransitionScale} from "../CanvasUtils";
import * as d3 from "d3";
import {NetworkAnimation} from "./NetworkAnimation";
import {NetworkData} from "./NetworkAnimationData";

export type Vertex = string

/**
 * This object is more lightweight compares to d3's simulation nodes
 */
export class LightWeightNode {
    readonly vertex: Vertex
    x: number
    y: number

    constructor(vertex: Vertex, x: number, y: number)
    {
        this.vertex = vertex;
        this.x = x;
        this.y = y;
    }

    get point(): Point
    {
        return new Point(this.x, this.y)
    }
}

class LightWeightLink {
    readonly source: LightWeightNode
    readonly target: LightWeightNode

    constructor(source: LightWeightNode, target: LightWeightNode)
    {
        this.source = source;
        this.target = target;
    }
}

export class GenerateLabels extends NetworkAnimation {
    private hLabelNodes: LightWeightNode[] = []
    private vLabelNodes: LightWeightNode[] = []
    private diagonalNodeMap: Map<Vertex, LightWeightNode> = new Map()
    private lightWeightLinks: LightWeightLink[] = []
    private hLabelToTransitionScales: Map<string, PointTransitionScale>
    private vLabelToTransitionScales: Map<string, PointTransitionScale>

    constructor(data: NetworkData, duration: number)
    {
        super(data);
        this.duration = duration;
    }

    prepare(): void
    {

        const {nodeRadius} = this.networkDiagramStyle
        const {spaceBetweenLabels, padding} = this.matrixStyle
        const nodeDiameter = nodeRadius * 2

        const diagonalNodePosition = (vertex): Point => {
            const nodeIndex = this.graph.vertices.indexOf(vertex)
            const diagonalX = padding + nodeDiameter + spaceBetweenLabels + nodeIndex * nodeDiameter + nodeRadius
            const diagonalY = padding + nodeDiameter + spaceBetweenLabels + nodeDiameter * nodeIndex + nodeRadius
            return new Point(diagonalX, diagonalY)
        }

        this.hLabelToTransitionScales = new Map()
        this.vLabelToTransitionScales = new Map()
        // clone nodes
        this.graph.vertices.forEach((vertex) => {
            const {x, y} = diagonalNodePosition(vertex)
            const labelDestination = padding + nodeRadius

            this.hLabelToTransitionScales.set(vertex, new PointTransitionScale(x, y, x, labelDestination, this.duration))
            this.vLabelToTransitionScales.set(vertex, new PointTransitionScale(x, y, labelDestination, y, this.duration))

            this.hLabelNodes.push(new LightWeightNode(vertex, x, y))
            this.vLabelNodes.push(new LightWeightNode(vertex, x, y))
            this.diagonalNodeMap.set(vertex, new LightWeightNode(vertex, x, y))
        })

        this.graph.edges.forEach((edge) => {
            // this.lightWeightLinks.push(new LightWeightLink(this.graph, edge.vertex1))
        })

        this.ticker.reset()
    }


    play(context: CanvasRenderingContext2D): void
    {
        this.context = context
        const currentTick = this.ticker.tick

        this.lightWeightLinks.forEach((link) => {
            const source = link.source.vertex
            const target = link.target.vertex
            const sourceNode = this.diagonalNodeMap.get(source)
            const targetNode = this.diagonalNodeMap.get(target)
            const radius = 0
            const sourcePoint = sourceNode.point
            const targetPoint = targetNode.point
            const maxControlPointFinder = (positiveDistance: boolean) => {
                return controlPointPosition(sourcePoint, targetPoint,
                                            (positiveDistance ? 1 : -1) * distance(sourcePoint, targetPoint) / 2
                )
            }

            const linkColor = this.linkColor(source, target, d3.interpolateTurbo)
            this.drawArc(sourcePoint, targetPoint,
                         (s, m, t) => maxControlPointFinder,
                         () => radius,
                         linkColor)
        })

        this.moveNodes(this.vLabelNodes, this.vLabelToTransitionScales, currentTick)
        this.moveNodes(this.hLabelNodes, this.hLabelToTransitionScales, currentTick)

        const {textColor, nodeColor, nodeStrokeColor} = this.networkDiagramStyle

        this.diagonalNodeMap.forEach((node) => {
            const {vertex, x, y} = node
            this.drawNode(x, y, vertex, 1.0, nodeColor, nodeStrokeColor, textColor)
        })

        if (currentTick < this.duration)
        {
            this.ticker.increment()
        }
    }

    finish(): void
    {
    }
}