import {NodeLinkDiagram} from "./svg/NodeLinkDiagram";
import {UndirectedGraph} from "../utils/structures/UndirectedGraph";
import {ExampleGraphs} from "../data/ExampleGraphs";
import {AdjacencyMatrix} from "./svg/AdjacencyMatrix";
import {Component} from "../UI/Component";
import {NetworkSimulationLink, NetworkSimulationNode} from "../data/animations/network/NetworkAnimationData";
import {Label} from "../UI/Label";
import HoverCellEffect = AdjacencyMatrix.HoverCellEffect;
import HoverLabelEffect = AdjacencyMatrix.HoverLabelEffect;

export class MatrixExplorer extends Component {

    graph: UndirectedGraph
    nodeLinkDiagram: NodeLinkDiagram
    adjacencyMatrix: AdjacencyMatrix
    nodeLinkDiagramContainer: Component
    adjacencyMatrixContainer: Component
    infoLabelContainer: Component;
    infoLabel: Label

    constructor()
    {
        super('matrixExplorer');
        this.nodeLinkDiagramContainer = new Component('nodeLinkDiagramContainer')
        this.adjacencyMatrixContainer = new Component('adjacencyMatrixContainer')
        this.infoLabelContainer = new Component('infoLabelContainer')

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
                const vertex = node.vertex
                this.adjacencyMatrix.highlightAllRelationshipOfNode(vertex)
                this.infoLabel.text = 'Node ' + vertex
            },
            hoverLinkCallback: (link: NetworkSimulationLink) => {
                const [sourceVertex, targetVertex] = [link.source.vertex, link.target.vertex]
                this.adjacencyMatrix.highlightRelationship(sourceVertex, targetVertex)
                this.infoLabel.text = `Link between Node ${sourceVertex} and Node ${targetVertex}`
            },
            leaveNodeCallback: () => {
                this.adjacencyMatrix.restoreFromEffect()()
                this.infoLabel.text = ''
            },
            leaveLinkCallback: () => {
                this.adjacencyMatrix.restoreFromEffect()()
                this.infoLabel.text = ''
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
            hoverCellEffect: HoverCellEffect.HighlightSymmetric,
            hoverLabelEffect: HoverLabelEffect.HighlightSymmetric,
            hoverLabelCallback: (label) => {
                this.infoLabel.text = `Label ${label} – represents Node ${label}</br>` +
                    `Highlighted cells are connections of node ${label}.`
                this.nodeLinkDiagram.highlightNodeByVertex(label)
            },
            leaveLabelCallback: () => {
                this.nodeLinkDiagram.restoreNode()
                this.infoLabel.text = ''
            },
            hoverCellCallback: (di) => {
                const {rowLabel, columnLabel} = di.position
                let content: string = null
                if (rowLabel !== columnLabel)
                {
                    content = `Connection between Node ${rowLabel} and Node ${columnLabel}`
                }
                else
                {
                    content = `Connection of Node ${rowLabel} to itself`
                }
                this.nodeLinkDiagram.highlightLinkByVertex(rowLabel, columnLabel)
                this.infoLabel.text = content
            },
            leaveCellCallback: () => {
                this.nodeLinkDiagram.restoreLink()
                this.infoLabel.text = ''
            },
            cellStrokeColor: 'lightgray',
            reorderable: true,
            showLabelsOnHover: false,
            cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
        }


        this.nodeLinkDiagram = new NodeLinkDiagram(this.graph, nodeLinkDiagramStyle)
        this.adjacencyMatrix = new AdjacencyMatrix(adjacencyMatrixStyle, this.graph)
        this.infoLabel = new Label('')
        this.nodeLinkDiagramContainer.add(this.nodeLinkDiagram)
        this.adjacencyMatrixContainer.add(this.adjacencyMatrix)
        this.infoLabelContainer.add(this.infoLabel)


    }
}