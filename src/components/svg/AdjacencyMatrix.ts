import {
    DrawingInstruction,
    drawingInstructionToPositionedCell,
    Edge,
    UndirectedGraph
} from "../../utils/structures/UndirectedGraph";
import * as d3 from "d3";
import "../../styles/adjacency-matrix.sass"
import {CanvasRuler} from "../../utils/CanvasUtils";
import {Rect} from "../../utils/structures/Geometry";
import {SVGComponent} from "../../UI/SVGComponent";
import {Vertex} from "../../data/animations/network/GenerateLabels";
import {replaceUndefinedWithDefaultValues} from "../../utils/Utils";
import {ObjectSet} from "../../utils/structures/ObjectSet";
import {ormap} from "../../utils/FPUtils";
import {Highlight} from "../../data/Data";
import {CellPosition} from "./MatrixView";
import CellGroupHighlight = Highlight.CellGroupHighlight;
import AreaHighlight = Highlight.AreaHighlight;


export interface IndexedLabel {
    label: string
    index: number
}

export interface MatrixStyle {
    matrixFrame?: Rect
    fontName?: string
    spaceBetweenLabels?: number
    padding?: number
    cellStrokeColor?: string
    cellSizeToFontSize?: (number: number) => number
    hideLabel?: boolean
    toggleableCell?: boolean
    reorderable?: boolean
    fillColor?: string
    highlightColor?: string
    showLabelsOnHover?: boolean

    allowDiagonals?: boolean

    hoverLabelEffect?: AdjacencyMatrix.HoverLabelEffect
    hoverLabelCallback?: (label: string) => void
    leaveLabelCallback?: (label: string) => void

    hoverCellEffect?: AdjacencyMatrix.HoverCellEffect
    hoverCellCallback?: (di: DrawingInstruction) => void
    leaveCellCallback?: (di: DrawingInstruction) => void
}

export interface CellStyle {
    cursor: string
}

export class AdjacencyMatrix extends SVGComponent {

    static defaultStyle: MatrixStyle = {
        matrixFrame: {
            x: 100,
            y: 100,
            width: 500,
            height: 500
        },
        fontName: 'monospace',
        spaceBetweenLabels: 10,
        padding: 36,
        hideLabel: false,
        toggleableCell: true,
        highlightColor: '#fc6b94',
        cellStrokeColor: 'lightgray',
        allowDiagonals: true,
        reorderable: true,
        showLabelsOnHover: false,
        cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
    }

    static CELL_FILLED_FILL = 'black'
    static CELL_EMPTY_FILL = 'white'
    static CSS_CLASS_LABEL = 'adjacency-matrix-label'
    static CSS_CLASS_V_LABEL = 'vertical-label'
    static CSS_CLASS_H_LABEL = 'horizontal-label'
    static CSS_CLASS_CELL = 'cell'

    private cellSize: number
    private fontSize: number

    private _graph: UndirectedGraph;
    private style: MatrixStyle
    transitionTime: number;

    private _orderedLabels: string[]

    private _reorderable: boolean

    get orderedLabels(): string[]
    {
        return this._orderedLabels;
    }

    set orderedLabels(value: string[])
    {
        this._orderedLabels = value;
        this.joinHLabels(false)
        this.joinVLabels(false)
    }

    setOrderedLabels(value: string[], animated: boolean = true)
    {
        this._orderedLabels = value
        this.render(animated)
    }


    get reorderable(): boolean
    {
        return this._reorderable;
    }

    set reorderable(value: boolean)
    {
        this._reorderable = value;
        this.initializeView();
        this.render()
    }

    private vLabelGroup: any
    private hLabelGroup: any
    private cellsGroup: any

    private get allLabels()
    {
        return this.view.selectAll(`.${AdjacencyMatrix.CSS_CLASS_LABEL}`)
    }

    private get verticalLabels()
    {
        return this.vLabelGroup.selectAll(`.${AdjacencyMatrix.CSS_CLASS_V_LABEL}`)
    }

    private get horizontalLabels()
    {
        return this.hLabelGroup.selectAll(`.${AdjacencyMatrix.CSS_CLASS_H_LABEL}`)
    }

    private get cells(): d3.Selection<SVGRectElement, DrawingInstruction, any, any>
    {
        return this.cellsGroup.selectAll(`.${AdjacencyMatrix.CSS_CLASS_CELL}`)
    }

    private get isHLabelRotated(): boolean
    {
        const [longestLabelWidth, labelHeight] = this.findLongestLabelWidthAndLabelHeight()
        return longestLabelWidth >= this.cellSize
    }

    initializeStyleWithDefaultValues(matrixStyle)
    {
        const style: MatrixStyle = {}
        for (const matrixStyleKey in matrixStyle)
        {
            matrixStyle.hasOwnProperty()
            style[matrixStyleKey] = matrixStyle[matrixStyleKey]
        }
    }

