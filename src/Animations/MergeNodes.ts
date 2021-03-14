import {DrawingInstruction} from "../UndirectedGraph";
import {controlPointPosition, distance, Point} from "../Geometry";
import * as d3 from "d3";
import {NetworkAnimation} from "../NodeLinkCanvasAnimation";
import {Vertex} from "./GenerateLabels";
import {animationScale, timelineSlices} from "./AnimationUtils";

export class MergeNodes extends NetworkAnimation {

    VX_HY: number
    diagNodeMap: Map<Vertex, Point>
    drawingInstructions: DrawingInstruction[]
    private filledCellSizeScale: (t) => number
    private filledCellRoundedPercentageScale: (t) => number
    private emptyCellSizeScale: (t) => number
    private diagonalNodeTextTransparencyScale: (tick) => number;
    private diagonalNodeRoundedPercentageScale: (tick) => number;
    private emptyCellRoundedPercentageScale: (tick) => number;
    private diagonalBorderColorScale: (tick) => string;
    private labelStrokeColorScale: (tick) => any;
    private filledCellColorScale: (startColor) => (tick) => any;

    constructor(data, duration)
    {
        super(data, duration);
        this.diagNodeMap = new Map()
    }

    prepare(): void
    {
        const {nodeRadius, nodeStrokeColor} = this.networkDiagramStyle
        const {padding, matrixMargin, cellStrokeColor} = this.matrixStyle
        const nodeDiameter = nodeRadius * 2
        this.VX_HY = padding + nodeRadius
        this.graph.vertices.forEach((v, i) => {
            const nodePosition = this.getNodePositionInMatrix(i)
            this.diagNodeMap.set(v, new Point(nodePosition, nodePosition))
        })
        this.drawingInstructions = this.graph.toDrawingInstructionArray(this.graph.vertices)

        const duration = this.duration
        const [diagonals, filledCells, emptyCells] = timelineSlices([0.3, 0.7])
        console.log(timelineSlices([0.3, 0.4]))

        this.diagonalNodeTextTransparencyScale = animationScale(diagonals, duration, [1, 0])
        this.diagonalNodeRoundedPercentageScale = animationScale(diagonals, duration, [1, 0])
        this.diagonalBorderColorScale = animationScale(diagonals, duration, [nodeStrokeColor, cellStrokeColor])
        this.labelStrokeColorScale = animationScale(diagonals, duration, [nodeStrokeColor, 'white'])

        this.filledCellSizeScale = animationScale(filledCells, duration, [0, nodeDiameter], d3.easeBackOut.overshoot(3.0))
        this.filledCellRoundedPercentageScale = animationScale(filledCells, duration, [1, 0])

        this.filledCellColorScale = (startColor) => {
            return animationScale(filledCells, duration, [startColor, 'black'], d3.easeExpOut)
        }

        this.emptyCellSizeScale = animationScale(emptyCells, duration, [0, nodeDiameter], d3.easeExpOut)
        this.emptyCellRoundedPercentageScale = animationScale(emptyCells, duration, [1, 0])
        this.ticker.reset()
    }

    play(context: CanvasRenderingContext2D): void
    {
        const {nodeRadius} = this.networkDiagramStyle
        const nodeDiameter = nodeRadius * 2
        this.context = context


        const isDiagonal = (x, y): boolean => {
            return x === y
        }

        // draw links
        this.simLinks.forEach((link) => {
            const source = link.source.vertex
            const target = link.target.vertex
            const radius = 0
            const sourcePoint = this.diagNodeMap.get(source)
            const targetPoint = this.diagNodeMap.get(target)
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

        // draw nodes
        for (const [v, position] of this.diagNodeMap.entries())
        {
            const {nodeColor, nodeStrokeColor, textColor, linkColor} = this.networkDiagramStyle
            // diagonal nodes
            this.drawNode(position.x, position.y, v, 1, nodeColor, nodeStrokeColor, textColor)
            // h labels
            this.drawNode(position.x, this.VX_HY, v, 1, nodeColor, this.labelStrokeColorScale(this.currentTick), textColor)
            // v labels
            this.drawNode(this.VX_HY, position.y, v, 1, nodeColor, this.labelStrokeColorScale(this.currentTick), textColor)
        }

        // draw links and cells
        this.drawingInstructions.forEach(({position, filling}) => {
            const {rowLabel, columnLabel} = position
            const rowIndex = this.graph.vertices.indexOf(rowLabel)
            const columnIndex = this.graph.vertices.indexOf(columnLabel)
            const [x, y] = [this.getNodePositionInMatrix(columnIndex), this.getNodePositionInMatrix(rowIndex)]

            if (isDiagonal(x, y))
            {
                this.drawNodeShape(x, y, this.diagonalNodeRoundedPercentageScale(this.currentTick), 1,
                                   (filling !== false ? 'black' : 'white'),
                                   this.diagonalBorderColorScale(this.currentTick))
                this.drawNodeText(x, y, rowLabel, this.diagonalNodeTextTransparencyScale(this.currentTick))
            }
            else if (filling !== false)
            {
                this.drawCell(x, y,
                              this.filledCellColorScale(this.linkColor(columnLabel, rowLabel, d3.interpolateTurbo))(this.currentTick),
                              this.filledCellSizeScale(this.currentTick),
                              this.filledCellRoundedPercentageScale(this.currentTick))
            }
            else
            {
                this.drawCell(x, y, 'white',
                              this.emptyCellSizeScale(this.currentTick),
                              this.filledCellRoundedPercentageScale(this.currentTick))
            }
        })
    }

    finish(): void
    {
    }


}