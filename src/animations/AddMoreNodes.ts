import {NetworkAnimation} from "./NetworkAnimation";
import * as d3 from "d3";
import {NetworkData} from "./NetworkAnimationData";

export class AddMoreNodes extends NetworkAnimation{

    constructor(data: NetworkData)
    {
        super(data);
    }

    finish(): void
    {
    }

    play(context: CanvasRenderingContext2D): void
    {
        this.started = true
        this.context = context

        const {fontName, fontSize, nodeRadius, nodeColor, linkLength} = this.networkDiagramStyle
        const font = `${fontSize}px ${fontName}`
        this.simLinks.forEach((link) => {
            const {source, target} = link
            this.drawLink(source.x, source.y, target.x, target.y,
                          this.linkColor(source.vertex, target.vertex, d3.interpolateTurbo)
            )
        })

        this.context.strokeStyle = "#fff"
        for (const node of this.simNodes)
        {
            this.drawNodeShape(node.x, node.y)
            this.drawNodeText(node.x, node.y, node.vertex)
        }

        // todo: remove force! otherwise make it un interactive
        // d3.select(context.canvas)
        //   .call(drag(this.simulation.instance, true))
    }

    prepare(): void
    {
        this.simulation.addNode('19')
        this.simulation.addLink('19', '13')
        this.simulation.addLink('19', '12')
    }

}