    constructor(style: MatrixStyle = AdjacencyMatrix.defaultStyle,
                graph: UndirectedGraph = null,
                transitionTime = 400)
    {
        super(null, style.matrixFrame)
        this.style = replaceUndefinedWithDefaultValues(style, AdjacencyMatrix.defaultStyle)
        this._reorderable = this.style.reorderable
        this._graph = graph
        this.transitionTime = transitionTime
        if (this._graph !== null)
        {
            this._orderedLabels = this._graph.vertices
            this.initializeView();
            this.render()
        }
    }


    set graph(value: UndirectedGraph)
    {
        this._graph = value;
        if (value !== null)
        {
            this._orderedLabels = this._graph.vertices
            this.initializeView();
            this.render()
        }
    }

    private render = (animated: boolean = true) => {
        this.joinCells(animated)
        if (this.style.hideLabel === false)
        {
            this.joinHLabels(animated)
            this.joinVLabels(animated)
        }

        if (this.style.showLabelsOnHover)
        {
            const setLabelsOpacity = (opacity: number, duration: number = 200) => {
                const ease = d3.easeExpOut
                return () => {
                    this.hLabelGroup.transition().ease(ease).duration(duration).style('opacity', opacity)
                    this.vLabelGroup.transition().ease(ease).duration(duration).style('opacity', opacity)
                }
            }
            setLabelsOpacity(0, 0)()
            this.svg.on('mouseover', setLabelsOpacity(1))
                .on('mouseleave', setLabelsOpacity(0))
        }
    }

    private findLongestLabelWidthAndLabelHeight = (): [number, number] => {
        let longestLabelWidth = null
        let longestLabel = null
        let exampleLabelMetrics = CanvasRuler.getTextMetrics('A', this.style.fontName, this.fontSize)
        let labelHeight = exampleLabelMetrics.fontBoundingBoxAscent + exampleLabelMetrics.fontBoundingBoxDescent
        for (const label of this._orderedLabels)
        {
            let labelMetrics = CanvasRuler.getTextMetrics(label, this.style.fontName, this.fontSize)
            let labelWidth = labelMetrics.width
            if (longestLabelWidth === null || labelWidth > longestLabelWidth)
            {
                longestLabelWidth = labelWidth
                longestLabel = label
            }
        }
        // console.log(`longest label "${longestLabel}" width ${longestLabelWidth}, label height: ${labelHeight}`)
        return [longestLabelWidth, labelHeight]
    }

    private initializeView()
    {
        // region Calculate drawing frame constraints
        const {x, y, width, height} = this.style.matrixFrame

        console.log(`cell size: ${this.cellSize}px, font size: ${this.fontSize}`)

        const labelCount = this._orderedLabels.length
        const cellSize = (width - x) / labelCount
        const fontSize = this.style.cellSizeToFontSize(cellSize)
        this.cellSize = cellSize
        this.fontSize = fontSize
        // endregion

        this.svg.selectAll('g').remove() // remove all graph content first to make sure rerender works right

        //region Initialize vertical labels and setup their dragging actions
        // vertical labels' anchor is at the end of the text
        this.vLabelGroup = this.svg
                               .append('g')
                               .attr('transform',
                                     `translate(${this.style.matrixFrame.x - this.style.spaceBetweenLabels}, 
                  ${this.style.matrixFrame.y})`)
        //endregion

        // region Initialize horizontal labels and setup their dragging actions
        // horizontal labels' anchor is at the bottom of the text
        this.hLabelGroup = this.svg
                               .append('g')
                               .attr('transform',
                                     `translate(${this.style.matrixFrame.x},
                  ${this.style.matrixFrame.y - this.style.spaceBetweenLabels})`)
        //endregion

        // region Initialize cells
        this.cellsGroup = this.svg
                              .append('g')
                              .attr('transform',
                                    `translate(
                      ${this.style.matrixFrame.x}, 
                      ${this.style.matrixFrame.y})`)      // y
        // endregion
    }

