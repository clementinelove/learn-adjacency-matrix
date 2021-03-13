import {DrawingInstruction, Edge, UndirectedGraph} from "./UndirectedGraph";
import * as d3 from "d3";
import "./styles/adjacency-matrix.sass"
import {CanvasRuler} from "./CanvasUtils";
import {Rect} from "./Geometry";

export interface IndexedLabel {
    label: string
    index: number
}

export interface MatrixStyle {
    frame?: Rect
    fontName?: string
    matrixMargin?: number
    padding?: number
    cellSizeToFontSize?: (number) => number
}


export class AdjacencyMatrix {

    static CELL_FILLED_FILL = 'black'
    static CELL_EMPTY_FILL = 'white'
    static CSS_CLASS_LABEL = 'adjacency-matrix-label'
    static CSS_CLASS_V_LABEL = 'vertical-label'
    static CSS_CLASS_H_LABEL = 'horizontal-label'
    static CSS_CLASS_CELL = 'cell'

    private cellSize: number
    private fontSize: number

    private graph: UndirectedGraph;
    private style: MatrixStyle
    private transitionTime: number;

    private orderedLabels: string[]

    private vLabelGroup: any
    private hLabelGroup: any
    private cellsGroup: any

    private get verticalLabels()
    {
        return this.vLabelGroup.selectAll(`.${AdjacencyMatrix.CSS_CLASS_V_LABEL}`)
    }

    private get horizontalLabels()
    {
        return this.hLabelGroup.selectAll(`.${AdjacencyMatrix.CSS_CLASS_H_LABEL}`)
    }

    private get cells()
    {
        return this.cellsGroup.selectAll(`.${AdjacencyMatrix.CSS_CLASS_CELL}`)
    }

    private get isHLabelRotated(): boolean
    {
        const [longestLabelWidth, labelHeight] = this.findLongestLabelWidthAndLabelHeight()
        return longestLabelWidth >= this.cellSize
    }

    // todo!!!: Make graph label and cell size based on the frame constraints
    constructor(graph: UndirectedGraph,
                style: MatrixStyle = {
                    frame: {
                        x: 100,
                        y: 100,
                        width: 500,
                        height: 500
                    },
                    fontName: 'monospace',
                    matrixMargin: 10,
                    padding: 36,
                    cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
                },
                transitionTime = 400)
    {
        this.style = style
        this.graph = graph
        this.orderedLabels = graph.vertices
        this.transitionTime = transitionTime
    }

    private render = () => {
        this.joinCells()
        this.joinHLabels()
        this.joinVLabels()
    }

    private findLongestLabelWidthAndLabelHeight = (): [number, number] => {
        let longestLabelWidth = null
        let longestLabel = null
        let exampleLabelMetrics = CanvasRuler.getTextMetrics('A', this.style.fontName, this.fontSize)
        let labelHeight = exampleLabelMetrics.fontBoundingBoxAscent + exampleLabelMetrics.fontBoundingBoxDescent
        for (const label of this.orderedLabels)
        {
            let labelMetrics = CanvasRuler.getTextMetrics(label, this.style.fontName, this.fontSize)
            let labelWidth = labelMetrics.width
            if (longestLabelWidth === null || labelWidth > longestLabelWidth)
            {
                longestLabelWidth = labelWidth
                longestLabel = label
            }
        }
        console.log(`longest label "${longestLabel}" width ${longestLabelWidth}, label height: ${labelHeight}`)
        return [longestLabelWidth, labelHeight]
    }

