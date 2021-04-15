import {Edge, UndirectedGraph} from "../../utils/structures/UndirectedGraph";
import * as d3 from "d3";
import {
    NetworkDiagramStyle,
    NetworkSimulationLink,
    NetworkSimulationNode
} from "../../data/animations/network/NetworkAnimationData";
import {SVGComponent} from "../../UI/SVGComponent";
import {replaceUndefinedWithDefaultValues} from "../../utils/Utils";
import {Simulation} from "../../data/Simulation";
import {Vertex} from "../../data/animations/network/GenerateLabels";


// class GraphNode implements d3.SimulationNodeDatum {
//     id: String
//     group: number
//
//     constructor(vertex: Vertex)
//     {
//         this.id = vertex
//         this.group = 1
//     }
// }

export class NodeLinkDiagram extends SVGComponent {

    private graph: UndirectedGraph
    private linkGroup: d3.Selection<SVGGElement, any, any, any>
    private nodeGroup: d3.Selection<SVGGElement, any, any, any>
    private simulation: Simulation
    private style: NetworkDiagramStyle

    get nodes(): d3.Selection<SVGLineElement, NetworkSimulationNode, SVGGElement, any>
    {
        return this.nodeGroup.selectAll(".node")
    }

    get links(): d3.Selection<SVGLineElement, NetworkSimulationLink, SVGGElement, any>
    {
        return this.linkGroup.selectAll(".link")
    }

    get simNodes(): NetworkSimulationNode[]
    {
        return Array.from(this.simulation.simNodes.values())
    }

    get simLinks(): NetworkSimulationLink[]
    {
        return this.simulation.simLinks
    }

    static defaultStyle: NetworkDiagramStyle = {
        frame: {
            x: 0,
            y: 0,
            width: 500,
            height: 500
        },
        nodeColor: '#a8ddff',
        linkColor: '#CCC',
        linkWidth: 2.5,
        nodeStrokeColor: '#FFF',
        highlightColor: '#F00',
        fontName: 'sans-serif',
        fontSize: 8,
        nodeRadius: 16
    }

    constructor(graph: UndirectedGraph,
                style: NetworkDiagramStyle)
    {
        super(null, style.frame)
        this.graph = graph;
        this.graph.addEventListener(UndirectedGraph.Event.edgeAdded, (e: CustomEvent<Edge>) => {
            console.log('edge added')
            this.addLink(e.detail.vertex0, e.detail.vertex1)
        })

        this.graph.addEventListener(UndirectedGraph.Event.edgeRemoved, (e: CustomEvent<Edge>) => {
            this.removeLink(e.detail.vertex0, e.detail.vertex1)
        })
        this.style = replaceUndefinedWithDefaultValues(style, NodeLinkDiagram.defaultStyle)
        let {width, height} = this.style.frame
        this.simulation = this.createSimulation(graph)

        // initialize ui

        this.linkGroup = this.svg.append("g")
                             .attr('class', 'link-group')
                             .attr("stroke", "#999")
                             .attr("stroke-opacity", 0.6)
        this.nodeGroup = this.svg.append("g")
                             .attr('class', 'node-group')

        this.render()
    }

    createSimulation = (graph: UndirectedGraph) => {
        const {width, height} = this.style.frame
        return new Simulation(graph, {width: width, height: height})
    }

    static drag = (simulation) => {
        function dragstarted(event)
        {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event)
        {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event)
        {
            if (!event.active)
            {
                simulation.alphaTarget(0);
            }
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
                 .on("start", dragstarted)
                 .on("drag", dragged)
                 .on("end", dragended);
    }

    render()
    {
        let svg = this.svg

        this.joinLinks()

        this.joinNodes()

        this.simulation.instance.on("tick", () => {
            this.links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            this.nodes
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        });

        return svg.node();
    }

    joinLinks = () => {
        this.links
            .data(this.simLinks)
            .join("line")
            .attr('class', 'link')
            .style('stroke', this.style.linkColor)
            .attr("stroke-width", this.style.linkWidth)
            .on('mouseenter', (event, link) => {
                if (this.style.highlightLinkOnHover)
                {
                    this.highlightLink(link)
                }
                if (this.style.hoverLinkCallback)
                {
                    this.style.hoverLinkCallback(link)
                }
            })
            .on('mouseleave', (event, link) => {
                this.restoreLink()
                if (this.style.leaveLinkCallback)
                {
                    this.style.leaveLinkCallback(link)
                }
            })
    }

    joinNodes = () => {

        // todo make them non-selectable

        let node = this.nodes
                       .data(this.simulation.simNodes)
                       .join("g")
                       .attr('class', 'node')
                       .call(NodeLinkDiagram.drag(this.simulation.instance))
                       .on('mouseenter', (event, node) => {
                           if (this.style.highlightNodeOnHover)
                           {
                               this.highlightNode(node)
                           }
                           if (this.style.hoverNodeCallback)
                           {
                               this.style.hoverNodeCallback(node)
                           }
                       })
                       .on('mouseleave', (event, node) => {

                           this.restoreNode()
                           if (this.style.leaveNodeCallback)
                           {
                               this.style.leaveNodeCallback(node)
                           }
                       })

        let circles = node
            .append('circle')
            .classed('nodeShape', true)
            .attr("stroke", this.style.nodeStrokeColor)
            .attr("stroke-width", 1.5)
            .attr("r", this.style.nodeRadius.toString())
            .attr("fill", this.style.nodeColor)


        let labels = node
            .append('text')
            .classed('nodeLabel', true)
            .text(node => node.vertex)
            .style('fill', 'black')
            .style('user-select', 'none')
            .attr('alignment-baseline', 'middle')
            .style('text-anchor', 'middle')
            .style('font-family', this.style.fontName)
            .style('font-size', this.style.fontSize.toString())
            .style('font-weight', 400)

        node
            .append("title")
            .text(d => d.vertex);
    }

    highlightNode(node: NetworkSimulationNode)
    {
        this.nodes.selectAll('.nodeShape')
            .filter((d) => {
                return d === node
            })
            .style('stroke', this.style.highlightColor)
    }

    highlightNodeByVertex(v: Vertex) {
        this.nodes.selectAll('.nodeShape')
            .filter((d: NetworkSimulationNode) => {
                return d.vertex === v
            })
            .style('stroke', this.style.highlightColor)
    }

    restoreNode()
    {
        this.nodes.selectAll('.nodeShape')
            .style('stroke', this.style.nodeStrokeColor)
    }

    highlightLink(link: NetworkSimulationLink)
    {
        this.links
            .filter((d) => {
                return d === link
            })
            .style('stroke', this.style.highlightColor)
    }

    highlightLinkByVertex(v0: Vertex, v1: Vertex)
    {
        this.links
            .filter((d) => {
                const [sourceVertex, targetVertex] = [d.source.vertex, d.target.vertex]
                return ((sourceVertex === v0) && (targetVertex === v1)) ||
                    ((sourceVertex === v1) && (targetVertex === v0))
            })
            .style('stroke', this.style.highlightColor)
    }

    restoreLink()
    {
        this.links
            .style('stroke', this.style.linkColor)
    }


    addLink(source: Vertex, target: Vertex)
    {
        this.simulation.addLink([source, target])
        this.render()
    }

    removeLink(source: Vertex, target: Vertex)
    {
        this.simulation.removeLink([source, target])
        this.render()
    }

}
