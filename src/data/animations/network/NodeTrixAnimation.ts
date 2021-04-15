import {Vertex} from "./GenerateLabels";
import {PointTransitionScale, Ticker} from "../../../utils/CanvasUtils";
import * as d3 from "d3";
import {controlPointPosition, distance} from "../../../utils/structures/Geometry";
import {NetworkAnimation} from "./NetworkAnimation";
import {NetworkData} from "./NetworkAnimationData";

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
        if (this.sharedData.layoutRequired)
        {
            // this.sharedData.nodeSnapshot = this.simulation.simNodes.map((n) => Object.assign({}, n))
            this.simulation.layout(this.sharedData.nodeSnapshot.map((n) => Object.assign({}, n)))
        } else {
            this.sharedData.nodeSnapshot = this.simulation.simNodes.map((n) => Object.assign({}, n))
        }
        this.sharedData.layoutRequired = true
        console.log('layout now required: ' + this.sharedData.layoutRequired)

        this.simNodesToTransitionScales = new Map<string, PointTransitionScale>()
        const {padding, spaceBetweenLabels} = this.matrixStyle
        const nodeRadius = this.networkDiagramStyle.nodeRadius
        const nodeDiameter = nodeRadius * 2
        const [offsetX, offsetY] = this.centerOffset

        this.simulation.simNodes.forEach((node) => {
            const {vertex, x, y} = node
            const nodeIndex = this.graph.vertices.indexOf(vertex)
            const destCenterX = offsetX + padding + nodeDiameter + spaceBetweenLabels + nodeIndex * nodeDiameter + nodeRadius
            const destCenterY = offsetY + padding + nodeDiameter + spaceBetweenLabels + nodeIndex * nodeDiameter + nodeRadius
            this.simNodesToTransitionScales.set(vertex, new PointTransitionScale(x, y, destCenterX, destCenterY, this.duration))
        })
        this.ticker.reset()
    }


    play = (context: CanvasRenderingContext2D): void => {
        this.context = context
        const {width, height} = this.networkDiagramStyle.frame
        const {fontName, fontSize, nodeRadius, nodeColor, linkWidth} = this.networkDiagramStyle
        const font = `${fontSize}px ${fontName}`
        const currentTick = this.ticker.tick
        const edgesCount = this.simulation.simLinks.length

        const nodeTrixTick = currentTick
        this.simulation.simLinks.forEach((link, i) => {
            const {source, target} = link
            const sourcePointScaler = this.simNodesToTransitionScales.get(source.vertex)
            const targetPointScaler = this.simNodesToTransitionScales.get(target.vertex)
            const sourcePoint = sourcePointScaler.point(nodeTrixTick)
            const targetPoint = targetPointScaler.point(nodeTrixTick)
            const linkColor = this.linkColor(source.vertex, target.vertex, d3.interpolateTurbo)

            this.drawArc(sourcePoint, targetPoint,
                         (source, mid, target) => (positiveDistance: boolean) => {
                             const maxControlPoint = controlPointPosition(source, target,
                                                                          (positiveDistance ? 1 : -1) * distance(source, target) / 2)
                             const controlPointTransitionScaler =
                                 new PointTransitionScale(mid.x, mid.y,
                                                          maxControlPoint.x, maxControlPoint.y,
                                                          this.duration)
                             return controlPointTransitionScaler.point(nodeTrixTick);
                         },
                         (sourcePoint, mid, targetPoint, currentControlPoint) => {
                             let radiusFinder = d3.scaleLinear()
                                                  .domain([0, this.duration])
                                                  .range([distance(mid, targetPoint) / distance(mid, currentControlPoint) * distance(targetPoint, currentControlPoint), 0])
                             return radiusFinder(nodeTrixTick)
                         },
                         linkColor);
        })


        this.moveNodes(this.simulation.simNodes, this.simNodesToTransitionScales, currentTick)
    }

    finish(): void
    {
    }
}