    draw = (drawingContext) => {
        // region Calculate drawing frame constraints
        const labelCount = this.orderedLabels.length

        this.cellSize = (this.style.frame.width - this.style.frame.x) / labelCount
        this.fontSize = this.style.cellSizeToFontSize(this.cellSize)

        console.log(`cell size: ${this.cellSize}px, font size: ${this.fontSize}`)

        let svg = drawingContext.append('svg')
                                .attr('width', `${this.style.frame.x + this.style.frame.width}px`)
                                .attr('height', `${this.style.frame.y + this.style.frame.height}px`)
        // endregion

        //region Initialize vertical labels and setup their dragging actions
        // vertical labels' anchor is at the end of the text
        this.vLabelGroup = svg
            .append('g')
            .attr('transform',
                  `translate(${this.style.frame.x - this.style.matrixMargin}, 
                  ${this.style.frame.y})`)
        //endregion

        // region Initialize horizontal labels and setup their dragging actions
        // horizontal labels' anchor is at the bottom of the text
        this.hLabelGroup = svg
            .append('g')
            .attr('transform',
                  `translate(${this.style.frame.x},
                  ${this.style.frame.y - this.style.matrixMargin})`)
        //endregion

        // region Initialize cells
        this.cellsGroup = svg
            .append('g')
            .attr('transform',
                  `translate(
                      ${this.style.frame.x}, 
                      ${this.style.frame.y})`)      // y
        // endregion


        this.render()
    }

    joinVLabels = (): void => {
        this.vLabelGroup
            .selectAll(`.${AdjacencyMatrix.CSS_CLASS_V_LABEL}`)
            .data(this.orderedLabels, d => d)
            .join((enter) => enter.append('text')
                                  .attr('class', `${AdjacencyMatrix.CSS_CLASS_LABEL} vertical-label`)
                                  .attr('font-family', this.style.fontName)
                                  .text(label => label)
                                  .attr('alignment-baseline', 'middle')
                                  .style('text-anchor', 'end')
                                  .attr('x', 0)
                                  .attr('y', (d, i) => i * this.cellSize + this.cellSize / 2)
                                  .style('font-size', this.fontSize)
                                  .call(d3.drag()
                                          .on('drag', (event, label: string) => {

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

                                              // region todo highlight similar cells while dragging

                                              //      there is some problem with transition animation to be used here.
                                              let previousLabel = this.previousLabel(label)
                                              if (previousLabel !== null)
                                              {
                                                  let similaritySet = this.similarity(label, previousLabel)
                                                  d3.selectAll('.cell')
                                                    .filter((cellData: DrawingInstruction) => {
                                                        return cellData.position.rowLabel === previousLabel
                                                            && similaritySet.has(cellData.position.columnLabel)
                                                    })
                                                    .attr('fill', 'red')
                                              }
                                              let nextLabel = this.nextLabel(label)
                                              if (nextLabel !== null)
                                              {
                                                  let similaritySet = this.similarity(label, nextLabel)
                                                  d3.selectAll('.cell')
                                                    .filter((cellData: DrawingInstruction) => {
                                                        return cellData.position.rowLabel === nextLabel
                                                            && similaritySet.has(cellData.position.columnLabel)
                                                    }).attr('fill', 'red')
                                              }
                                              // endregion

                                          })
                                          .on('end', ((event, label: string) => {
                                              // rerender when user finished dragging:
                                              this.render()
                                          })))
                ,
                  update => update.call(update =>
                                            update
                                                .transition(this.transitionTime)
                                                .attr("y", (d, i) => i * this.cellSize + this.cellSize / 2))
            )
    }

