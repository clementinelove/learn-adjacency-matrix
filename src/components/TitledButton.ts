import {Component} from "../UI/Component";

export class TitledButton extends Component {

    private _title: string

    get button()
    {
        return this.view.select('button')
    }

    set title(newTitle)
    {
        this._title = newTitle
        this.button.text(this._title)
    }

    get title()
    {
        return this._title
    }

    constructor(title: string, action: () => void = null)
    {
        super()

        this.view
            .append('button')
            .text(title)

        this.on('click', action)
    }
}