import * as d3 from "d3"
import {UndirectedGraph, Vertex} from "./UndirectedGraph"
import {CanvasAnimation, CanvasRuler, PointTransitionScale, Ticker} from "./CanvasUtils"
import {arc, controlPointPosition, distance, midpoint, Point, Rect} from "./Geometry"
import {MatrixStyle} from "./AdjacencyMatrix";

export interface NetworkSimulationNode extends d3.SimulationNodeDatum {
    vertex: Vertex
    group: number
}

export interface NetworkSimulationLink extends d3.SimulationLinkDatum<NetworkSimulationNode> {
    source: NetworkSimulationNode
    target: NetworkSimulationNode
    value: number
}

type PositionedNode = LightWeightNode | NetworkSimulationNode

/**
 * This object is more lightweight compares to d3's simulation nodes
 */
class LightWeightNode {
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

export interface NetworkDiagramStyle {
    frame: Rect
    fontName?: string
    fontSize?: number
    textColor?: string
    nodeRadius?: number
    nodeColor?: string
    nodeStrokeColor?: string
    linkColor?: string
    linkLength?: number
}

export const initNetworkAnimationData = (graph, networkStyle, matrixStyle): NetworkData => {
    const simNodesMap = new Map<string, NetworkSimulationNode>()
    graph.vertices.forEach((vertex) => {
        simNodesMap.set(vertex, {vertex: vertex, group: 1})
    })
    const simNodes = Array.from(simNodesMap.values())
    const simLinks = graph.edges.map((edge) => {
        return {
            source: simNodesMap.get(edge.vertex0),
            target: simNodesMap.get(edge.vertex1),
            value: 2,
        }
    })

    return {
        simNodes: simNodes,
        simLinks: simLinks,
        networkDiagramStyle: networkStyle,
        matrixStyle: matrixStyle,
        graph: graph
    }
}

function drag(simulation, enable: boolean)
{
    function dragSubject(event)
    {
        return simulation.find(event.x, event.y)
    }

    function dragStarted(event)
    {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }

    function dragged(event)
    {
        event.subject.fx = event.x
        event.subject.fy = event.y
    }

    function dragEnded(event)
    {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    if (enable)
    {

        return d3.drag()
                 .subject(dragSubject)
                 .on("start", dragStarted)
                 .on("drag", dragged)
                 .on("end", dragEnded)
    }
    else
    {
        return d3.drag()
                 .subject(dragSubject)
                 .on("start", null)
                 .on("drag", null)
                 .on("end", null)
    }
}


interface NetworkData {
    simNodes: NetworkSimulationNode[]
    simLinks: NetworkSimulationLink[]
    graph: UndirectedGraph
    networkDiagramStyle: NetworkDiagramStyle
    matrixStyle: MatrixStyle
}

abstract class NetworkAnimation implements CanvasAnimation {
    protected context: CanvasRenderingContext2D;
    simNodes: NetworkSimulationNode[]
    simLinks: NetworkSimulationLink[]
    networkDiagramStyle: NetworkDiagramStyle
    matrixStyle: MatrixStyle
    graph: UndirectedGraph
    started: boolean;

    // duration: number;
    // ticker: Ticker;

    protected constructor(data: NetworkData)
    {
        this.loadData(data)

    }

    private loadData = (d: NetworkData) => {
        const {simNodes, simLinks, networkDiagramStyle, graph, matrixStyle} = d
        this.simNodes = simNodes
        this.simLinks = simLinks
        this.networkDiagramStyle = networkDiagramStyle
        this.matrixStyle = matrixStyle
        this.graph = graph
    }

    abstract finish(): void

    abstract play(context: CanvasRenderingContext2D): void

    abstract prepare(): void

    linkColor(v0: Vertex, v1: Vertex, colorScale: (t: number) => string): string
    {
        const edgesCount = this.graph.edges.length
        const indexOfLink = this.graph.edges.findIndex((e) => e.isConnected(v0, v1))
        return colorScale(indexOfLink / edgesCount)
    }

    drawNodes = (nodes: PositionedNode[], transparency: number = 1.0) => {
        nodes.forEach((n) => {
            const {vertex, x, y} = n

        })
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
        this.context.lineWidth = 2
        this.context.strokeStyle = (stroke === null ? this.networkDiagramStyle.linkColor : stroke)
        this.context.stroke()
        this.context.closePath()
        this.context.lineWidth = 1
    }

    drawNode = (cx: number, cy: number, text: string,
                transparency: number = 1.0, fill: string, stroke: string,
                textColor: string) => {
        this.drawNodeShape(cx, cy, transparency, fill, stroke)
        this.drawNodeText(cx, cy, text, transparency, textColor)
    }

    drawNodeShape = (cx: number, cy: number,
                     transparency: number = 1.0, fill: string = null,
                     stroke: string = null) => {
        this.context.beginPath()
        this.context.globalAlpha = transparency
        const {nodeRadius, nodeColor, nodeStrokeColor} = this.networkDiagramStyle
        this.context.moveTo(cx + nodeRadius, cy)
        this.context.arc(cx, cy, nodeRadius, 0, 2 * Math.PI)
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
        const font = `${fontSize}px ${fontName}`
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


}

export class ForceDirectedAnimation extends NetworkAnimation {

    simulation: d3.Simulation<NetworkSimulationNode, NetworkSimulationLink>;

    constructor(data: NetworkData = null)
    {
        super(data)
    }

    prepare(): void
    {
        const {width, height} = this.networkDiagramStyle.frame
        const createSimulation = (simNodes, simLinks): d3.Simulation<NetworkSimulationNode, NetworkSimulationLink> => {
            return d3.forceSimulation<NetworkSimulationNode, NetworkSimulationLink>(simNodes)
                     .force("charge", d3.forceManyBody())
                     .force("link",
                            d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(simLinks)
                              .id((d) => d.vertex)
                              .distance((d) => {
                                  return 80
                              })
                     )
                     .force("center", d3.forceCenter(width / 2, height / 2))
        }

        this.simulation = createSimulation(this.simNodes, this.simLinks)
    }

    play(context: CanvasRenderingContext2D)
    {
        this.started = true
        this.context = context

        const {fontName, fontSize, nodeRadius, nodeColor, linkLength} = this.networkDiagramStyle
        const font = `${fontSize}px ${fontName}`
        this.simLinks.forEach((link) => {
            const {source, target} = link
            this.drawLink(source.x, source.y, target.x, target.y,
                          this.linkColor(source.vertex, target.vertex, d3.interpolateTurbo)
            )
        })

        this.context.strokeStyle = "#fff"
        for (const node of this.simNodes)
        {
            this.drawNodeShape(node.x, node.y)
            this.drawNodeText(node.x, node.y, node.vertex)
        }

        // todo: remove force! otherwise make it un interactive
        d3.select(context.canvas)
          .call(drag(this.simulation, true))
    }

    finish()
    {
        this.simulation.stop()
    }
}

export class TransformAnimation extends NetworkAnimation {

    simNodesToTransitionScales: Map<Vertex, PointTransitionScale>
    duration: number
    ticker: Ticker

    constructor(data: NetworkData, duration: number)
    {
        super(data);
        this.duration = duration;
        this.ticker = new Ticker(0);
    }

    prepare(): void
    {
        this.simNodesToTransitionScales = new Map<string, PointTransitionScale>()
        const {padding, matrixMargin} = this.matrixStyle
        const nodeRadius = this.networkDiagramStyle.nodeRadius
        const nodeDiameter = nodeRadius * 2

        this.simNodes.forEach((node) => {
            const {vertex, x, y} = node
            const nodeIndex = this.graph.vertices.indexOf(vertex)
            const destCenterX = padding + nodeDiameter + matrixMargin + nodeIndex * nodeDiameter + nodeRadius
            const destCenterY = padding + nodeDiameter + matrixMargin + nodeDiameter * nodeIndex + nodeRadius
            this.simNodesToTransitionScales.set(vertex, new PointTransitionScale(x, y, destCenterX, destCenterY, this.duration))
        })

        this.ticker.reset()
    }


    play = (context: CanvasRenderingContext2D): void => {
        this.context = context
        const {width, height} = this.networkDiagramStyle.frame
        const {fontName, fontSize, nodeRadius, nodeColor, linkLength} = this.networkDiagramStyle
        const font = `${fontSize}px ${fontName}`
        const currentTick = this.ticker.tick
        const edgesCount = this.simLinks.length

        this.simLinks.forEach((link, i) => {
            const {source, target} = link
            const sourcePointScaler = this.simNodesToTransitionScales.get(source.vertex)
            const targetPointScaler = this.simNodesToTransitionScales.get(target.vertex)
            const sourcePoint = sourcePointScaler.point(currentTick)
            const targetPoint = targetPointScaler.point(currentTick)
            const mid = midpoint(targetPoint, sourcePoint)
            const findCurrentControlPoint = (positiveDistance: boolean) => {
                const maxControlPoint = controlPointPosition(sourcePoint, targetPoint,
                                                             (positiveDistance ? 1 : -1) * distance(sourcePoint, targetPoint) / 2
                )
                const controlPointTransitionScaler =
                    new PointTransitionScale(mid.x, mid.y,
                                             maxControlPoint.x, maxControlPoint.y,
                                             this.duration
                    )
                return controlPointTransitionScaler.point(currentTick);
            }

            const currentControlPoint =
                findCurrentControlPoint(true)

            const radius =
                d3.scaleLinear()
                  .domain([0, this.duration])
                  .range([distance(mid, targetPoint) / distance(mid, currentControlPoint) * distance(targetPoint, currentControlPoint), 0])

            const linkColor = this.linkColor(source.vertex, target.vertex, d3.interpolateTurbo)

            arc(this.context, sourcePoint, currentControlPoint, targetPoint, radius(currentTick), linkColor)
            arc(this.context, sourcePoint, findCurrentControlPoint(false), targetPoint, radius(currentTick), linkColor)
        })

        this.moveNodes(this.simNodes, this.simNodesToTransitionScales, currentTick)

        if (currentTick < this.duration)
        {
            this.ticker.increment()
        }
    }

    finish(): void
    {
    }
}

export class GenerateLabels extends NetworkAnimation {
    private hLabelNodes: LightWeightNode[] = []
    private vLabelNodes: LightWeightNode[] = []
    private diagonalNodeMap: Map<Vertex, LightWeightNode> = new Map()
    private lightWeightLinks: LightWeightLink[] = []
    private hLabelToTransitionScales: Map<string, PointTransitionScale>
    private vLabelToTransitionScales: Map<string, PointTransitionScale>

    duration: number;
    ticker: Ticker;


    constructor(data: NetworkData, duration: number)
    {
        super(data);
        this.duration = duration;
        this.ticker = new Ticker(0)
    }

    prepare(): void
    {

        const {nodeRadius} = this.networkDiagramStyle
        const {matrixMargin, padding} = this.matrixStyle
        const nodeDiameter = nodeRadius * 2

        const diagonalNodePosition = (vertex): Point => {
            const nodeIndex = this.graph.vertices.indexOf(vertex)
            const diagonalX = padding + nodeDiameter + matrixMargin + nodeIndex * nodeDiameter + nodeRadius
            const diagonalY = padding + nodeDiameter + matrixMargin + nodeDiameter * nodeIndex + nodeRadius
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

        this.ticker.reset()
    }


    play(context: CanvasRenderingContext2D): void
    {
        this.context = context
        const time = this.ticker.tick

        this.simLinks.forEach((link) => {
            const source = link.source.vertex
            const target = link.target.vertex
            const sourceNode = this.diagonalNodeMap.get(source)
            const targetNode = this.diagonalNodeMap.get(target)
            const radius = 0
            const sourcePoint = sourceNode.point
            const targetPoint = targetNode.point
            const maxControlPoint = (positiveDistance: boolean) => {
                return controlPointPosition(sourcePoint, targetPoint,
                                            (positiveDistance ? 1 : -1) * distance(sourcePoint, targetPoint) / 2
                )
            }

            const linkColor = this.linkColor(source, target, d3.interpolateTurbo)
            arc(this.context, sourcePoint, maxControlPoint(true), targetPoint, radius, linkColor)
            arc(this.context, sourcePoint, maxControlPoint(false), targetPoint, radius, linkColor)
        })

        this.moveNodes(this.vLabelNodes, this.vLabelToTransitionScales, time)
        this.moveNodes(this.hLabelNodes, this.hLabelToTransitionScales, time)

        const {textColor, nodeColor, nodeStrokeColor} = this.networkDiagramStyle

        this.diagonalNodeMap.forEach((node) => {
            const {vertex, x, y} = node
            this.drawNode(x, y, vertex, 1.0, nodeColor, nodeStrokeColor, textColor)
        })

        if (time < this.duration)
        {
            this.ticker.increment()
        }
    }

    finish(): void
    {

    }
}



