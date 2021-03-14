import * as d3 from "d3";
import {NetworkAnimation, NetworkData, NetworkSimulationLink, NetworkSimulationNode} from "../NodeLinkCanvasAnimation";

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

    simulation: d3.Simulation<NetworkSimulationNode, NetworkSimulationLink>;

    constructor(data: NetworkData = null)
    {
        super(data)
    }

    prepare(): void
    {
        const {width, height} = this.networkDiagramStyle.frame
        const createSimulation = (simNodes, simLinks): d3.Simulation<NetworkSimulationNode, NetworkSimulationLink> => {
            return d3.forceSimulation<NetworkSimulationNode, NetworkSimulationLink>(simNodes)
                     .force("charge", d3.forceManyBody())
                     .force("link",
                            d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(simLinks)
                              .id((d) => d.vertex)
                              .distance((d) => {
                                  return 80
                              })
                     )
                     .force("center", d3.forceCenter(width / 2, height / 2))
        }

        this.simulation = createSimulation(this.simNodes, this.simLinks)
    }

    play(context: CanvasRenderingContext2D)
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
        d3.select(context.canvas)
          .call(drag(this.simulation, true))
    }

    finish()
    {
        this.simulation.stop()
    }
}