    joinHLabels = (): void => {
        this.horizontalLabels.data(this.orderedLabels, d => d)
            .join(
                enter =>
                    enter.append('text')
                         .attr('transform', (d, i) => `rotate(${this.isHLabelRotated ? -90 : 0})`)
                         .attr('class', `${AdjacencyMatrix.CSS_CLASS_LABEL} ${AdjacencyMatrix.CSS_CLASS_H_LABEL}`)
                         .attr('x', this.isHLabelRotated ? 0 : (d, i) => i * this.cellSize + this.cellSize / 2)
                         .attr('y', this.isHLabelRotated ? (d, i) => i * this.cellSize + this.cellSize / 2 : 0)
                         .attr('font-family', this.style.fontName)
                         .text(label => label)
                         .style('text-anchor', this.isHLabelRotated ? 'start' : 'middle')
                         .attr('alignment-baseline', this.isHLabelRotated ? 'middle' : 'text-bottom')
                         .style('font-size', this.fontSize)
                         .call(d3.drag()
                                 .on('drag', (event, label: string) => {

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


                                 })
                                 .on('end', ((event, label: string) => {
                                     // rerender when user finished dragging
                                     this.render()
                                 })))

                ,
                update =>
                    update.call(update =>
                                    update
                                        .transition(this.transitionTime)
                                        .attr(this.isHLabelRotated ? 'y' : 'x', (d, i) => i * this.cellSize + this.cellSize / 2))
            )
    }

