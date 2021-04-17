import {UndirectedGraph} from "../../../utils/structures/UndirectedGraph"
import {CanvasAnimation, CanvasRuler, PointTransitionScale, Ticker} from "../../../utils/CanvasUtils"
import {arc, controlPointPosition, distance, filledArc, midpoint, Point, roundedRect} from "../../../utils/structures/Geometry"
import {MatrixStyle} from "../../../components/svg/AdjacencyMatrix";
import {Vertex} from "./GenerateLabels";
import {
    NetworkData,
    NetworkSimulationLink,
    NetworkSimulationNode,
    PositionedNode
} from "./NetworkAnimationData";
import {Simulation} from "../../Simulation";
import {NetworkDiagramStyle} from "../../../components/svg/NodeLinkDiagram";

export const customInterpolate = (() =>{

})()
export abstract class NetworkAnimation implements CanvasAnimation {
    protected context: CanvasRenderingContext2D;
    originalSimNodes: NetworkSimulationNode[]
    originalSimLinks: NetworkSimulationLink[]
    networkDiagramStyle: NetworkDiagramStyle
    matrixStyle: MatrixStyle
    graph: UndirectedGraph
    started: boolean;
    center: Point
    ticker: Ticker
    duration: number
    simulation: Simulation;
    sharedData: NetworkData


    get currentTick() : number
    {
        return this.ticker.tick
    }

    get currentTickProgress() : number
    {
        return this.ticker.tick / this.duration
    }

    // duration: number;
    // ticker: Ticker;

    getNodePositionInMatrix= (i : number) => {
        const {nodeRadius} = this.networkDiagramStyle
        const nodeDiameter = nodeRadius * 2
        const {padding, spaceBetweenLabels} = this.matrixStyle
        return this.centerOffset[0] + padding + spaceBetweenLabels + nodeDiameter + nodeRadius + nodeDiameter * i
    }

    protected constructor(sharedData: NetworkData, duration = 0)
    {
        this.loadData(sharedData)
        this.ticker = new Ticker(0)
        this.duration = duration
    }

    private loadData = (d: NetworkData) => {
        this.sharedData = d
        const {networkDiagramStyle, graph, matrixStyle, simulation} = d
        this.networkDiagramStyle = networkDiagramStyle
        this.matrixStyle = matrixStyle
        this.graph = graph
        this.simulation = simulation
        this.center = new Point(networkDiagramStyle.frame.width / 2, networkDiagramStyle.frame.height / 2)
    }

    abstract finish(): void

    abstract play(context: CanvasRenderingContext2D): void

    abstract prepare(): void

    get centerOffset() : [number, number] {
        const {nodeRadius} = this.networkDiagramStyle
        const {padding, spaceBetweenLabels} = this.matrixStyle
        const nodeDiameter = nodeRadius * 2

        const matrixSideLength = nodeDiameter * (this.simulation.simNodes.length + 1) // (nodes + label)
        return [this.center.x - matrixSideLength / 2 - padding - spaceBetweenLabels,
            this.center.y - matrixSideLength / 2 - padding - spaceBetweenLabels]
    }

    linkColor(v0: Vertex, v1: Vertex, colorScale: (t: number) => string): string
    {
        const edgesCount = this.graph.edges.length
        const indexOfLink = this.graph.edges.findIndex((e) => e.isConnected(v0, v1))
        return colorScale(indexOfLink / edgesCount)
    }

    moveNodes = (nodes: PositionedNode[],
                 transitionScales: Map<Vertex, PointTransitionScale>, time: number) => {
        nodes.forEach((node) => {
            const vertex = node.vertex
            const nodeTransitionScaler = transitionScales.get(vertex)
            node.x = nodeTransitionScaler.x(time)
            node.y = nodeTransitionScaler.y(time)
            const {x, y} = node
            this.drawNodeShape(x, y)
            this.drawNodeText(x, y, vertex)
        })
    }

    drawLink = (sourceX, sourceY, targetX, targetY, stroke: string) => {
        this.context.beginPath()
        this.context.moveTo(sourceX, sourceY)
        this.context.lineTo(targetX, targetY)
        this.context.save()
        this.context.lineWidth = 2
        this.context.strokeStyle = (stroke === null ? this.networkDiagramStyle.linkColor : stroke)
        this.context.stroke()
        this.context.closePath()
        // this.context.lineWidth = 1
        this.context.restore()
    }

