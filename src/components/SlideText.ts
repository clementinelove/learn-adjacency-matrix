import * as d3 from "d3";
import {Component} from "../UI/Component";

export class SlideText extends Component {

    constructor()
    {
        super();
        this.view.style('hyphens', 'auto')
        this.toggleClass("text-2xl justify-self-start mr-8 row-start-1 font-medium", true)
    }

    addLine(str: string)
    {
        // const currentHTML = this.view.node().innerHTML
        // const newHTML = currentHTML + str + "<br/>"
        // this.view.html(newHTML)
        this.view.append('p').html(str)
    }

    loadLines(strs: string[], animated = true, callback: () => void = null)
    {
        this.view.selectAll('p').remove()
        for (const str of strs)
        {
            if (animated)
            {
                this.addLine(str.replace(/\S/g, "<span class='letter'>$&</span>"))
                d3.selectAll(`#${this.id} .letter`)
                  .style('opacity', 0)
                  .transition()
                  .duration(300)
                  .ease(d3.easeQuadInOut)
                  .delay((d, i) => 20 * (i + 1))
                  .style('opacity', 1)
                  .end().then(callback)
            } else {
                this.addLine(str)
                callback()
            }
        }
    }
}