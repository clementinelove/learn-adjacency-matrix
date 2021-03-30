import {Component} from "./Component";

export class Label extends Component {

    private _text: string

    set text(newText: string) {
        this.setText(newText)
    }

    setText(str: string, animated: boolean = false) {
        this._text = str
        this.view.select('.label')
            .transition()
            .style('opacity', '0%')
            .duration(300)
            .style('opacity', '100%')
            .text(str)
    }

    constructor(text: string)
    {
        super();
        this._text = text;
        this.view
            .append('p')
            .attr('class', 'label')
            .transition()
            .style('opacity', '0%')
            .duration(300)
            .style('opacity', '100%')
            .text(text)
    }


}