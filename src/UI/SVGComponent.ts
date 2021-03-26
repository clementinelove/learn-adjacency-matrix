import {Component} from "./Component";
import {Rect} from "../utils/structures/Geometry";

export class SVGComponent extends Component {
    svg: d3.Selection<SVGElement, any, any, any>

    protected readonly frame: Rect

    constructor(id: string = null, frame: Rect)
    {
        super(id, {width: frame.width + frame.x, height: frame.height + frame.y});
        this.frame = frame
        const {x, y, width, height} = frame
        this.svg = this.view.append('svg')
                     // .attr('viewBox', `${x} ${y} ${width} ${height}`)
                     .attr('width', `${x + width}px`)
                     .attr('height', `${y + height}px`);
    }
}