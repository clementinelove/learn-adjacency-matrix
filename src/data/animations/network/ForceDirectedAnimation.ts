import * as d3 from "d3";
import {NetworkAnimation} from "./NetworkAnimation";
import {NetworkData, NetworkSimulationLink, NetworkSimulationNode} from "./NetworkAnimationData";

function drag(simulation, enable: boolean)
{
    function dragSubject(event)
    {
        return simulation.find(event.x, event.y)
    }

    function dragStarted(event)
    {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }

    function dragged(event)
    {
        event.subject.fx = event.x
        event.subject.fy = event.y
    }

    function dragEnded(event)
    {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    if (enable)
    {

        return d3.drag()
                 .subject(dragSubject)
                 .on("start", dragStarted)
                 .on("drag", dragged)
                 .on("end", dragEnded)
    }
    else
    {
        return d3.drag()
                 .subject(dragSubject)
                 .on("start", null)
                 .on("drag", null)
                 .on("end", null)
    }
}

export class ForceDirectedAnimation extends NetworkAnimation {

    // simulation: d3.Simulation<NetworkSimulationNode, NetworkSimulationLink>;

    constructor(data: NetworkData = null)
    {
        super(data)
    }

    prepare(): void
    {
        if (this.sharedData.layoutRequired) {
            console.log('force: layout required')
            this.simulation.layout()
            this.sharedData.layoutRequired = false
        } else {
            console.log('force: layout not required')
        }

    }

    play(context: CanvasRenderingContext2D)
    {
        this.started = true
        this.context = context

        const {fontName, fontSize, nodeRadius, nodeColor, linkWidth} = this.networkDiagramStyle
        const font = `${fontSize}px ${fontName}`
        this.simulation.simLinks.forEach((link) => {
            const {source, target} = link
            this.drawLink(source.x, source.y, target.x, target.y,
                          this.linkColor(source.vertex, target.vertex, d3.interpolateTurbo)
            )
        })

        this.context.strokeStyle = "#fff"
        this.simulation.simNodes.forEach(node => {
            this.drawNodeShape(node.x, node.y)
            this.drawNodeText(node.x, node.y, node.vertex)
        })

        // todo: remove force! otherwise make it un interactive
        d3.select(context.canvas)
          .call(drag(this.simulation.instance, true))
    }

    finish()
    {
        this.simulation.instance.stop()
    }
}