import {ViewController} from "../../UI/ViewController";
import {Component} from "../../UI/Component";
import {SlideText} from "../../components/SlideText";

export class ContentReader extends ViewController {

    slideMedia: Component = new Component("slideMedia")
    slideText: SlideText = this.allocate(new SlideText())
    messageBox: Component = new Component('messageBox')
    continueBtn: Component = new Component('continueBtn')

    constructor()
    {
        super('contentReader');
        this.messageBox.add(this.slideText)
        this.continueBtn.hide(true)
    }
}