import * as d3 from "d3";
import {UndirectedGraph} from "../UndirectedGraph";
import {MatrixStyle} from "../AdjacencyMatrix";
import {Rect} from "../Geometry";
import {LightWeightNode, Vertex} from "./GenerateLabels";
import {Simulation} from "../Data/Simulation";

export interface NetworkSimulationNode extends d3.SimulationNodeDatum {
    vertex: Vertex
    group?: number
}

export interface NetworkSimulationLink extends d3.SimulationLinkDatum<NetworkSimulationNode> {
    source: NetworkSimulationNode
    target: NetworkSimulationNode
    value: number
}

export type PositionedNode = LightWeightNode | NetworkSimulationNode

export interface NetworkDiagramStyle {
    frame: Rect
    fontName?: string
    fontSize?: number
    textColor?: string
    nodeRadius?: number
    nodeColor?: string
    nodeStrokeColor?: string
    linkColor?: string
    linkLength?: number
}

export const initNetworkAnimationData = (graph: UndirectedGraph, networkStyle: NetworkDiagramStyle, matrixStyle: MatrixStyle): NetworkData => {
    const simNodesMap = new Map<string, NetworkSimulationNode>()
    graph.vertices.forEach((vertex) => {
        simNodesMap.set(vertex, {vertex: vertex, group: 1})
    })
    const simNodes = Array.from(simNodesMap.values())
    const simLinks = graph.edges.map((edge) => {
        return {
            source: simNodesMap.get(edge.vertex0),
            target: simNodesMap.get(edge.vertex1),
            value: 2,
        }
    })
    const {width, height} = networkStyle.frame

    const simulation = new Simulation({width: width, height: height}, simNodes, simLinks)
    return {
        simNodes: simNodes,
        simLinks: simLinks,
        simulation: simulation,
        networkDiagramStyle: networkStyle,
        matrixStyle: matrixStyle,
        graph: graph
    }
}

export interface NetworkData {
    simNodes: NetworkSimulationNode[]
    simLinks: NetworkSimulationLink[]
    simulation: Simulation
    graph: UndirectedGraph
    networkDiagramStyle: NetworkDiagramStyle
    matrixStyle: MatrixStyle
}