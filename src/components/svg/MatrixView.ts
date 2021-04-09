import {flatten, ormap} from "../../utils/FPUtils";
import {MatrixStyle} from "./AdjacencyMatrix";
import anime from "../../../node_modules/animejs/lib/anime.es";
import {SVGComponent} from "../../UI/SVGComponent";
import * as d3 from "d3";
import {ObjectSet} from "../../utils/structures/ObjectSet";
import {Equatable} from "../../utils/Utils";
import {Highlight} from "../../data/Data";
import AreaHighlight = Highlight.AreaHighlight;
import CellGroupHighlight = Highlight.CellGroupHighlight;

export interface PositionedCell {
    position: CellPosition
    value: number
}

export class CellPosition implements Equatable<CellPosition> {
    row: number
    col: number

    constructor(row: number, col: number)
    {
        this.row = row;
        this.col = col;
    }

    static of([row, col]: [number, number])
    {
        return new CellPosition(row, col)
    }

    static group(...cells: [number, number][])
    {
        return cells.map(tpl => CellPosition.of(tpl))
    }

    equals(anotherValue: CellPosition): boolean
    {
        return this.row === anotherValue.row && this.col === anotherValue.col;
    }
}

export class MatrixView extends SVGComponent {

    _matrix: PositionedCell[][]
    private _style: MatrixStyle

    constructor(style: MatrixStyle,
                matrix: number[][] = null)
    {
        super(null, style.matrixFrame);
        this._matrix = matrix === null ? null : MatrixView.toPositionedCells(matrix);
        this._style = style
        if (this.renderable())
        {
            this.render()
        }
    }

    static toPositionedCells(matrix: number[][]): PositionedCell[][]
    {
        const pcMatrix: PositionedCell[][] = []
        matrix.forEach((row, rowIndex) => {
            let pcRow: PositionedCell[] = []
            row.forEach((v, colIndex) => {
                pcRow.push({position: CellPosition.of([rowIndex, colIndex]), value: v})
            })
            pcMatrix.push(pcRow)
        })
        return pcMatrix
    }

    set matrix(matrix: number[][])
    {
        this._matrix = MatrixView.toPositionedCells(matrix)
        if (this.renderable())
        {
            this.render()
        }
    }


    set style(value: MatrixStyle)
    {
        this._style = value;
        if (this.renderable())
        {
            this.render()
        }
    }

    renderable = (): boolean => {
        return this._style !== null && this._matrix !== null
    }

    private render = (): void => {
        if (this._matrix === null)
        {
            return
        }
        const matrixSize = this._matrix.length
        const {width, height} = this._style.matrixFrame
        const cellSideLength = (width > height ? width : height) / matrixSize
        this.svg
            .selectAll('.cell')
            .data(flatten(this._matrix), (pc: PositionedCell) => `${pc.position.row}, ${pc.position.col}`)
            .join((enter) =>
                      enter.append('rect')
                           .classed('cell', true)
                           .attr('width', cellSideLength)
                           .attr('height', cellSideLength)
                           .attr('x', (v, i) =>
                               i % matrixSize * cellSideLength
                           )
                           .attr('y', (v, i) =>
                               Math.floor(i / matrixSize) * cellSideLength
                           )
                           .style('stroke', 'lightgray')
                           .style('stroke-width', 1)
                           .style('fill', (pc) => pc.value === 1 ? this._style.fillColor : 'white')
                           .on('mouseover', this._style.toggleableCell === true ? (event, pc) => {
                               console.log('enter')
                               this.svg.selectAll<SVGRectElement, PositionedCell>('.cell')
                                   .filter((o) =>
                                               o.position.row === pc.position.row ||
                                               o.position.col === pc.position.col)
                                   .style('stroke', '#fe6568')
                                   .style('stroke-width', 2)
                                   .raise()
                           } : null)
                           .on('mouseleave', (event, pc) => {
                               this.svg.selectAll<SVGRectElement, PositionedCell>('.cell')
                                   .filter((o) =>
                                               o.position.row === pc.position.row ||
                                               o.position.col === pc.position.col)
                                   .style('stroke', 'lightgray')
                                   .style('stroke-width', 1)
                           }),
                  (update) =>
                      update.call(update =>
                                      update.transition().duration(500)
                                            .attr('x', (v, i) =>
                                                i % matrixSize * cellSideLength
                                            )
                                            .attr('y', (v, i) =>
                                                Math.floor(i / matrixSize) * cellSideLength
                                            )
                                            .style('fill', (pc) => pc.value === 1 ? 'black' : 'white'),
                      )
            )
    }

    setHighlight(b: boolean)
    {
        if (b)
        {
            d3.selectAll('.highlight')
              .transition()
              .ease(d3.easeSinOut)
              .duration(1500)
              .attr('fill', this._style.fillColor)
        }
        else
        {
            anime.remove('.highlight')
        }
    }

    highlightCells(highlight: CellGroupHighlight)
    {
        const cellsSet = new ObjectSet(CellPosition.group(...highlight.cells))

        const cells = this.svg
                          .selectAll<SVGRectElement, PositionedCell>('.cell')
                          .filter((pc) => {
                              return cellsSet.has(pc.position)
                          })

        this.breathAnimation(cells, highlight.color)
    }

    highlightRectAreas = (highlight: AreaHighlight) => {
        let predicates: ((pc: PositionedCell) => boolean)[] = []
        for (const area of highlight.areas)
        {
            const [[startRow, startCol], [endRow, endCol]] = area
            const isInArea = (pc) => {
                const {row, col} = pc.position

                const isException = ormap((exceptionCell) =>
                                              exceptionCell[0] === row && exceptionCell[1] === col,
                                          highlight.exceptions)
                console.log(`exception: ${isException}`)
                if (isException)
                {
                    return false
                }
                else
                {
                    let isHighlight = row >= startRow && row <= endRow &&
                        col >= startCol && col <= endCol

                    isHighlight = highlight.highlightFilledOnly ? isHighlight && (pc.value !== 0) : isHighlight
                    return isHighlight
                }
            }
            if (highlight.union)
            {
                predicates.push(isInArea)
            }
            else
            {
                const cells = this.svg
                                  .selectAll<SVGRectElement, PositionedCell>('.cell')
                                  .filter((pc) => {
                                      return isInArea(pc)
                                  })
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
                              .selectAll<SVGRectElement, PositionedCell>('.cell')
                              .filter((pc) => {
                                  return ormap((predicate) => predicate(pc), predicates)
                              })

            this.breathAnimation(cells,
                                 highlight.color,
                                 highlight.isOneByOne,
                                 highlight.isReverse,
                                 highlight.duration,
                                 highlight.delay)
        }
    }

    breathAnimation = (cells: d3.Selection<SVGRectElement, PositionedCell, any, any>,
                       color: string,
                       oneByOne: boolean = false,
                       reverse = false,
                       duration: number = 2000,
                       delay: number = 1000) => {
        const filled = "black"
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
            .style('fill', (pc) => pc.value === 0 ? unfilled : filled)
            .end()
            .then(() => this.breathAnimation(cells, color, oneByOne, reverse, duration, delay))
            .catch(() => {
            })
    }

    stopAnimation()
    {
        this.svg.selectAll('.cell').interrupt()
        this.render()
    }
}