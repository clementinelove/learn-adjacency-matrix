import * as d3 from "d3";
import {NetworkSimulationLink, NetworkSimulationNode} from "./animations/NetworkAnimationData";
import {Dimension} from "../utils/structures/Geometry";
import {Vertex} from "./animations/GenerateLabels";

export class Simulation {

    instance: d3.Simulation<NetworkSimulationNode, NetworkSimulationLink>
    _simNodes: NetworkSimulationNode[]
    _simLinks: NetworkSimulationLink[]

    constructor(dimension: Dimension, simNodes: NetworkSimulationNode[], simLinks: NetworkSimulationLink[])
    {
        this._simNodes = simNodes
        this._simLinks = simLinks

        const {width, height} = dimension

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

    }

    get simNodes()
    {
        return this._simNodes
    }

    get simLinks()
    {
        return this._simLinks
    }

    addNode(vertex: string, group = 0)
    {
        this._simNodes.push({vertex: vertex, group: group})
        this.instance.nodes(this._simNodes)
        this.instance.alpha(1).restart()
    }

    addLink([source, target] : [Vertex, Vertex], value: number = 0)
    {
        const sourceNode = this._simNodes.find((n) => n.vertex === source)
        const targetNode = this._simNodes.find((n) => n.vertex === target)
        this._simLinks.push({source: sourceNode, target: targetNode, value: value})
        this.instance.force("link",
                            d3.forceLink<NetworkSimulationNode, NetworkSimulationLink>(this._simLinks)
                              .id((d) => d.vertex)
                              .distance((d) => {
                                  return 80
                              })
        )
        this.instance.alpha(1).restart()
    }
}