    joinVLabels = (animated: boolean = true): void => {

        const hoverVLabelEffect = (effect: AdjacencyMatrix.HoverLabelEffect): ((event, label: string) => void) => {
            switch (effect)
            {
                case AdjacencyMatrix.HoverLabelEffect.HighlightSymmetric:
                    return (event, label: string) => {
                        this.cells.filter((di) =>
                                              di.position.rowLabel === label || di.position.columnLabel === label)
                            .raise()
                            .style('stroke', this.style.highlightColor)
                            .style('stroke-width', 3)

                        if (this.style.hoverCellCallback)
                        {
                            console.log(this.style.hoverCellCallback)
                            this.style.hoverLabelCallback(label)
                        }
                    }
                case AdjacencyMatrix.HoverLabelEffect.HighlightCellsByAxis:
                    return (event, label: string) => {
                        this.cells.filter((di) => di.position.rowLabel === label)
                            .raise()
                            .style('stroke', this.style.highlightColor)
                            .style('stroke-width', 3)

                        if (this.style.hoverCellCallback)
                        {
                            console.log(this.style.hoverCellCallback)
                            this.style.hoverLabelCallback(label)
                        }
                    }
                default:
                    return null
            }
        }

        this.vLabelGroup
            .selectAll(`.${AdjacencyMatrix.CSS_CLASS_V_LABEL}`)
            .data(this._orderedLabels, d => d)
            .join((enter) => {
                      const labels = enter.append('text')
                                          .attr('class', `${AdjacencyMatrix.CSS_CLASS_LABEL} vertical-label`)
                                          .attr('font-family', this.style.fontName)
                                          .text(label => label)
                                          .attr('alignment-baseline', 'middle')
                                          .style('text-anchor', 'end')
                                          .attr('x', 0)
                                          .attr('y', (d, i) => i * this.cellSize + this.cellSize / 2)
                                          .style('font-size', this.fontSize)
                                          .on('mouseover', hoverVLabelEffect(this.style.hoverLabelEffect))
                                          .on('mouseleave', this.restoreFromEffect(this.style.leaveLabelCallback))


                      labels
                          .style('cursor', this.reorderable ? 'ns-resize' : null)
                          .call(d3.drag()
                                  .on('drag', this.reorderable ? (event, label: string) => {

                                      console.log(`x: ${event.x}, y: ${event.y}`)
                                      // while dragging, detect whether matrix labels needs to be reordered
                                      // store it as insertion place
                                      let insertion = this.manualReorderLabels(label, event.y)
                                      if (insertion !== null)
                                      {
                                          // if matrix labels were reordered,
                                          // perform animation on the matrix visualization to reflect changes.
                                          let [labelToMove, targetIndex] = insertion
                                          this.moveRow(labelToMove, targetIndex)
                                      }

                                      // move the label and cell along with the current cursor position while dragging
                                      d3.selectAll(`.${AdjacencyMatrix.CSS_CLASS_LABEL}.${AdjacencyMatrix.CSS_CLASS_V_LABEL}`)
                                        .filter((d) => d === label)
                                        .raise()
                                        .attr('y', event.y)

                                      this.cells
                                          .filter((cellData: DrawingInstruction) => {
                                              return cellData.position.rowLabel === label
                                          })
                                          .raise()
                                          .attr('y', event.y - this.cellSize / 2)

                                  } : null)
                                  .on('end', this.reorderable ? ((event, label: string) => {
                                      // rerender when user finished dragging:
                                      this.render()
                                  }) : null))


                  }
                ,
                  update => update.call(update =>
                                            update
                                                .transition().duration(animated ? this.transitionTime : 0)
                                                .attr("y", (d, i) => i * this.cellSize + this.cellSize / 2))
            )
    }

    joinHLabels = (animated: boolean = true): void => {

        const hoverHLabelEffect = (effect: AdjacencyMatrix.HoverLabelEffect): ((event, label: string) => void) => {
            switch (effect)
            {
                case AdjacencyMatrix.HoverLabelEffect.HighlightSymmetric:
                    return (event, label: string) => {
                        this.cells.filter((di) =>
                                              di.position.rowLabel === label || di.position.columnLabel === label)
                            .raise()
                            .style('stroke', this.style.highlightColor)
                            .style('stroke-width', 3)

                        if (this.style.hoverCellCallback)
                        {
                            console.log(this.style.hoverCellCallback)
                            this.style.hoverLabelCallback(label)
                        }
                    }
                case AdjacencyMatrix.HoverLabelEffect.HighlightCellsByAxis:
                    return (event, label: string) => {
                        this.cells.filter((di) => di.position.columnLabel === label)
                            .raise()
                            .style('stroke', this.style.highlightColor)
                            .style('stroke-width', 3)

                        if (this.style.hoverCellCallback)
                        {
                            console.log(this.style.hoverCellCallback)
                            this.style.hoverLabelCallback(label)
                        }
                    }
                default:
                    return null
            }
        }


        this.horizontalLabels
            .data(this._orderedLabels, d => d)
            .join(
                enter => {
                    const labels = enter.append('text')
                                        .attr('transform', (d, i) => `rotate(${this.isHLabelRotated ? -90 : 0})`)
                                        .classed(`${AdjacencyMatrix.CSS_CLASS_LABEL} ${AdjacencyMatrix.CSS_CLASS_H_LABEL}`, true)
                                        .attr('x', (d, i) => {
                                            return this.isHLabelRotated ? 0 : i * this.cellSize + this.cellSize / 2
                                        })
                                        .attr('y', (d, i) => {
                                            return this.isHLabelRotated ? i * this.cellSize + this.cellSize / 2 : 0
                                        })
                                        .attr('font-family', this.style.fontName)
                                        .text(label => label)
                                        .style('text-anchor', this.isHLabelRotated ? 'start' : 'middle')
                                        .attr('alignment-baseline', this.isHLabelRotated ? 'middle' : 'text-bottom')
                                        .style('font-size', this.fontSize)
                                        .on('mouseover', hoverHLabelEffect(this.style.hoverLabelEffect))
                                        .on('mouseleave', this.restoreFromEffect(this.style.leaveLabelCallback))

                    labels
                        .style('cursor', this.reorderable ? 'ew-resize' : null)
                        .call(d3.drag()
                                .on('drag', this.reorderable ? (event, label: string) => {

                                    console.log(`x: ${event.x}, y: ${event.y}`)
                                    // while dragging, detect whether matrix labels needs to be reordered
                                    // store it as insertion place
                                    let insertion = this.manualReorderLabels(label, event.x)
                                    if (insertion !== null)
                                    {
                                        // if matrix labels were reordered,
                                        // perform animation on the matrix visualization to reflect changes.
                                        let [labelToMove, targetIndex] = insertion
                                        this.moveColumn(labelToMove, targetIndex)
                                    }

                                    // move the label and cell along with the current cursor position while dragging
                                    // todo highlight similar cells while dragging
                                    d3.selectAll(`.${AdjacencyMatrix.CSS_CLASS_LABEL}.${AdjacencyMatrix.CSS_CLASS_H_LABEL}`)
                                      .filter((d) => d === label)
                                      .raise()
                                      .attr(this.isHLabelRotated ? 'y' : 'x', event.x)

                                    this.cells
                                        .filter((cellData: DrawingInstruction, i) => {
                                            return cellData.position.columnLabel === label
                                        })
                                        .raise()
                                        .attr('x', event.x - this.cellSize / 2)


                                } : null)
                                .on('end', this.reorderable ? ((event, label: string) => {
                                    // rerender when user finished dragging
                                    this.render()
                                }) : null))

                }
                ,
                update =>
                    update.call(update =>
                                    update
                                        .transition().duration(animated ? this.transitionTime : 0)
                                        .attr(this.isHLabelRotated ? 'y' : 'x', (d, i) => i * this.cellSize + this.cellSize / 2))
            )
    }

