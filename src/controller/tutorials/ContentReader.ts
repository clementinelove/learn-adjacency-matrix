import {ViewController} from "../../UI/ViewController";
import {SlideText} from "../../components/SlideText";
import {StackView} from "../../UI/StackView";
import {LayoutConstraint} from "../../UI/LayoutConstraint";
import {Button} from "../../UI/Button";
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;
import {SlideProgressBar} from "../../components/SlideProgressBar";
import {Component} from "../../UI/Component";

export class ContentReader extends ViewController {

    title: Component
    slideMedia: StackView
    slideText: SlideText
    messageBox: StackView
    continueBtn: Button
    readerContainer: StackView;
    slideProgressBar: SlideProgressBar;

    constructor(title: string)
    {
        super('contentReader');
        this.title = new Component('contentTitle')
        this.title.view.html(title)
        this.readerContainer = this.allocate(new StackView())
        this.slideMedia = this.allocate(new StackView())
        this.slideText = this.allocate(new SlideText())
        this.messageBox = this.allocate(new StackView())
        this.continueBtn = this.allocate(new Button('Continue'))

        this.slideProgressBar = this.allocate(new SlideProgressBar())
        this.readerContainer.add(this.slideProgressBar)

        this.slideMedia.axis = Axis.Vertical
        this.slideMedia.alignment = Alignment.Center
        this.messageBox.axis = Axis.Vertical
        this.messageBox.alignment = Alignment.Leading

        this.messageBox.addAll(this.slideText, this.continueBtn)
        this.messageBox.assignClass('font-roboto font-light mt-4')
        this.continueBtn.assignClass("my-4 select-none text-lg py-2 px-4 transition border border-black rounded-md hover:bg-gray-100")

        this.readerContainer.axis = Axis.Vertical
        this.readerContainer.alignment = Alignment.Leading
        this.view.add(this.readerContainer)
        this.readerContainer.addAll(this.slideMedia, this.messageBox)
        this.continueBtn.hide(true)
    }
}