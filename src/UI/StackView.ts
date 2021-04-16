import {Component} from "./Component";
import {LayoutConstraint} from "./LayoutConstraint";
import Axis = LayoutConstraint.Axis;

export class StackView extends Component {

    selectorPrefix = 'StackView'

    _axis: Axis
    _alignment: StackView.Alignment

    get axis() : Axis {
        return this._axis
    }

    set axis(ax: Axis) {
        const disable = ax === Axis.Horizontal ? 'flex-col' : 'flex-row'
        const enable = ax === Axis.Horizontal ?  'flex-row' : 'flex-col'
        this._axis = ax
        this.removeClass(disable)
        this.assignClass(enable)
    }

    set alignment(v: StackView.Alignment) {
        this.removeClass(this._alignment)
        this._alignment = v
        this.assignClass(v)
    }

    constructor(axis: Axis = Axis.Vertical, alignment: StackView.Alignment = StackView.Alignment.Center)
    {
        super()
        this.assignClass('flex')
        this.axis = axis
        this.alignment = alignment
    }

}

export namespace StackView {

    export enum Alignment{
        Leading= "items-start",
        Trailing = "items-end",
        Fill = "items-stretch",
        Center = "items-center"
    }
}