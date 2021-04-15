import {Component} from "./Component";
import {StackView} from "./StackView";
import {LayoutConstraint} from "./LayoutConstraint";
import {Label} from "./Label";
import {Icon} from "./Icon";
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;

export class Button extends Component {

    selectorPrefix = 'Button'

    private _title: string
    private _subtitle: string

    get title(): string
    {
        return this._title;
    }

    set title(value: string)
    {
        this._title = value;
        this._titleLabel.setText(value, false)
    }

    private imageAndTitlesContainer: StackView;
    private titleContainer: StackView;

    private _icon: Icon
    private _titleLabel: Label
    private _subtitleLabel: Label


    get titleLabel(): Label
    {
        return this._titleLabel;
    }

    get subtitleLabel(): Label
    {
        return this._subtitleLabel;
    }

    constructor(title: string = null, subtitle: string = null, icon: string = '')
    {
        super();
        this.view.classed('cursor-pointer', true)
        this.imageAndTitlesContainer = new StackView()
        this.imageAndTitlesContainer.axis = Axis.Horizontal
        this.imageAndTitlesContainer.alignment = Alignment.Leading
        this.titleContainer = new StackView()
        this.titleContainer.axis = Axis.Vertical
        this.titleContainer.alignment = Alignment.Leading

        this._icon = Icon.named(icon)
        if (icon && icon !== '') {
         this.imageAndTitlesContainer.assignClass('space-x-2')
        }
        this._titleLabel = new Label(title)
        this._subtitleLabel = new Label(subtitle)

        this.titleContainer.addAll(this._titleLabel, this._subtitleLabel)
        this.imageAndTitlesContainer.addAll(this._icon, this.titleContainer)

        this.add(this.imageAndTitlesContainer)
    }


}