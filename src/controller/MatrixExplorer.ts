import {ViewController} from "../UI/ViewController";
import {NodeLinkDiagram} from "../components/svg/NodeLinkDiagram";
import {UndirectedGraph} from "../utils/structures/UndirectedGraph";
import {ExampleGraphs} from "../data/ExampleGraphs";
import {AdjacencyMatrix} from "../components/svg/AdjacencyMatrix";
import {Component} from "../UI/Component";
import {NetworkSimulationLink, NetworkSimulationNode} from "../data/animations/network/NetworkAnimationData";

export class MatrixExplorer extends ViewController {

    graph: UndirectedGraph
    nodeLinkDiagram: NodeLinkDiagram
    adjacencyMatrix: AdjacencyMatrix
    nodeLinkDiagramContainer: Component
    adjacencyMatrixContainer: Component
    controlsContainer: Component


    constructor()
    {
        super('matrixExplorer');
        this.nodeLinkDiagramContainer = new Component('nodeLinkDiagramContainer')
        this.adjacencyMatrixContainer = new Component('adjacencyMatrixContainer')
        this.controlsContainer = new Component('controls')

        this.graph = ExampleGraphs.getExample(3)

        const nodeLinkDiagramStyle = {
            frame: {
                x: 0,
                y: 0,
                width: 330,
                height: 330
            },
            highlightColor: '#fc6b94',
            highlightNodeOnHover: true,
            highlightLinkOnHover: true,
            hoverNodeCallback: (node: NetworkSimulationNode) => {
                this.adjacencyMatrix.highlightAllRelationshipOfNode(node.vertex)
            },
            hoverLinkCallback: (link: NetworkSimulationLink) => {
                this.adjacencyMatrix.highlightRelationship(link.source.vertex, link.target.vertex)
            },
            leaveNodeCallback: () => {
                this.adjacencyMatrix.restoreFromEffect()()
            },
            leaveLinkCallback: () => {
                this.adjacencyMatrix.restoreFromEffect()()
            },
            fontName: 'sans-serif',
            fontSize: 8,
            nodeRadius: 12
        }

        const adjacencyMatrixStyle = {
            matrixFrame: {
                x: 30,
                y: 30,
                width: 300,
                height: 300
            },
            fontName: 'Roboto',
            spaceBetweenLabels: 10,
            padding: 36,
            hideLabel: false,
            toggleableCell: true,
            highlightColor: '#fc6b94',
            cellStrokeColor: 'lightgray',
            reorderable: true,
            showLabelsOnHover: false,
            cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
        }


        this.nodeLinkDiagram = this.allocate(new NodeLinkDiagram(this.graph, nodeLinkDiagramStyle))
        this.adjacencyMatrix = this.allocate(new AdjacencyMatrix(adjacencyMatrixStyle, this.graph))
        this.nodeLinkDiagramContainer.add(this.nodeLinkDiagram)
        this.adjacencyMatrixContainer.add(this.adjacencyMatrix)


    }
}