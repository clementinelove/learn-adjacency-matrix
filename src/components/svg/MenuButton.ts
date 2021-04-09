import {SVGComponent} from "../../UI/SVGComponent";
import {Rect} from "../../utils/structures/Geometry";

export class MenuButton extends SVGComponent {

    showCloseIcon: boolean
    line0Data
    line1Data
    sideSpacing = 5
    duration = 200
    normalStrokeWidth = 2
    closeStrokeWidth = 1
    closePadding = 4

    constructor(showCloseIcon: boolean = false, frame: Rect = {
        x: 0, y: 0, width: 24, height: 24
    })
    {
        super(null, frame);
        this.showCloseIcon = showCloseIcon
        const {width, height} = frame
        const centerY = height / 2

        this.line0Data = {
            normal: [0, centerY - this.sideSpacing, width, centerY - this.sideSpacing],
            close: [this.closePadding, this.closePadding, width - this.closePadding, height - this.closePadding]
        }

        this.line1Data = {
            normal: [0, centerY + this.sideSpacing, width, centerY + this.sideSpacing],
            close: [this.closePadding, height - this.closePadding, width - this.closePadding, this.closePadding]
        }

        this.initializeUI(height, width);
    }


    private initializeUI(height: number, width: number)
    {

        const state = this.showCloseIcon ? "close" : "normal"

        this.svg.classed('cursor-pointer select-none', true)

        const line0 = this.line0Data[state]
        const line1 = this.line1Data[state]
        const strokeWidth = this.showCloseIcon ?  this.closeStrokeWidth : this.normalStrokeWidth

        this.svg.append('line')
            .attr('id', 'line0')
            .attr('x1', line0[0])
            .attr('y1', line0[1])
            .attr('x2', line0[2])
            .attr('y2', line0[3])
            .attr('stroke', '#111')
            .attr('stroke-width', `${strokeWidth}px`)

        this.svg.append('line')
            .attr('id', 'line1')
            .attr('x1', line1[0])
            .attr('y1', line1[1])
            .attr('x2', line1[2])
            .attr('y2', line1[3])
            .attr('stroke', '#111')
            .attr('stroke-width', `${strokeWidth}px`)
        this.extracted(this.line0Data, this.line1Data, this.closeStrokeWidth, this.normalStrokeWidth, this.duration);
    }

    private extracted(line0Data: { normal: number[]; close: (number | number)[] }, line1Data: { normal: number[]; close: (number | number)[] }, closeStrokeWidth: number, normalStrokeWidth: number, duration: number)
    {
        const update = () => {

            const state = this.showCloseIcon ? "close" : "normal"

            const line0 = line0Data[state]
            const line1 = line1Data[state]
            const strokeWidth = this.showCloseIcon ? closeStrokeWidth : normalStrokeWidth

            this.svg.select('#line0')
                .transition().duration(duration)
                .attr('x1', line0[0])
                .attr('y1', line0[1])
                .attr('x2', line0[2])
                .attr('y2', line0[3])
                .attr('stroke-width', `${strokeWidth}px`)

            this.svg.select('#line1')
                .transition().duration(duration)
                .attr('x1', line1[0])
                .attr('y1', line1[1])
                .attr('x2', line1[2])
                .attr('y2', line1[3])
                .attr('stroke-width', `${strokeWidth}px`)
        }
    }

    update(newState) {

        this.showCloseIcon = newState

        const state = this.showCloseIcon ?  "close" : "normal"

        const line0 = this.line0Data[state]
        const line1 = this.line1Data[state]
        const strokeWidth = this.showCloseIcon ? this.closeStrokeWidth : this.normalStrokeWidth

        this.svg.select('#line0')
            .transition().duration(this.duration)
            .attr('x1', line0[0])
            .attr('y1', line0[1])
            .attr('x2', line0[2])
            .attr('y2', line0[3])
            .attr('stroke-width', `${strokeWidth}px`)

        this.svg.select('#line1')
            .transition().duration(this.duration)
            .attr('x1', line1[0])
            .attr('y1', line1[1])
            .attr('x2', line1[2])
            .attr('y2', line1[3])
            .attr('stroke-width', `${strokeWidth}px`)
    }
}