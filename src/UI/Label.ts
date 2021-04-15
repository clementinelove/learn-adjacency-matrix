import {Component} from "./Component";

export class Label extends Component {

    selectorPrefix = 'Label'

    private _text: string

    set text(newText: string)
    {
        this.setText(newText)
    }

    setText(str: string, animated: boolean = false)
    {
        this._text = str
        this.view.select('.label')
            .html(str)
            .transition()
            .style('opacity', '0%')
            .duration(animated ? 300 : 0)
            .style('opacity', '100%')
    }

    constructor(text: string = '')
    {
        super();
        if (text === null || text === undefined)
        {
            this._text = ''
        }
        else
        {
            this._text = text;
        }
        this.view
            .append('p')
            .attr('class', 'label')

        this.setText(text)
    }

    set color(colorString: string)
    {
        this.view.style('color', colorString)
    }


}