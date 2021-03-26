import {Component} from "../../UI/Component";
import {flatten} from "../../utils/FP";
import {MatrixStyle} from "./AdjacencyMatrix";
import anime from "../../../node_modules/animejs/lib/anime.es";
import {SVGComponent} from "../../UI/SVGComponent";

export class MatrixView extends SVGComponent {

    matrix: number[][]
    highlightMatrix: number[][]
    style: MatrixStyle

    constructor(style: MatrixStyle, matrix: number[][], highlightMatrix: number[][] = null)
    {
        super(null, style.matrixFrame);
        this.matrix = matrix;
        this.style = style
        this.highlightMatrix = highlightMatrix
        this.initializeUI()
    }

    private initializeUI = (): void => {
        const matrixSize = this.matrix.length
        const {width, height, x, y} = this.style.matrixFrame
        const cellSideLength = (width > height ? width : height) / matrixSize
        const highlightArray = this.highlightMatrix !== null ? flatten(this.highlightMatrix) : null
        this.svg
            .selectAll('.cell')
            .data(flatten(this.matrix))
            .join((enter) =>
                      enter.append('rect')
                           .attr('width', cellSideLength)
                           .attr('height', cellSideLength)
                           .attr('x', (v, i) =>
                               i % matrixSize * cellSideLength
                           )
                           .attr('y', (v, i) =>
                               Math.floor(i / matrixSize) * cellSideLength
                           )
                           .classed('highlight', (d, i) => {
                               return highlightArray !== null && highlightArray[i] === 1
                           })
                           .style('stroke', 'lightgray')
                           .style('stroke-width', '1px')
                           .style('fill', (v) => v === 1 ? this.style.fillColor : 'white'),
                  (update) =>
                      update.call(update =>
                                      update.transition().duration(100)
                                            .attr('x', (v, i) =>
                                                i % matrixSize * cellSideLength
                                            )
                                            .attr('y', (v, i) =>
                                                Math.floor(i / matrixSize) * cellSideLength
                                            )
                                            .style('fill', (v) => v === 1 ? 'black' : 'white'),
                      )
            )
    }

    setHighlight(b: boolean)
    {
        if (b)
        {
            anime({
                      targets: '.highlight',
                      // opacity: [1, 0.3, 1],
                      fill: [this.style.fillColor, '#000', this.style.fillColor],
                      duration: 1500,
                      loop: true,
                      easing: 'easeOutSine'
                  })
        } else {
            anime.remove('.highlight')
        }
    }

    highlightRectArea = (startRow: number, startCol: number,
                         endRow: number, endCol: number) => {

    }
}