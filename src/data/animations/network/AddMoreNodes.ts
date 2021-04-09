import {NetworkAnimation} from "./NetworkAnimation";
import * as d3 from "d3";
import {NetworkData} from "./NetworkAnimationData";
import {Edge} from "../../../utils/structures/UndirectedGraph";
import {Vertex} from "./GenerateLabels";

export class AddMoreNodes extends NetworkAnimation {

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

        const {fontName, fontSize, nodeRadius, nodeColor, linkWidth} = this.networkDiagramStyle
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
        const newNodes = ['4', '5', '6', '7', '8']
        const newEdges: [Vertex, Vertex][] = [
            ['4', '1'], ['4', '3'],
            ['5', '1'], ['5', '2'], ['5', '3'], ['5', '4'],
            ['6', '1'], ['6', '3'], ['6', '4'], ['6', '5'],
            ['7', '1'], ['7', '3'], ['7', '5'], ['7', '6'],
            ['8', '1'], ['8', '2'], ['8', '3'], ['8', '4'], ['8', '5'], ['8', '7']
        ]

        for (const node of newNodes)
        {
            this.graph.addVertex(node)
            this.simulation.addNode(node)
        }

        for (const edge of newEdges)
        {
            this.graph.addEdge(new Edge(edge[0], edge[1]))
            this.simulation.addLink(edge)
        }
    }

}