    joinCells = (animated: boolean = true): void => {

        const hoverCellEffect = (effect: AdjacencyMatrix.HoverCellEffect): ((event, di: DrawingInstruction) => void) => {
            switch (effect)
            {
                case AdjacencyMatrix.HoverCellEffect.HighlightRelated:
                    return (event, targetData: DrawingInstruction) => {
                        const {rowLabel, columnLabel} = targetData.position
                        this.cells.filter((di) =>
                                              di.position.rowLabel === rowLabel || di.position.columnLabel === columnLabel)
                            .raise()
                            .style('stroke', this.style.highlightColor)
                            .style('stroke-width', 3)

                        if (this.style.hoverCellCallback)
                        {
                            console.log('hoverCellCallback:')
                            console.log(this.style.hoverCellCallback)
                            this.style.hoverCellCallback(targetData)
                        }
                    }
                case AdjacencyMatrix.HoverCellEffect.HighlightSelf:
                    return (event, targetData: DrawingInstruction) => {
                        d3.select(event.currentTarget)
                          .raise()
                          .style('stroke', this.style.highlightColor)
                          .style('stroke-width', 3)

                        if (this.style.hoverCellCallback)
                        {
                            console.log('hoverCellCallback:')
                            console.log(this.style.hoverCellCallback)
                            this.style.hoverCellCallback(targetData)
                        }
                    }
                case AdjacencyMatrix.HoverCellEffect.HighlightSymmetric:
                    return (event, targetData: DrawingInstruction) => {
                        this.cells.filter((di) => {
                            const {rowLabel, columnLabel} = di.position
                            const targetPosition = targetData.position
                            return (targetPosition.rowLabel === rowLabel && targetPosition.columnLabel === columnLabel) ||
                                (targetPosition.rowLabel === columnLabel && targetPosition.columnLabel === rowLabel)
                        })
                            .raise()
                            .style('stroke', this.style.highlightColor)
                            .style('stroke-width', 3)

                        if (this.style.hoverCellCallback)
                        {
                            this.style.hoverCellCallback(targetData)
                        }
                    }
                default:
                    return null
            }
        }

        const restore = (event, targetData: DrawingInstruction) => {
            const effect = this.style.hoverCellEffect
            if (effect === AdjacencyMatrix.HoverCellEffect.None ||
                effect === null || effect === undefined)
            {
                return null
            }
            else
            {
                this.cells
                    .style('stroke', this.style.cellStrokeColor)
                    .style('stroke-width', '1px')
                if (this.style.leaveCellCallback)
                {
                    this.style.leaveCellCallback(targetData)
                }
            }
        }

        this.cells.data(this._graph.toDrawingInstructionArray(this._orderedLabels), (d: DrawingInstruction) => {
            const pos = d.position
            return `${pos.rowLabel}, ${pos.columnLabel}`
        }).join(
            enter => enter.append('rect')
                          .attr('class', 'cell')
                          .attr('width', this.cellSize)
                          .attr('height', this.cellSize)
                          .attr('y', (d: DrawingInstruction) =>
                              this.findLabelIndex(d.position.rowLabel) * this.cellSize)
                          .attr('x', (d: DrawingInstruction) =>
                              this.findLabelIndex(d.position.columnLabel) * this.cellSize)
                          .style('fill', (d: DrawingInstruction) => {
                              const {rowLabel, columnLabel} = d.position
                              return d.filling !== false ?
                                  AdjacencyMatrix.CELL_FILLED_FILL : AdjacencyMatrix.CELL_EMPTY_FILL
                          })
                          .style('cursor', d => {
                              return this.style.toggleableCell ? (d.position.columnLabel === d.position.rowLabel ? (this.style.allowDiagonals ? 'pointer' : 'default') : 'pointer') : 'default'
                          })
                          .style('stroke', this.style.cellStrokeColor)
                          .style('stroke-width', "1px")
                          .on('click', this.style.toggleableCell ?
                              (event, targetData: DrawingInstruction) => {

                              if (targetData.position.rowLabel === targetData.position.columnLabel)
                              {
                                  if (!this.style.allowDiagonals)
                                  {
                                      return null
                                  }
                              }

                              let v1 = targetData.position.rowLabel
                              let v2 = targetData.position.columnLabel
                              if (targetData.filling === false)
                              {
                                  this._graph.addEdge(new Edge(v1, v2, null))
                              }
                              else
                              {
                                  this._graph.removeEdge(new Edge(v1, v2, null))
                              }
                              this.render()
                          } : null)
                          .on('mouseover', hoverCellEffect(this.style.hoverCellEffect))
                          .on('mouseleave', restore)
            ,
            update => update.call(update => update.raise()
                                                  .transition()
                                                  .duration(animated ? this.transitionTime : 0)
                                                  .attr('y', (d: DrawingInstruction) =>
                                                      this.findLabelIndex(d.position.rowLabel) * this.cellSize)
                                                  .attr('x', (d: DrawingInstruction) =>
                                                      this.findLabelIndex(d.position.columnLabel) * this.cellSize)
                                                  .attr('stroke', this.style.cellStrokeColor)
                                                  .style('fill',
                                                         (d: DrawingInstruction) => d.filling !== false ?
                                                             AdjacencyMatrix.CELL_FILLED_FILL : AdjacencyMatrix.CELL_EMPTY_FILL))
        )
    }

