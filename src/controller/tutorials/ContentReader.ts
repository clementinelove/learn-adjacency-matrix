import {ViewController} from "../../UI/ViewController";
import {SlideText} from "../../components/SlideText";
import {StackView} from "../../UI/StackView";
import {LayoutConstraint} from "../../UI/LayoutConstraint";
import {Button} from "../../UI/Button";
import {SlideProgressBar} from "../../components/SlideProgressBar";
import {Label} from "../../UI/Label";
import Alignment = StackView.Alignment;
import Axis = LayoutConstraint.Axis;

export class ContentReader extends ViewController {

    title: Label
    slideMedia: StackView
    tips: Label;
    messageBox: StackView
    slideText: SlideText

    continueBtn: Button
    backBtn: Button

    buttonContainer: StackView

    readerContainer: StackView;
    slideProgressBar: SlideProgressBar;

    constructor(title: string)
    {
        super('contentReader');

        this.title = this.allocate(new Label(''))
        this.tips = this.allocate(new Label(''))
        this.readerContainer = this.allocate(new StackView())
        this.slideMedia = this.allocate(new StackView())
        this.slideText = this.allocate(new SlideText())
        this.messageBox = this.allocate(new StackView())

        this.buttonContainer = this.allocate(new StackView())
        this.buttonContainer.alignment = Alignment.Leading
        this.buttonContainer.axis = Axis.Vertical
        this.backBtn = this.allocate(new Button('← Back'))
        this.continueBtn = this.allocate(new Button('Continue'))
        this.buttonContainer.addAll(this.continueBtn, this.backBtn)

        this.slideProgressBar = this.allocate(new SlideProgressBar())

        this.title.setText(title)
        this.title.assignClass('text-5xl text-gray-400 font-thin leading-snug mb-4')
        this.slideMedia.axis = Axis.Vertical
        this.slideMedia.alignment = Alignment.Center
        this.tips.assignClass('text-gray-400 mt-4')
        this.messageBox.axis = Axis.Vertical
        this.messageBox.alignment = Alignment.Leading

        this.messageBox.addAll(this.slideText)
        this.messageBox.assignClass('font-roboto font-light mt-4')
        this.continueBtn.assignClass("my-4 select-none text-lg py-2 px-4 transition border border-black rounded-md hover:bg-gray-100")

        this.readerContainer.axis = Axis.Vertical
        this.readerContainer.alignment = Alignment.Leading
        this.view.add(this.readerContainer)
        this.readerContainer.addAll(this.title, this.slideProgressBar, this.slideMedia, this.tips, this.messageBox, this.buttonContainer)
    }
}