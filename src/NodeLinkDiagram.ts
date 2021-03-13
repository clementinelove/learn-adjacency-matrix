import {UndirectedGraph, Vertex} from "./UndirectedGraph";
import * as d3 from "d3";
import {NetworkDiagramStyle, NetworkSimulationLink, NetworkSimulationNode} from "./NodeLinkCanvasAnimation";
import {controlPointPosition, distance, midpoint, pArc} from "./Geometry";
import {PointTransitionScale} from "./CanvasUtils";


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

export class NodeLinkDiagram {

    private simNodesMap: Map<string, NetworkSimulationNode>
    private graph: UndirectedGraph
    private linkGroup: any
    private nodeGroup: any
    private simulation: any
    private _simNodes: any = null
    private _simLinks: any = null
    private style: NetworkDiagramStyle

    get nodes()
    {
        return this.nodeGroup.selectAll(".node")
    }

    get links()
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

    constructor(graph: UndirectedGraph,
                style: NetworkDiagramStyle = {
                    frame: {
                        x: 0,
                        y: 0,
                        width: 500,
                        height: 500
                    },
                    fontName: 'sans-serif',
                    fontSize: 8,
                    nodeRadius: 16
                })
    {
        this.simNodesMap = new Map<string, NetworkSimulationNode>()
        graph.vertices.forEach((vertex) => {
            this.simNodesMap.set(vertex, {vertex: vertex, group: 1})
        })
        this.graph = graph;
        this.style = style
    }

    createSimulation = (nodes, links) => {
        const {width, height} = this.style.frame
        return d3.forceSimulation<NetworkSimulationNode, NetworkSimulationLink>(nodes)
                 .force("charge", d3.forceManyBody())
                 .force("link", d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(links)
                                  .id((d) => d.vertex)
                                  .distance((d) => {
                                      return 80
                                  }))
                 .force("center", d3.forceCenter(width / 2, height / 2))
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
            console.log("fx: " + event.x + "; fy: " + event.fy)
        }

        function dragended(event)
        {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
                 .on("start", dragstarted)
                 .on("drag", dragged)
                 .on("end", dragended);
    }