    drawNode = (cx: number, cy: number, text: string,
                transparency: number = 1.0, fill: string, stroke: string,
                textColor: string, roundedPercentage = 1) => {
        this.drawNodeShape(cx, cy, roundedPercentage, transparency, fill, stroke)
        this.drawNodeText(cx, cy, text, transparency, textColor)
    }

    drawCell = (cx: number, cy: number, fill: string, sideLength: number, roundedPercentage = 0,
                transparency: number = 1.0, stroke: string = this.matrixStyle.cellStrokeColor) => {

        this.context.globalAlpha = transparency
        const halfLength = sideLength / 2
        roundedRect(this.context, cx - halfLength, cy - halfLength, sideLength, roundedPercentage)
        this.context.fillStyle = fill
        this.context.strokeStyle = stroke
        this.context.stroke()
        this.context.fill()
        this.context.globalAlpha = 1
    }

    drawNodeShape = (cx: number, cy: number,
                     roundedPercentage = 1, transparency: number = 1.0,
                     fill: string = null, stroke: string = null) => {
        this.context.beginPath()
        this.context.globalAlpha = transparency
        const {nodeRadius, nodeColor, nodeStrokeColor} = this.networkDiagramStyle

        // this.context.moveTo(cx + nodeRadius, cy)
        // this.context.arc(cx, cy, nodeRadius, 0, 2 * Math.PI)
        roundedRect(this.context, cx - nodeRadius, cy - nodeRadius, nodeRadius * 2, roundedPercentage)

        this.context.fillStyle = (fill === null ? nodeColor : fill)
        this.context.strokeStyle = (stroke === null ? nodeStrokeColor : stroke)

        this.context.fill()
        this.context.stroke()
        this.context.closePath()
        this.context.globalAlpha = 1
    }

    drawNodeText = (cx: number, cy: number, text: string,
                    transparency: number = 1.0,
                    fill: string = null) => {
        this.context.beginPath()
        const {fontName, fontSize, nodeRadius, textColor} = this.networkDiagramStyle
        const font = `${fontSize} ${fontName}`
        this.context.moveTo(cx + nodeRadius, cy)
        this.context.font = font
        const nodeText = text
        const nodeTextWidth = CanvasRuler.getTextMetrics(nodeText, fontName, fontSize).width
        this.context.globalAlpha = transparency
        this.context.fillStyle = (fill === null ? textColor : fill)
        this.context.textBaseline = 'middle'
        this.context.fillText(nodeText, cx - nodeTextWidth / 2, cy)
        this.context.closePath()
        this.context.globalAlpha = 1
    }

    protected drawArc(sourcePoint: Point,
                      targetPoint: Point,
                      controlPointFinder: (sourcePoint, mid, targetPoint) => (boolean) => Point,
                      radiusFinder: (sourcePoint, mid, targetPoint, controlPoint) => number,
                      linkColor: string)
    {
        const mid = midpoint(targetPoint, sourcePoint)
        // const findCurrentControlPoint = (positiveDistance: boolean) => {
        //     const maxControlPoint = controlPointPosition(sourcePoint, targetPoint,
        //                                                  (positiveDistance ? 1 : -1) * distance(sourcePoint, targetPoint) / 2)
        //     const controlPointTransitionScaler =
        //         new PointTransitionScale(mid.x, mid.y,
        //                                  maxControlPoint.x, maxControlPoint.y,
        //                                  duration)
        //     return controlPointTransitionScaler.point(currentTick);
        // }


        const findCurrentControlPoint = controlPointFinder(sourcePoint, mid, targetPoint)
        const maxControlPoint = (positive) => controlPointPosition(sourcePoint, targetPoint, (positive ? 1 : -1) * distance(sourcePoint, targetPoint) / 2)

        const currentControlPoint = findCurrentControlPoint(true)

        const radius = radiusFinder(sourcePoint, mid, targetPoint, currentControlPoint)

        const outerOffset = 7
        const innerOffset = 12
        arc(this.context, sourcePoint, findCurrentControlPoint(true), targetPoint, radius + outerOffset, linkColor)
        arc(this.context, sourcePoint, findCurrentControlPoint(false), targetPoint, radius + outerOffset, linkColor)
        filledArc(this.context, sourcePoint, findCurrentControlPoint(true), targetPoint, radius, innerOffset, outerOffset, linkColor)
        filledArc(this.context, sourcePoint, findCurrentControlPoint(false), targetPoint, radius, innerOffset, outerOffset, linkColor)
    }


}







