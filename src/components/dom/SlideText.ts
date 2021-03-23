import {Component} from "../../UI/Component";

export class SlideText extends Component {

    constructor()
    {
        super();
        this.view.style('hyphens', 'auto')
        this.toggleClass("text-3xl justify-self-start mr-8 row-start-1", true)
    }

    addLine(str: string) {
        // const currentHTML = this.view.node().innerHTML
        // const newHTML = currentHTML + str + "<br/>"
        // this.view.html(newHTML)
        this.view.append('p')
            .text(str)
    }
}