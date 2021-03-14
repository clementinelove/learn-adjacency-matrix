import {Vertex} from "./GenerateLabels";
import {PointTransitionScale, Ticker} from "../CanvasUtils";
import * as d3 from "d3";
import {controlPointPosition, distance} from "../Geometry";
import {NetworkAnimation, NetworkData} from "../NodeLinkCanvasAnimation";

export class NodeTrixAnimation extends NetworkAnimation {

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
            const linkColor = this.linkColor(source.vertex, target.vertex, d3.interpolateTurbo)

            this.drawArc(sourcePoint, targetPoint,
                         (source, mid, target) => (positiveDistance: boolean) => {
                             const maxControlPoint = controlPointPosition(source, target,
                                                                          (positiveDistance ? 1 : -1) * distance(source, target) / 2)
                             const controlPointTransitionScaler =
                                 new PointTransitionScale(mid.x, mid.y,
                                                          maxControlPoint.x, maxControlPoint.y,
                                                          this.duration)
                             return controlPointTransitionScaler.point(currentTick);
                         },
                         (sourcePoint, mid, targetPoint, currentControlPoint) => {
                             let radiusFinder = d3.scaleLinear()
                                                  .domain([0, this.duration])
                                                  .range([distance(mid, targetPoint) / distance(mid, currentControlPoint) * distance(targetPoint, currentControlPoint), 0])
                             return radiusFinder(currentTick)
                         },
                         linkColor);
        })

        this.moveNodes(this.simNodes, this.simNodesToTransitionScales, currentTick)
    }

    finish(): void
    {
    }
}