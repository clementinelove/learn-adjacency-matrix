import * as d3 from "d3";
import {Component} from "./Component";

export class Icon extends Component {

    selectorPrefix = 'Icon'

    readonly icon: d3.Selection<HTMLSpanElement, any, any, any>

    constructor(cssClass: string)
    {
        super();
        this.icon = this.view.append('span')
            .classed(`${cssClass}`, true)
    }

    static fromCSSClass(cssClass: string) {

    }
}