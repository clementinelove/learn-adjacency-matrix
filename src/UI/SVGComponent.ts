import {Component} from "./Component";
import {Dimension, Rect} from "../utils/structures/Geometry";

export class SVGComponent extends Component {

    selectorPrefix = 'SVGComponent'

    svg: d3.Selection<SVGElement, any, any, any>

    protected readonly frame: Rect

    constructor(id: string = null, frame: Rect)
    {
        super(id, {width: frame.width + frame.x, height: frame.height + frame.y});
        this.frame = frame
        const {x, y, width, height} = frame
        this.svg = this.view.append('svg')
                       .attr('viewbox', `${x} ${y} ${width}, ${height}`)
                       .attr('width', `${x + width}px`)
                       .attr('height', `${y + height}px`);
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