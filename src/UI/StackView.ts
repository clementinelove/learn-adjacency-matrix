import {Component} from "./Component";
import {LayoutConstraint} from "./LayoutConstraint";
import Axis = LayoutConstraint.Axis;

export class StackView extends Component {

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

    constructor()
    {
        super()
        this.assignClass('flex')
        this.axis = Axis.Vertical
        this.alignment = StackView.Alignment.Center
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