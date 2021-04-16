import {Edge, UndirectedGraph} from "../../utils/structures/UndirectedGraph";
import * as d3 from "d3";
import {NetworkSimulationLink, NetworkSimulationNode} from "../../data/animations/network/NetworkAnimationData";
import {SVGComponent} from "../../UI/SVGComponent";
import {replaceUndefinedWithDefaultValues} from "../../utils/Utils";
import {Simulation} from "../../data/Simulation";
import {Vertex} from "../../data/animations/network/GenerateLabels";
import {Rect} from "../../utils/structures/Geometry";
import {Highlight} from "../../utils/Highlight";


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

export interface NetworkDiagramStyle {
    frame: Rect
    fontName?: string
    fontSize?: string
    textColor?: string
    nodeRadius?: number
    nodeColor?: string
    nodeStrokeColor?: string
    linkColor?: string
    linkWidth?: number
    highlightNodeOnHover?: boolean
    highlightLinkOnHover?: boolean
    highlightColor?: string
    hoverNodeCallback?: (node: NetworkSimulationNode) => void
    leaveNodeCallback?: (node: NetworkSimulationNode) => void
    hoverLinkCallback?: (link: NetworkSimulationLink) => void
    leaveLinkCallback?: (link: NetworkSimulationLink) => void
}

export class NodeLinkDiagram extends SVGComponent {

    private _graph: UndirectedGraph
    private linkGroup: d3.Selection<SVGGElement, any, any, any>
    private nodeGroup: d3.Selection<SVGGElement, any, any, any>
    private simulation: Simulation
    private style: NetworkDiagramStyle


    get graph(): UndirectedGraph
    {
        return this._graph;
    }

    set graph(value: UndirectedGraph)
    {
        this._graph = value;
        if (value)
        {
            this._graph.addEventListener(UndirectedGraph.Event.edgeAdded, (e: CustomEvent<Edge>) => {
                console.log('edge added')
                this.addLink(e.detail.vertex0, e.detail.vertex1)
            })

            this._graph.addEventListener(UndirectedGraph.Event.edgeRemoved, (e: CustomEvent<Edge>) => {
                console.log('edge removed')
                this.removeLink(e.detail.vertex0, e.detail.vertex1)
            })

            this.simulation = this.createSimulation(value)
            this.render()
        }
    }

    get nodes(): d3.Selection<SVGLineElement, NetworkSimulationNode, SVGGElement, any>
    {
        return this.nodeGroup.selectAll(".node")
    }

    get links(): d3.Selection<SVGLineElement, NetworkSimulationLink, SVGGElement, any>
    {
        return this.linkGroup.selectAll(".link")
    }

    get selfLinks(): d3.Selection<SVGLineElement, NetworkSimulationNode, SVGGElement, any>
    {
        return this.nodeGroup.selectAll(".selfLink")
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
        nodeColor: '#d5c6ff',
        linkColor: '#CCC',
        linkWidth: 2.5,
        nodeStrokeColor: '#FFF',
        highlightColor: Highlight.mainHighlightColor,
        fontName: 'sans-serif',
        fontSize: "0.8rem",
        nodeRadius: 16
    }

    constructor(style: NetworkDiagramStyle = null,
                graph: UndirectedGraph = null)
    {
        super(null, style ? style.frame : NodeLinkDiagram.defaultStyle.frame)
        if (this.style !== null)
        {
            this.style = replaceUndefinedWithDefaultValues(style, NodeLinkDiagram.defaultStyle)
        }
        else
        {
            this.style = NodeLinkDiagram.defaultStyle
        }

        this.initialize()

        this.graph = graph
    }