    swapLabel = (labelA: string, labelB: string): void => {
        let indexA, indexB: number = null
        for (let index = 0; index < this._orderedLabels.length; index++)
        {
            switch (this._orderedLabels[index])
            {
                case labelA:
                    indexA = index
                    break;
                case labelB:
                    indexB = index
                    break;
                default:
                    break;
            }
        }
        this._orderedLabels[indexA] = labelB
        this._orderedLabels[indexB] = labelA

        this.render()
    }

    highlightCell = (rowLabel: string, colLabel: string) => {
        this.cells.filter((di) =>
                              di.position.rowLabel === rowLabel && di.position.columnLabel === colLabel)
            .raise()
            .style('stroke', this.style.highlightColor)
            .style('stroke-width', 2)
    }

    highlightLabel(label: string, animated: boolean = false, color: string = this.style.highlightColor)
    {
        this.allLabels
            .filter((l) => {
                return l === label
            })
            .transition()
            .duration(animated ? this.transitionTime : 0)
            .style('fill', color)
            .style('font-weight', 700)
    }

    highlightAllRelationshipOfNode(node: Vertex, includeLabel: boolean = true, animated: boolean = false)
    {
        this.cells.filter((di) =>
                              di.position.rowLabel === node || di.position.columnLabel === node)
            .raise()
            .transition()
            .duration(animated ? this.transitionTime : 0)
            .style('stroke-width', '2px')
            .style('stroke', this.style.highlightColor)

        if (includeLabel)
        {
            this.allLabels
                .filter((label) => {
                    return label === node
                })
                .transition()
                .duration(animated ? this.transitionTime : 0)
                .style('fill', this.style.highlightColor)
                .style('font-weight', 700)
        }
    }

