import * as d3 from "d3";
import {NetworkSimulationLink, NetworkSimulationNode} from "./animations/network/NetworkAnimationData";
import {Dimension} from "../utils/structures/Geometry";
import {Vertex} from "./animations/network/GenerateLabels";
import {UndirectedGraph} from "../utils/structures/UndirectedGraph";

export class Simulation {

    instance: d3.Simulation<NetworkSimulationNode, NetworkSimulationLink>
    graph: UndirectedGraph
    simNodes: NetworkSimulationNode[]
    simLinks: NetworkSimulationLink[]
    dimension: Dimension

    constructor(graph: UndirectedGraph, dimension: Dimension)
    {
        this.graph = graph
        this.dimension = dimension
        this.freshSimulation()
    }

    freshSimulation()
    {
        const simNodesMap = new Map<string, NetworkSimulationNode>()
        this.graph.vertices.forEach((vertex) => {
            simNodesMap.set(vertex, {vertex: vertex, group: 1})
        })
        const simNodes = Array.from(simNodesMap.values())
        const simLinks = this.graph.edges.map((edge) => {
            return {
                source: simNodesMap.get(edge.vertex0),
                target: simNodesMap.get(edge.vertex1),
                value: 2,
            }
        })
        this.simNodes = simNodes
        this.simLinks = simLinks


        const {width, height} = this.dimension

        this.instance = d3.forceSimulation<NetworkSimulationNode, NetworkSimulationLink>(simNodes)
                          .force("charge", d3.forceManyBody())
                          .force("link",
                                 d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(simLinks)
                                   .id((d) => d.vertex)
                                   .distance((d) => {
                                       return 80
                                   })
                          )
                          .force("center", d3.forceCenter(width / 2, height / 2))

        return [simNodes, simLinks]
    }

    layout(snapshot: NetworkSimulationNode[] = null)
    {
        // console.log('manual layout executed!')
        // this.instance.force("link",
        //                     d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(this._simLinks)
        //                       .id((d) => d.vertex)
        //                       .distance((d) => {
        //                           return 80
        //                       })
        // )
        // this.instance.alpha(1).restart()

        if (snapshot) {
            this.simNodes = snapshot

            const simNodesMap = new Map<string, NetworkSimulationNode>()
            this.simNodes.forEach((n) => {
                simNodesMap.set(n.vertex, n)
            })
            const simLinks = this.graph.edges.map((edge) => {
                return {
                    source: simNodesMap.get(edge.vertex0),
                    target: simNodesMap.get(edge.vertex1),
                    value: 2,
                }
            })
            this.simLinks = simLinks


            const {width, height} = this.dimension

            this.instance = d3.forceSimulation<NetworkSimulationNode, NetworkSimulationLink>(this.simNodes)
                              .force("charge", d3.forceManyBody())
                              .force("link",
                                     d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(this.simLinks)
                                       .id((d) => d.vertex)
                                       .distance((d) => {
                                           return 80
                                       })
                              )
                              .force("center", d3.forceCenter(width / 2, height / 2))

        } else {
            this.freshSimulation()
        }
    }

    addNode(vertex: string, group = 0)
    {
        this.simNodes.push({vertex: vertex, group: group})
        this.instance.nodes(this.simNodes)
        this.instance.alpha(1).restart()
    }

    addLink([source, target]: [Vertex, Vertex], value: number = 0)
    {
        const sourceNode = this.simNodes.find((n) => n.vertex === source)
        const targetNode = this.simNodes.find((n) => n.vertex === target)
        this.simLinks.push({source: sourceNode, target: targetNode, value: value})
        this.instance.force("link",
                            d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(this.simLinks)
                              .id((d) => d.vertex)
                              .distance((d) => {
                                  return 80
                              })
        )
        this.instance.alpha(1).restart()
    }

    removeLink([source, target]: [Vertex, Vertex])
    {
        const sourceNode = this.simNodes.find((n) => n.vertex === source)
        const targetNode = this.simNodes.find((n) => n.vertex === target)
        this.simLinks = this.simLinks.filter((link) => {
            return !((link.source === sourceNode && link.target === targetNode) ||
                (link.target === sourceNode && link.source === targetNode))
        })
        this.instance.force("link",
                            d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(this.simLinks)
                              .id((d) => d.vertex)
                              .distance((d) => {
                                  return 80
                              })
        )
        this.instance.alpha(1).restart()
    }
}