    draw(drawingContext)
    {
        let {width, height} = this.style.frame

        let svg = drawingContext.append('svg')
                                .attr('width', `${width}px`)
                                .attr('height', `${height}px`)

        this.simulation = this.createSimulation(this.simNodes, this.simLinks)

        this.linkGroup = svg.append("g")
                            .attr('class', 'link-group')
                            .attr("stroke", "#999")
                            .attr("stroke-opacity", 0.6)
        this.joinLinks()

        this.nodeGroup = svg.append("g")
                            .attr('class', 'node-group')
        this.joinNodes()

        this.simulation.on("tick", () => {
            this.links
                .attr("d", d => d3.line()([[d.source.x, d.source.y], [d.target.x, d.target.y]]))
            this.nodes
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        });

        let animeButton = d3.select('body')
                            .append('button')
                            .attr('type', 'button')
                            .text('Anime!')
                            .on('click', (event) => {
                                // region stop simulation
                                // this.simulation.force('charge', null)
                                // this.simulation.force('link', null)
                                // this.simulation.force('center', null)
                                this.simulation.stop()
                                this.simulation.on('tick', null)
                                // endregion

                                // duplicate links for animation
                                let cloneLinks = this.links.clone()

                                // calculate positions for the new
                                const padding = 10
                                const matrixMargin = 10
                                const nodeRadius = this.style.nodeRadius
                                const nodeDiameter = nodeRadius * 2

                                // region replace links with paths (commented)

                                let nodePositions = new Map<string, [number, number]>() // point => vertex

                                this.nodes.each(function (datum: NetworkSimulationNode) {
                                    let transformString: string = this.getAttribute('transform')
                                    let [matched, x, y] = transformString.match(/translate\((\d+.\d+), +(\d+.\d+)\)/)
                                    console.log(`${datum.vertex}: ${parseFloat(x)}, ${parseFloat(y)}`)
                                    nodePositions.set(datum.vertex, [parseFloat(x), parseFloat(y)])
                                })

                                // let edges: NetworkSimulationLink[] = []
                                // this.links.each(function () {
                                //     let x1: number = parseFloat(this.getAttribute('x1'))
                                //     let y1: number = parseFloat(this.getAttribute('y1'))
                                //     let x2: number = parseFloat(this.getAttribute('x2'))
                                //     let y2: number = parseFloat(this.getAttribute('y2'))
                                //     console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
                                //     let vertex1PointStr = `${x1},${y1}`
                                //     let vertex2PointStr = `${x2},${y2}`
                                //     let v1 = pointDict.get(vertex1PointStr)
                                //     let v2 = pointDict.get(vertex2PointStr)
                                //     console.log(`Edge between ${v1} and ${v2}`)
                                //     edges.push(new Edge(v1, v2, null,))
                                // })
                                // this.links.remove()
                                // let line = d3.line()
                                // this.linkGroup.selectAll('.link')
                                //     .data(edges)
                                //     .join('path')
                                //     .attr('d', (d: NetworkGraphLink) => line([d.sourcePoint, d.targetPoint]))
                                //     .attr('stroke', 'black')
                                // endregion


                                let nodeTargetPosition = (vertex: Vertex): [number, number] => {
                                    const nodeIndex = this.graph.vertices.indexOf(vertex)
                                    const x = padding + nodeDiameter + matrixMargin + nodeIndex * nodeDiameter + nodeRadius
                                    const y = x
                                    return [x, y]
                                }

                                const simNodesToTransitionScales = new Map<string, PointTransitionScale>()
                                // const {padding, matrixMargin} = this.matrixStyle
                                // const nodeRadius = this.networkDiagramStyle.nodeRadius
                                // const nodeDiameter = nodeRadius * 2

                                this.simNodes.forEach((node) => {
                                    const vertex = node.vertex
                                    const [x, y] = nodePositions.get(vertex)
                                    // const {vertex, x, y} = node
                                    console.log(`${vertex}: ${x}, ${y}`)
                                    const nodeIndex = this.graph.vertices.indexOf(vertex)
                                    const destCenterX = padding + nodeDiameter + matrixMargin + nodeIndex * nodeDiameter + nodeRadius
                                    const destCenterY = destCenterX
                                    simNodesToTransitionScales.set(vertex, new PointTransitionScale(x, y, destCenterX, destCenterY, 1))
                                })

                                const t = 2000


                                this.links
                                    .transition()
                                    .duration(t)
                                    .attrTween('d', (link: NetworkSimulationLink) => {
                                        return function (t: number) {
                                            // console.log('interp start ----')
                                            const {source, target} = link
                                            const duration = 1
                                            const sourcePointScaler = simNodesToTransitionScales.get(source.vertex)
                                            const targetPointScaler = simNodesToTransitionScales.get(target.vertex)
                                            const sourcePoint = sourcePointScaler.point(t)
                                            const targetPoint = targetPointScaler.point(t)
                                            // const sourcePoint = new Point(source.x, source.y)
                                            // const targetPoint = new Point(target.x, target.y)
                                            const mid = midpoint(targetPoint, sourcePoint)
                                            const findCurrentControlPoint = (positiveDistance: boolean) => {
                                                const maxControlPoint = controlPointPosition(sourcePoint, targetPoint,
                                                                                             (positiveDistance ? 1 : -1) * distance(sourcePoint, targetPoint) / 2
                                                )
                                                const controlPointTransitionScaler =
                                                    new PointTransitionScale(mid.x, mid.y,
                                                                             maxControlPoint.x, maxControlPoint.y,
                                                                             duration
                                                    )
                                                return controlPointTransitionScaler.point(t);
                                            }

                                            const currentControlPoint =
                                                findCurrentControlPoint(true)

                                            const radius =
                                                d3.scaleLinear()
                                                  .domain([0, duration])
                                                  .range([distance(mid, targetPoint) / distance(mid, currentControlPoint) * distance(targetPoint, currentControlPoint), 0])

                                            const linkColor = 'blue'
                                            // const linkColor = this.linkColor(source.vertex, target.vertex, d3.interpolateTurbo)
                                            const context = d3.path()
                                            pArc(context, sourcePoint, findCurrentControlPoint(true), targetPoint, radius(t))
                                            pArc(context, sourcePoint, findCurrentControlPoint(false), targetPoint, radius(t))
                                            return context.toString()
                                        }
                                    })

                                this.nodes
                                    .transition()
                                    .duration(t)
                                    // .ease()
                                    .attr('transform', (d) => {
                                        const newPosition = nodeTargetPosition(d.vertex)
                                        return `translate(${newPosition[0]},${newPosition[1]})`
                                    })

                                console.log('clicked')
                            })


        return svg.node();
    }

    joinLinks = () => {
        this.linkGroup
            .selectAll(".link")
            .data(this.simLinks)
            .join("path")
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr("stroke-width", d => Math.sqrt(d.value));
    }

    joinNodes = () => {

        // todo make them non-selectable

        let node = this.nodeGroup
                       .selectAll(".node")
                       .data(this.simNodes)
                       .join("g")
                       .attr('class', 'node')
                       .call(NodeLinkDiagram.drag(this.simulation))

        let circles = node
            .append('circle')
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", this.style.nodeRadius.toString())
            .attr("fill", '#a8ddff')


        let labels = node
            .append('text')
            .text(node => node.vertex)
            .style('fill', 'black')
            .attr('alignment-baseline', 'middle')
            .style('text-anchor', 'middle')
            .style('font-family', this.style.fontName)
            .style('font-size', this.style.fontSize.toString())

        node
            .append("title")
            .text(d => d.vertex);
    }
}