    highlightRelationship(v0: Vertex, v1: Vertex, includeLabel: boolean = true)
    {
        this.cells.filter(({position, filling}) =>
                              (position.rowLabel === v0 && position.columnLabel === v1) ||
                              (position.rowLabel === v1 && position.columnLabel === v0))
            .raise()
            .style('stroke', this.style.highlightColor)
            .style('stroke-width', 2)

        if (includeLabel)
        {
            // this.allLabels
            //     .filter((label) => {
            //         return label === v0 || label === v1
            //     })
            //     .style('fill', this.style.highlightColor)
            //     .style('font-weight', 700)

            const tone1 = '#01a068'
            const tone2 = '#fdb538'

            this.verticalLabels.filter((label) => {
                return label === v0
            })
                .style('fill', tone1)
                .style('font-weight', 700)

            this.horizontalLabels.filter((label) => {
                return label === v1
            })
                .style('fill', tone1)
                .style('font-weight', 700)

            this.verticalLabels.filter((label) => {
                return label === v1
            })
                .style('fill', tone2)
                .style('font-weight', 700)

            this.horizontalLabels.filter((label) => {
                return label === v0
            })
                .style('fill', tone2)
                .style('font-weight', 700)
        }
    }

    restoreFromEffect = (callback = null) => {
        const style = this.style.hoverLabelEffect
        if (style === AdjacencyMatrix.HoverLabelEffect.None || style === undefined || style === null)
        {
            return null
        }
        else
        {
            return () => {
                this.cells
                    .style('stroke', this.style.cellStrokeColor)
                    .style('stroke-width', '1px')

                this.allLabels
                    .style('fill', 'black')
                    .style('font-weight', 300)

                if (callback !== null)
                {
                    callback()
                }
            }
        }

    }

    private findLabelIndex = (label: string): number => {
        return this._orderedLabels.findIndex(v => v === label)
    }

    /**
     * Calculates the similarity between relationships of `labelA` and `labelB`.
     * @param labelA the first label to be compared.
     * @param labelB the other label to be compared against.
     * @returns an array whose [x] refers to a boolean that
     *          tells whether the given two labels have the same relationship to ordersLabels[x]
     */
    private similarSet = (labelA: string, labelB: string): Set<string> => {
        const labelCount = this._orderedLabels.length
        let labelARow = Array<boolean | number>(labelCount)
        let labelBRow = Array<boolean | number>(labelCount)
        let similaritySet = new Set<string>()
        this._orderedLabels.forEach((label) => {
            if ((this._graph.isConnected(label, labelA) != false)
                && (this._graph.isConnected(label, labelB) != false))
            {
                similaritySet.add(label)
            }
        })

        return similaritySet;
    }

    isSimilar(onLabel: Vertex, labelA: Vertex, labelB: Vertex): boolean
    {
        const isLabelAConnected = this._graph.isConnected(onLabel, labelA)
        const isLabelBConnected = this._graph.isConnected(onLabel, labelB)
        return ((isLabelAConnected != false) && (isLabelBConnected != false)) || (isLabelAConnected === isLabelBConnected)
    }

    private similarity = (labelA: string, labelB: string): number => {
        let similarityCount = 0
        this._orderedLabels.forEach((label) => {
            if (this.isSimilar(label, labelA, labelB))
            {
                similarityCount = similarityCount + 1
            }
        })
        return similarityCount / this._orderedLabels.length
    }

    private similarityMap = (label: string): Map<Vertex, number> => {
        const map = new Map<string, number>()
        this._orderedLabels.forEach((otherLabel) => {
            map.set(otherLabel, this.similarity(label, otherLabel))
        })
        return map
    }

    /**
     * Find the previous label of the given label in the `orderedLabels`
     * @returns the previous label or `null` if no previous label found.
     */
    previousLabel = (label: string): string => {
        for (let i = 1; i < this._orderedLabels.length; i++)
        {
            if (this._orderedLabels[i] === label)
            {
                return this._orderedLabels[i - 1]
            }
        }
        return null;
    }

    /**
     * Find the next label of the given label in the `orderedLabels`
     * @returns the next label or `null` if no next label found.
     */
    nextLabel = (label: string): string => {
        for (let i = 1; i < this._orderedLabels.length; i++)
        {
            if (this._orderedLabels[i - 1] === label)
            {
                return this._orderedLabels[i]
            }
        }
        return null;
    }


    changeShape()
    {
        // .append('circle')
        // .attr('class', 'cell')
        // .attr('cx', d => d.position.column * CELL_SIZE + CELL_SIZE / 2)
        // .attr('cy', d => d.position.row * CELL_SIZE + CELL_SIZE / 2)
        // .attr('r', CELL_SIZE / 2)
        // .style('fill', d => d.filling !== false ? CELL_FILLED_FILL : CELL_EMPTY_FILL)
        // .style('stroke-width', "1px")
        // swapColumns(3, 5)
    }

