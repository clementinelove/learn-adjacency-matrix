import {Dimension, Point, Rect} from "../utils/structures/Geometry";
import {SVGComponent} from "../UI/SVGComponent";

export class ShowPatterns {
    frame: Dimension
    center: Point
    patternSpacing: number = 10
    view: d3.Selection<SVGElement, any, any, any>

    constructor()
    {
        this.center = new Point(this.frame.width / 2, this.frame.height / 2);
    }

    play()
    {

    }

    drawMatrix(frame: Rect, matrix: number[][])
    {
        const labelSize = 0
        const matrixWidth = frame.width - labelSize
        const cellCount = matrix.length
        const cellSideLength = matrixWidth / cellCount

        const m = this.view.append('g')
        m.data(matrix)
        return m
    }
}