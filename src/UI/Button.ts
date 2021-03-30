import {Component} from "./Component";
import {StackView} from "./StackView";
import {LayoutConstraint} from "./LayoutConstraint";
import {Label} from "./Label";
import {Icon} from "./Icon";
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;

export class Button extends Component {
    title: string
    subtitle: string

    private imageAndTitlesContainer: StackView;
    private titleContainer: StackView;

    private _image: Icon
    private _titleLabel: Label
    private _subtitleLabel: Label

    constructor(title?: string, subtitle?: string, icon?: string)
    {
        super();
        this.view.classed('cursor-pointer', true)
        this.imageAndTitlesContainer = new StackView()
        this.imageAndTitlesContainer.axis = Axis.Horizontal
        this.imageAndTitlesContainer.alignment = Alignment.Center
        this.titleContainer = new StackView()
        this.titleContainer.axis = Axis.Vertical
        this.titleContainer.alignment = Alignment.Leading
        this.imageAndTitlesContainer.addAll(this.titleContainer)

        this._image = new Icon(icon)
        this._titleLabel = new Label(title)
        this._subtitleLabel = new Label(subtitle)

        this.titleContainer.addAll(this._titleLabel)

        this.add(this.imageAndTitlesContainer)
    }


}