    addInteraction()
    {
        //         d3.selectAll('.adjacency-matrix-label')
//           .on('mouseover', highlightCells(sharesTheSameColumnOrRowWithLabel))
//
//         function sharesTheSameColumnOrRowWithLabel(labelData, drawingInstructionData)
//         {
//             return labelData.index === drawingInstructionData.position.row
//                 || labelData.index === drawingInstructionData.position.column
//         }
//
// //     d3.selectAll('rect.cell').on('mousedown', highlight)
//         function isSameColumnOrRow(a: DrawingInstruction, b: DrawingInstruction)
//         {
//             let cellPosition = b.position
//             let targetCellPosition = a.position
//             return (cellPosition.row == targetCellPosition.row ||
//                 cellPosition.column == targetCellPosition.column)
//         }
//
//         d3.selectAll('rect.cell').on('mouseover', highlightCells(isSameColumnOrRow))
//         d3.selectAll('rect.cell').on('touchstart', highlightCells)
//
//         d3.selectAll('rect.cell').on('mouseup', restore)
//         d3.selectAll('rect.cell').on('mouseleave', restore)
//         d3.selectAll('rect.cell').on('touchcancel', restore)
//         d3.selectAll('rect.cell').on('touchend', restore)
//
//
//         const DEFAULT_GRID_COLOR = 'darkgrey'
//         const DEFAULT_GRID_STROKE_WIDTH_PX = 1
//         const HIGHLIGHT_GRID_COLOR = 'red'
//         const HIGHLIGHT_GRID_STROKE_WIDTH_PX = 3
//
//         function restore()
//         {
//             d3.selectAll('rect.cell')
//               .style('stroke', DEFAULT_GRID_COLOR)
//               .style('stroke-width', `${DEFAULT_GRID_STROKE_WIDTH_PX}px`)
//         }
//
//         function highlightCells(filter: (eventTargetData, targetData) => boolean)
//         {
//             return (event, eventTargetData) => {
//                 restore()
//                 d3.selectAll('.cell').filter((cellData: DrawingInstruction) => {
//                     return filter(eventTargetData, cellData)
//                 }).raise()
//                   .style('stroke', HIGHLIGHT_GRID_COLOR)
//                   .style('stroke-width', `${HIGHLIGHT_GRID_STROKE_WIDTH_PX}`)
//             }
//         }
    }

    highlightCells = (highlight: CellGroupHighlight) => {
        const cellsSet = new ObjectSet(CellPosition.group(...highlight.cells))

        const cells = this.cells
                          .filter((di) => {
                              return cellsSet.has(drawingInstructionToPositionedCell(di, this._orderedLabels).position)
                          })

        console.log(cells)

        this.breathAnimation(cells, highlight.color)
    }

    highlightRectAreas = (highlight: AreaHighlight) => {
        let predicates: ((di: DrawingInstruction) => boolean)[] = []
        for (const area of highlight.areas)
        {
            const [[startRow, startCol], [endRow, endCol]] = area
            const isInArea = (di: DrawingInstruction) => {
                const {row, col} = drawingInstructionToPositionedCell(di, this._orderedLabels).position

                const isException = ormap((exceptionCell) =>
                                              exceptionCell[0] === row && exceptionCell[1] === col,
                                          highlight.exceptions)
                if (isException)
                {
                    return false
                }
                else
                {
                    let isHighlight = row >= startRow && row <= endRow &&
                        col >= startCol && col <= endCol

                    isHighlight = highlight.highlightFilledOnly ?
                        isHighlight && (di.filling !== false) : isHighlight
                    return isHighlight
                }
            }
            if (highlight.union)
            {
                predicates.push(isInArea)
            }
            else
            {
                const cells = this.cells
                                  .filter((di) => isInArea(di))
                this.breathAnimation(cells,
                                     highlight.color,
                                     highlight.isOneByOne,
                                     highlight.isReverse,
                                     highlight.duration,
                                     highlight.delay)
            }
        }

        if (highlight.union)
        {
            const cells = this.svg
                              .selectAll<SVGRectElement, DrawingInstruction>('.cell')
                              .filter((di) => {
                                  return ormap((predicate) => predicate(di), predicates)
                              })

            this.breathAnimation(cells,
                                 highlight.color,
                                 highlight.isOneByOne,
                                 highlight.isReverse,
                                 highlight.duration,
                                 highlight.delay)
        }
    }

    breathAnimation = (cells: d3.Selection<SVGRectElement, DrawingInstruction, any, any>,
                       color: string,
                       oneByOne: boolean = false,
                       reverse = false,
                       duration: number = 500,
                       delay: number = 50) => {
        const filled = "black"    //this.style.fillColor
        const unfilled = "white"
        cells
            .transition()
            .ease(d3.easeQuadOut)
            .duration(duration)
            .delay((d, i, g) =>
                       oneByOne ? (reverse ? (g.length - i) * delay : i * delay) : 0
            )
            .style('fill', color)
            .transition()
            .ease(d3.easeQuadIn)
            .duration(duration)
            .delay((d, i, g) =>
                       oneByOne ? (reverse ? (g.length - i * delay) : i * delay) : 0
            )
            .style('fill', (di) => di.filling === false ? unfilled : filled)
            .end()
            .then(() => {
                this.breathAnimation(cells, color, oneByOne, reverse, duration, delay)
            })
            .catch((e) => {
                console.error(e)
            })
    }

