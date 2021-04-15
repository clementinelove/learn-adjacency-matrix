import * as d3 from "d3";
import {Component} from "./Component";

export class Icon extends Component {

    readonly icon: d3.Selection<HTMLSpanElement, any, any, any>

    private constructor(name: string)
    {
        super();
        this.icon = this.view.append('span')
            .classed('material-icons', true)
            .text(name)
    }

    static named(name: string) {
        return new Icon(name)
    }
}