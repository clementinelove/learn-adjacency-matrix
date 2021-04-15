import * as d3 from "d3";
import {UndirectedGraph} from "../../../utils/structures/UndirectedGraph";
import {MatrixStyle} from "../../../components/svg/AdjacencyMatrix";
import {Rect} from "../../../utils/structures/Geometry";
import {LightWeightNode, Vertex} from "./GenerateLabels";
import {Simulation} from "../../Simulation";

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
    linkWidth?: number
    highlightNodeOnHover?: boolean
    highlightLinkOnHover?: boolean
    highlightColor?: string
    hoverNodeCallback?: (node: NetworkSimulationNode) => void
    leaveNodeCallback?: (node: NetworkSimulationNode) => void
    hoverLinkCallback?: (link: NetworkSimulationLink) => void
    leaveLinkCallback?: (link: NetworkSimulationLink) => void
}

export const initNetworkAnimationData = (graph: UndirectedGraph, networkStyle: NetworkDiagramStyle, matrixStyle: MatrixStyle): NetworkData => {

    const {width, height} = networkStyle.frame

    const simulation = new Simulation(graph, {width: width, height: height})
    return {
        simulation: simulation,
        networkDiagramStyle: networkStyle,
        matrixStyle: matrixStyle,
        graph: graph,
        layoutRequired: false
    }
}

export interface NetworkData {
    simulation: Simulation
    graph: UndirectedGraph
    networkDiagramStyle: NetworkDiagramStyle
    matrixStyle: MatrixStyle
    layoutRequired: boolean
    nodeSnapshot?: NetworkSimulationNode[]
}