    /**
     * Reorder the matrix label according the current dragging position.
     * @param draggingLabel the label that is currently being dragged
     * @param cursorPosition current cursor position. If the label is vertical, use y of cursor position,
     *                       otherwise use x of cursor position.
     * @returns `null` if there is no reorder occur.
     *          Otherwise returns a tuple which `[0]` is the content of the row / column being swapped,
     *          while `[1]` refers to its new index (after swap).
     * @private
     */
    private manualReorderLabels = (draggingLabel: string, cursorPosition: number): [string, number] => {
        let index = this.findLabelIndex(draggingLabel)
        let originPosition = index * this.cellSize + this.cellSize / 2
        let moveDistance = cursorPosition - originPosition // pos+/neg-: move towards end/start
        let endIndex = this._orderedLabels.length - 1
        // console.log(`index: ${index}, move distance: ${moveDistance}`)
        if (index === 0)
        { // start, can only move down
            if (moveDistance >= this.cellSize)
            {
                this._orderedLabels[0] = this._orderedLabels[1]
                this._orderedLabels[1] = draggingLabel
                return [this._orderedLabels[0], 0]
            }
            else
            {
                return null
            }
        }
        else if (index === endIndex)
        { // end, can only move up
            if (-moveDistance >= this.cellSize)
            {
                this._orderedLabels[endIndex] = this._orderedLabels[endIndex - 1]
                this._orderedLabels[endIndex - 1] = draggingLabel
                return [this._orderedLabels[endIndex], endIndex]
            }
            else
            {
                return null
            }
        }
        else
        { // middle, can move both up and down
            if (-moveDistance >= this.cellSize)
            {
                let lastIndex = index - 1
                this._orderedLabels[index] = this._orderedLabels[lastIndex]
                this._orderedLabels[lastIndex] = draggingLabel
                return [this._orderedLabels[index], index]
            }
            else if (moveDistance >= this.cellSize) // next element go up
            {
                let nextIndex = index + 1
                this._orderedLabels[index] = this._orderedLabels[nextIndex]
                this._orderedLabels[nextIndex] = draggingLabel
                return [this._orderedLabels[index], index]
            }
            else
            {
                return null
            }
        }
    }

    private moveRow = (label: string, targetIndex: number) => {
        // no need to raise
        this.verticalLabels.filter((d) => d === label)
            .raise()
            .transition()
            .duration(this.transitionTime)
            .attr('y', targetIndex * this.cellSize + this.cellSize / 2)

        this.cells
            .raise()
            .filter((cellData: DrawingInstruction, i) => {
                return cellData.position.rowLabel === label
            })
            .transition().duration(this.transitionTime)
            .attr('y', targetIndex * this.cellSize)
    }

    private moveColumn = (label: string, targetIndex: number) => {
        // no need to raise
        this.horizontalLabels
            .raise()
            .filter((d) => d === label)
            .transition().duration(this.transitionTime)
            .attr(this.isHLabelRotated ? 'y' : 'x', targetIndex * this.cellSize + this.cellSize / 2)

        this.cells
            .raise()
            .filter((cellData: DrawingInstruction, i) => {
                return cellData.position.columnLabel === label
            })
            .transition().duration(this.transitionTime)
            .attr('x', targetIndex * this.cellSize)
    }

    // automatically reorder labels
    autoReorderLabels(animated: boolean = true)
    {
        this.setOrderedLabels(UndirectedGraph.reorderedLabels(this._orderedLabels, this._graph), animated)
    }

    stopAnimation()
    {
        this.cells.interrupt()
        this.render()
    }


}

function calculateSwap(source: string[], target: string[], separator: string = "<=>")
{
    console.log('source: ' + source)
    console.log('target: ' + target)
    let swapSet = new Set<string>()
    let swappedLabels = new Set<string>()
    source.forEach((label) => {
        let targetLabel = source[target.indexOf(label)]
        let swap = `${label}${separator}${targetLabel}`
        if (!(swappedLabels.has(label) || swappedLabels.has(targetLabel)))
        {
            swapSet.add(swap)
            swappedLabels.add(label)
            // swappedLabels.add(targetLabel)
        }

        // if (!(swapSet.has(swap) || swapSet.has(`${targetLabel}${separator}${label}`)))
        // {
        //     swapSet.add(swap)
        // }
    })

    // source.forEach((label, i) => {
    //     let targetLabel = target[i]
    //     let swap = `${label}${separator}${targetLabel}`
    //     if (!(swapSet.has(swap) || swapSet.has(`${targetLabel}${separator}${label}`))) {
    //         swapSet.add(swap)
    //     }
    // })
    console.log(swapSet)
    return swapSet
}

export namespace AdjacencyMatrix {
    export enum HoverCellEffect {
        HighlightRelated,
        HighlightSymmetric,
        HighlightSelf,
        None
    }

    export enum HoverLabelEffect {
        HighlightCellsByAxis,
        HighlightSymmetric,
        None
    }
}