    joinCells = (): void => {
        this.cells.data(this.graph.toDrawingInstructionArray(this.orderedLabels), (d: DrawingInstruction) => {
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
                          .attr('fill', (d: DrawingInstruction) => d.filling !== false ?
                              AdjacencyMatrix.CELL_FILLED_FILL : AdjacencyMatrix.CELL_EMPTY_FILL)
                          .style('stroke-width', "1px")
                          .on('click', (event, targetData: DrawingInstruction) => {
                              console.log('click')
                              let v1 = targetData.position.rowLabel
                              let v2 = targetData.position.columnLabel
                              if (targetData.filling === false)
                              {
                                  this.graph.addEdge(new Edge(v1, v2, null))
                              }
                              else
                              {
                                  this.graph.removeEdge(new Edge(v1, v2, null))
                              }
                              this.render()
                          })
            ,
            update => update.call(update => update.transition(this.transitionTime)
                                                  .attr('y', (d: DrawingInstruction) =>
                                                      this.findLabelIndex(d.position.rowLabel) * this.cellSize)
                                                  .attr('x', (d: DrawingInstruction) =>
                                                      this.findLabelIndex(d.position.columnLabel) * this.cellSize)
                                                  .attr('fill',
                                                        (d: DrawingInstruction) => d.filling !== false ?
                                                            AdjacencyMatrix.CELL_FILLED_FILL : AdjacencyMatrix.CELL_EMPTY_FILL))
        )
    }

    swapLabel = (labelA: string, labelB: string): void => {
        let indexA, indexB: number = null
        for (let index = 0; index < this.orderedLabels.length; index++)
        {
            switch (this.orderedLabels[index])
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
        this.orderedLabels[indexA] = labelB
        this.orderedLabels[indexB] = labelA

        this.render()
    }

    private findLabelIndex = (label: string): number => {
        return this.orderedLabels.findIndex(v => v === label)
    }

    /**
     * Calculates the similarity between relationships of `labelA` and `labelB`.
     * @param labelA the first label to be compared.
     * @param labelB the other label to be compared against.
     * @returns an array whose [x] refers to a boolean that
     *          tells whether the given two labels have the same relationship to ordersLabels[x]
     */
    private similarity = (labelA: string, labelB: string): Set<string> => {
        const labelCount = this.orderedLabels.length
        let labelARow = Array<boolean | number>(labelCount)
        let labelBRow = Array<boolean | number>(labelCount)
        let similaritySet = new Set<string>()
        this.orderedLabels.forEach((label) => {
            if ((this.graph.isConnected(label, labelA) != false)
                && (this.graph.isConnected(label, labelB) != false))
            {
                similaritySet.add(label)
            }
        })

        return similaritySet;
    }

    /**
     * Find the previous label of the given label in the `orderedLabels`
     * @returns the previous label or `null` if no previous label found.
     */
    previousLabel = (label: string): string => {
        for (let i = 1; i < this.orderedLabels.length; i++)
        {
            if (this.orderedLabels[i] === label)
            {
                return this.orderedLabels[i - 1]
            }
        }
        return null;
    }

    /**
     * Find the next label of the given label in the `orderedLabels`
     * @returns the next label or `null` if no next label found.
     */
    nextLabel = (label: string): string => {
        for (let i = 1; i < this.orderedLabels.length; i++)
        {
            if (this.orderedLabels[i - 1] === label)
            {
                return this.orderedLabels[i]
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
        // .attr('fill', d => d.filling !== false ? CELL_FILLED_FILL : CELL_EMPTY_FILL)
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
        let endIndex = this.orderedLabels.length - 1
        console.log(`index: ${index}, move distance: ${moveDistance}`)
        if (index === 0)
        { // start, can only move down
            if (moveDistance >= this.cellSize)
            {
                this.orderedLabels[0] = this.orderedLabels[1]
                this.orderedLabels[1] = draggingLabel
                return [this.orderedLabels[0], 0]
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
                this.orderedLabels[endIndex] = this.orderedLabels[endIndex - 1]
                this.orderedLabels[endIndex - 1] = draggingLabel
                return [this.orderedLabels[endIndex], endIndex]
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
                this.orderedLabels[index] = this.orderedLabels[lastIndex]
                this.orderedLabels[lastIndex] = draggingLabel
                return [this.orderedLabels[index], index]
            }
            else if (moveDistance >= this.cellSize) // next element go up
            {
                let nextIndex = index + 1
                this.orderedLabels[index] = this.orderedLabels[nextIndex]
                this.orderedLabels[nextIndex] = draggingLabel
                return [this.orderedLabels[index], index]
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
            .transition().duration(this.transitionTime)
            .attr('y', targetIndex * this.cellSize + this.cellSize / 2)

        this.cells
            .filter((cellData: DrawingInstruction, i) => {
                return cellData.position.rowLabel === label
            })
            .transition().duration(this.transitionTime)
            .attr('y', targetIndex * this.cellSize)
    }

    private moveColumn = (label: string, targetIndex: number) => {
        // no need to raise
        this.horizontalLabels
            .filter((d) => d === label)
            .transition().duration(this.transitionTime)
            .attr(this.isHLabelRotated ? 'y' : 'x', targetIndex * this.cellSize + this.cellSize / 2)

        this.cells
            .filter((cellData: DrawingInstruction, i) => {
                return cellData.position.columnLabel === label
            })
            .transition().duration(this.transitionTime)
            .attr('x', targetIndex * this.cellSize)
    }

    // automatically reorder labels
    autoReorderLabels()
    {
        this.orderedLabels = UndirectedGraph.reorderedLabels(this.orderedLabels, this.graph)
        console.log(this.orderedLabels)
        this.render()
        // let newOrder = reorderLabels(this.orderedLabels, this.graph)
        // let separator = '<=>'
        // let swapSteps = calculateSwap(this.orderedLabels, newOrder, separator)
        // swapSteps.forEach((swapPairStr) => {
        //     let [source, target] = swapPairStr.split(separator)
        //     this.swapLabel(source, target)
        // })
    }

    highlightSimilarCellsBesideRow(label: string)
    {
        // todo: 1. find rows on both sides
        //       2. compare each cell with this row
        //       3. highlight similar cells with fills
        let labelIndex = this.findLabelIndex(label)
        let lastIndex = labelIndex - 1 < 0 ? null : labelIndex - 1
        let nextIndex = labelIndex + 1 > this.orderedLabels.length - 1 ? null : labelIndex + 1

        let labelRow = this.cells.filter((d: DrawingInstruction) => d.position.rowLabel === label).if(lastIndex !== null)
        {
            this.cells.filter((d: DrawingInstruction) => {
                if (d.position.rowLabel === this.orderedLabels[lastIndex])
                {

                }
            })
                .attr('fill', 'green')
        }
        if (nextIndex !== null)
        {

        }

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

// todo: add node, remove node