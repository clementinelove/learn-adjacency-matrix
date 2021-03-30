import {ViewController} from "../../UI/ViewController";
import {SlideText} from "../../components/SlideText";
import {StackView} from "../../UI/StackView";
import {LayoutConstraint} from "../../UI/LayoutConstraint";
import {Button} from "../../UI/Button";
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;
import {SlideProgressBar} from "../../components/SlideProgressBar";

export class ContentReader extends ViewController {

    slideMedia: StackView
    slideText: SlideText
    messageBox: StackView
    continueBtn: Button
    private readerContainer: StackView;
    slideProgressBar: SlideProgressBar;

    constructor()
    {
        super('contentReader');
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