    initialize()
    {
        // initialize ui

        this.linkGroup = this.svg.append("g")
                             .attr('class', 'link-group')
                             .attr("stroke", "#999")
                             .attr("stroke-opacity", 0.6)
        this.nodeGroup = this.svg.append("g")
                             .attr('class', 'node-group')
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

        this.joinNodes()
        this.joinSelfLinks()
        this.joinLinks()

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
            .join(enter => {
                const link = enter.append("line")
                                  .style('stroke', this.style.linkColor)
                                  .style("stroke-width", this.style.linkWidth)

                return link
            })
            .attr('class', 'link')
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
                if (this.style.leaveLinkCallback)
                {
                this.restoreLink()
                    this.style.leaveLinkCallback(link)
                }
            })
    }

    private joinSelfLinks()
    {
        const selfLinks = this._graph.edges.filter((edge) => edge.isReflexive)
        const selfLinkedNodes = selfLinks.map((edge) => edge.vertex0)

        this.selfLinks.style("stroke", (simNode) => {
            const isSelfLinkedNode = selfLinkedNodes.indexOf(simNode.vertex)
            if (isSelfLinkedNode !== -1)
            {
                return this.style.nodeColor
            }
            else
            {
                return 'none'
            }
        })
            .on('mouseenter', (event, node) => {
                const link = this.simLinks.find((link) =>
                                                    (link.source.vertex === link.target.vertex) && link.source.vertex === node.vertex)
                if (this.style.highlightLinkOnHover)
                {
                    this.highlightLinkByVertex(node.vertex, node.vertex)
                }
                if (this.style.hoverLinkCallback)
                {
                    this.style.hoverLinkCallback(link)
                }
            })
            .on('mouseleave', (event, node) => {
                const link = this.simLinks.find((link) =>
                                                    (link.source.vertex === link.target.vertex) && link.source.vertex === node.vertex)
                if (this.style.leaveLinkCallback)
                {
                    this.restoreLink()
                    this.style.leaveLinkCallback(link)
                }
            })
    }

    joinNodes = () => {

        const selfLinks = this._graph.edges.filter((edge) => edge.isReflexive)
        const selfLinkedNodes = selfLinks.map((edge) => edge.vertex0)

        let node = this.nodes
                       .data(this.simulation.simNodes, (node) => node.vertex)
                       .join(enter => {
                                 const node = enter.append("g")

                                 let circles = node
                                     .append('circle')
                                     .classed('nodeShape', true)
                                     .attr("r", this.style.nodeRadius.toString())
                                     .style("stroke", this.style.nodeStrokeColor)
                                     .style("stroke-width", 1.5)
                                     .style("fill", this.style.nodeColor)
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

                                         if (this.style.leaveNodeCallback)
                                         {
                                             this.restoreNode()
                                             this.style.leaveNodeCallback(node)
                                         }
                                     })

                                 const selfLinks = node.append('circle')
                                                       .classed('selfLink', true)
                                                       .attr("r", `${this.style.nodeRadius + 2}`)
                                                       .style("stroke", (simNode) => {
                                                           const isSelfLinkedNode = selfLinkedNodes.indexOf(simNode.vertex)
                                                           if (isSelfLinkedNode !== -1)
                                                           {
                                                               return this.style.nodeColor
                                                           }
                                                           else
                                                           {
                                                               return 'none'
                                                           }
                                                       })
                                                       .style("stroke-width", 1.5)
                                                       .style('fill', 'none')


                                 let labels = node
                                     .append('text')
                                     .classed('nodeLabel', true)
                                     .text(node => node.vertex)
                                     .style('fill', 'black')
                                     .style('user-select', 'none')
                                     .attr('alignment-baseline', 'middle')
                                     .style('text-anchor', 'middle')
                                     .style('font-family', this.style.fontName)
                                     .style('font-size', this.style.fontSize)
                                     .style('font-weight', 400)
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

                                         if (this.style.leaveNodeCallback)
                                         {
                                             this.restoreNode()
                                             this.style.leaveNodeCallback(node)
                                         }
                                     })

                                 node
                                     .append("title")
                                     .text(d => d.vertex)

                                 return node
                             }
                           ,
                             update => {
                                 update.select('nodeSelfLink')
                                       .style("stroke", (simNode) => {
                                           const isSelfLinkedNode = selfLinkedNodes.indexOf(simNode.vertex)

                                           if (isSelfLinkedNode !== -1)
                                           {
                                               return this.style.nodeColor
                                           }
                                           else
                                           {
                                               return 'none'
                                           }
                                       })
                                 return update
                             }
                       )
                       .attr('class', 'node')
                       .call(NodeLinkDiagram.drag(this.simulation.instance))

    }

    highlightNode(node: NetworkSimulationNode, stroke = this.style.highlightColor)
    {
        this.nodes.selectAll('.nodeShape')
            .filter((d) => {
                return d === node
            })
            .style('stroke', stroke)
    }

    highlightNodeByVertex(v: Vertex, stroke = this.style.highlightColor, fill = this.style.nodeColor)
    {
        this.nodes.selectAll('.nodeShape')
            .filter((d: NetworkSimulationNode) => {
                return d.vertex === v
            })
            .style('stroke', stroke)
            .style('fill', fill)
    }

    restoreNode(exclude: (node: NetworkSimulationNode) => boolean = null)
    {
        this.nodes.selectAll('.nodeShape')
            .filter(exclude === null ? () => true : (node: NetworkSimulationNode) => !exclude(node))
            .style('stroke', this.style.nodeStrokeColor)
            .style('fill', this.style.nodeColor)
    }

    highlightLinksOfNodeByVertex(vertex: Vertex, stroke = this.style.highlightColor) {
        this.links
            .filter((link) => (link.source.vertex === vertex) || (link.target.vertex === vertex))
            .style('stroke', stroke)

        this.selfLinks
            .filter((node) => node.vertex === vertex)
            .style('stroke', stroke)
    }

    highlightLink(link: NetworkSimulationLink, stroke = this.style.highlightColor)
    {
        this.links
            .filter((d) => {
                return d === link
            })
            .style('stroke', stroke)
    }

    highlightLinkByVertex(v0: Vertex, v1: Vertex, stroke = this.style.highlightColor)
    {
        if (v0 === v1)
        {
            this.selfLinks.filter(d => d.vertex === v0)
                .style('stroke', stroke)
        }
        else
        {
            this.links
                .filter((d) => {
                    const [sourceVertex, targetVertex] = [d.source.vertex, d.target.vertex]
                    return ((sourceVertex === v0) && (targetVertex === v1)) ||
                        ((sourceVertex === v1) && (targetVertex === v0))
                })
                .style('stroke', stroke)
        }


    }

    restoreLink(exclude: (edge) => boolean = null)
    {
        this.links
            .filter(exclude === null ? () => true : (link) => !exclude(new Edge(link.source.vertex, link.target.vertex)))
            .style('stroke', this.style.linkColor)

        const selfLinks = this._graph.edges.filter((edge) => edge.isReflexive)
        const selfLinkedNodes = selfLinks.map((edge) => edge.vertex0)

        this.selfLinks
            .filter(exclude === null ? () => true : (node) => !exclude(new Edge(node.vertex, node.vertex)))
            .style('stroke', (simNode) => {
                const isSelfLinkedNode = selfLinkedNodes.indexOf(simNode.vertex)
                if (isSelfLinkedNode !== -1)
                {
                    return this.style.nodeColor
                }
                else
                {
                    return 'none'
                }
            })
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
