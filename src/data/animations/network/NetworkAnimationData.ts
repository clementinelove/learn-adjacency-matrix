import * as d3 from "d3";
import {UndirectedGraph} from "../../../utils/structures/UndirectedGraph";
import {MatrixStyle} from "../../../components/svg/AdjacencyMatrix";
import {LightWeightNode, Vertex} from "./GenerateLabels";
import {Simulation} from "../../Simulation";
import {NetworkDiagramStyle} from "../../../components/svg/NodeLinkDiagram";

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