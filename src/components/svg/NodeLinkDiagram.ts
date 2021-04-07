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

    private simNodesMap: Map<string, NetworkSimulationNode>
    private graph: UndirectedGraph
    private linkGroup: d3.Selection<SVGGElement, any, any, any>
    private nodeGroup: d3.Selection<SVGGElement, any, any, any>
    private simulation: Simulation
    private _simNodes: any = null
    private _simLinks: any = null
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
        return Array.from(this.simNodesMap.values())
    }

    get simLinks(): NetworkSimulationLink[]
    {
        return this.graph.edges.map((edge) => {
            return {
                source: this.simNodesMap.get(edge.vertex0),
                target: this.simNodesMap.get(edge.vertex1),
                value: 2,
            }
        })
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
        this.simNodesMap = new Map<string, NetworkSimulationNode>()
        graph.vertices.forEach((vertex) => {
            this.simNodesMap.set(vertex, {vertex: vertex, group: 1})
        })
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
        this.simulation = this.createSimulation(this.simNodes, this.simLinks)

        // initialize ui

        this.linkGroup = this.svg.append("g")
                             .attr('class', 'link-group')
                             .attr("stroke", "#999")
                             .attr("stroke-opacity", 0.6)
        this.nodeGroup = this.svg.append("g")
                             .attr('class', 'node-group')

        this.render()
    }

    createSimulation = (nodes, links) => {
        const {width, height} = this.style.frame
        return new Simulation({width: width, height: height}, nodes, links)
        // return d3.forceSimulation<NetworkSimulationNode, NetworkSimulationLink>(nodes)
        //          .force("charge", d3.forceManyBody())
        //          .force("link", d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(links)
        //                           .id((d) => d.vertex)
        //                           .distance((d) => {
        //                               return 80
        //                           }))
        //          .force("center", d3.forceCenter(width / 2, height / 2))
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
                       .data(this.simNodes)
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
