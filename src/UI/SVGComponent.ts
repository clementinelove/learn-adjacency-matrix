import {Component} from "./Component";
import {Dimension, Rect} from "../utils/structures/Geometry";

export class SVGComponent extends Component {

    selectorPrefix = 'SVGComponent'

    svg: d3.Selection<SVGElement, any, any, any>

    protected readonly frame: Rect

    constructor(id: string = null, frame: Rect)
    {
        super(id);
        this.frame = frame
        const {x, y, width, height} = frame
        this.svg = this.view.append('svg')
                       .attr('viewBox', `${x} ${y} ${width} ${height}`)
    }

    assignSVGClass(str: string) {
        this.svg.classed(str, true)
    }

    removeSVGClass(str: string) {
        this.svg.classed(str, false)
    }

    set width(v: string)
    {
        this.svg.attr('width', v)
    }

    set height(v: string)
    {
        this.svg.attr('height', v)
    }
}