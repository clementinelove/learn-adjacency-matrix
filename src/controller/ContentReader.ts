import {ViewController} from "../UI/ViewController";
import {SlideText} from "../components/SlideText";
import {StackView} from "../UI/StackView";
import {LayoutConstraint} from "../UI/LayoutConstraint";
import {Button} from "../UI/Button";
import {SlideProgressBar} from "../components/SlideProgressBar";
import {Label} from "../UI/Label";
import Alignment = StackView.Alignment;
import Axis = LayoutConstraint.Axis;
import interactive from "../data/gifs/interactive.gif";

export class ContentReader extends ViewController {

    static MAIN_MEDIA_CSS_STYLE = 'w-80 lg:w-96 xl:w-128 2xl:w-144'

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
    interactiveIcon: string


    constructor(title: string)
    {
        super('contentReader');

        this.interactiveIcon = `<img src="${interactive}" alt="This is an interactive piece!" class="inline" width="50px"/>`

        this.title = this.allocate(new Label(''))
        this.tips = this.allocate(new Label(''))
        this.readerContainer = this.allocate(new StackView())
        this.slideMedia = this.allocate(new StackView())
        this.slideText = this.allocate(new SlideText())
        this.messageBox = this.allocate(new StackView())

        this.buttonContainer = this.allocate(new StackView())
        this.buttonContainer.alignment = Alignment.Center
        this.buttonContainer.axis = Axis.Horizontal
        this.buttonContainer.assignClass('mt-4 self-end')
        this.backBtn = this.allocate(new Button('← Back'))
        this.continueBtn = this.allocate(new Button('Continue'))
        this.buttonContainer.addAll(this.backBtn, this.continueBtn)

        this.slideProgressBar = this.allocate(new SlideProgressBar())
        this.slideProgressBar.assignClass('self-start')

        this.title.setText(title)
        this.slideMedia.axis = Axis.Vertical
        this.slideMedia.alignment = Alignment.Center
        this.slideMedia.assignClass('self-center')
        this.messageBox.axis = Axis.Vertical
        this.messageBox.alignment = Alignment.Center

        this.messageBox.addAll(this.slideText)


        this.readerContainer.axis = Axis.Vertical
        this.readerContainer.alignment = Alignment.Leading
        // this.readerContainer.view.style('max-width', '800px')
        this.view.add(this.readerContainer)
        this.readerContainer.addAll(this.title, this.slideProgressBar, this.slideMedia, this.tips, this.messageBox, this.buttonContainer)

        this.readerContainer.assignClass('mx-auto')
        this.readerContainer.view.style('max-width', '1024px')

        this.title.assignClass('text-3xl self-start lg:text-5xl text-gray-400 font-thin leading-snug mb-4')

        this.messageBox.assignClass('font-roboto font-light mt-4')
        this.slideText.assignClass('text-base lg:text-xl xl:text-2xl 2xl:text-3xl')
        this.continueBtn.assignClass("my-4 select-none text-lg py-2 px-4 transition border border-black rounded-md hover:bg-gray-100")
        const textCSS = 'text-base lg:text-lg xl: text-xl 2xl:text-2xl'
        this.continueBtn.titleLabel.assignClass(textCSS)
        this.backBtn.assignClass('mx-4 p-2 select-none text-blue-400 rounded-md transition hover:bg-gray-100')
        this.backBtn.titleLabel.assignClass(textCSS)
        this.tips.assignClass(`text-gray-400 mt-4 ${textCSS}`)
    }
}