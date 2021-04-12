import {CanvasAnimationPlayer} from "../../components/CanvasAnimationPlayer";
import {initNetworkAnimationData} from "../../data/animations/network/NetworkAnimationData";
import {ForceDirectedAnimation} from "../../data/animations/network/ForceDirectedAnimation";
import {NodeTrixAnimation} from "../../data/animations/network/NodeTrixAnimation";
import {GenerateLabels} from "../../data/animations/network/GenerateLabels";
import {MergeNodes} from "../../data/animations/network/MergeNodes";
import {ExampleGraphs} from "../../data/ExampleGraphs";
import {ContentReader} from "./ContentReader";
import {AdjacencyMatrix, MatrixStyle} from "../../components/svg/AdjacencyMatrix";
import {SlidePlayer} from "../../utils/SlidePlayer";
import {Label} from "../../UI/Label";
import {SlideProgressDelegate} from "../../components/SlideProgressBar";
import * as d3 from "d3";
import {StackView} from "../../UI/StackView";
import {LayoutConstraint} from "../../UI/LayoutConstraint";
import {MatrixExplorer} from "../../components/MatrixExplorer";
import {PatternsIntro} from "./PatternsIntro";
import HoverCellEffect = AdjacencyMatrix.HoverCellEffect;
import Axis = LayoutConstraint.Axis;
import HoverLabelEffect = AdjacencyMatrix.HoverLabelEffect;

const animationNetworkStyle = {
    frame: {
        x: 0,
        y: 0,
        width: 400,
        height: 400
    },
    fontName: 'sans-serif',
    fontSize: 12,
    textColor: 'black',
    nodeColor: 'white',
    nodeRadius: 12,
    allowDiagonals: false,
    nodeStrokeColor: 'black',
    linkColor: '#aaa'
}

export class AdjacencyMatrixIntro extends ContentReader implements SlideProgressDelegate {

    text: (() => string[])[] = [
        () => ['This is a node-link diagram visualizes the friendship of a network.',
            'For each person, we draw a node; for each connection (link) a line.', 'For a network not so complex, it works fine.'],
        () => ['But in many cases, we need to analyse a more complex network.',
            'And once the dataset gets bigger, occlusion and link crossings start to appear.'],
        () => ['This is where adjacency matrix can help.'],
        () => ["<strong>Nodes</strong> will now be represented by the <strong>labels</strong> written on the top and left of the matrix."],
        () => ['With each cell representing a connection between two nodes.',
            "Usually, we use a filled (in our case we use <strong>black</strong>) cell to show the connection exists.",
            "An unfilled cell means the connection doesn't exist."],
        () => [
            "Now, you can freely explore the elements of the adjacency matrix.",
            "<strong>Hover</strong> your mouse on the node-link diagram or the matrix, see what these elements represent.",
            "<strong>Click</strong> a cell of the matrix will toggle the corresponding link from the node-link diagram."
            , "When you finished exploring, we will show you more about the common visual patterns of adjacency matrix, which allows you to get more insights from the matrix."
        ]
    ]


    slidePlayer: SlidePlayer
    canvasPlayer: CanvasAnimationPlayer
    adjacencyMatrix: AdjacencyMatrix
    infoLabel: Label
    interactiveMatrixContainer: StackView
    matrixExplorer: MatrixExplorer

    constructor()
    {
        super("Introduction");
        this.slideProgressBar.delegate = this
        this.slideProgressBar.render()

        this.slidePlayer = new SlidePlayer()
        const network1 = this.initializeAnimationData(2)
        const network2 = this.initializeAnimationData(3)
        this.canvasPlayer = this.allocate(new CanvasAnimationPlayer(
            animationNetworkStyle.frame,
            new ForceDirectedAnimation(network1),
            new ForceDirectedAnimation(network2),
            // new AddMoreNodes(networkData),
            new NodeTrixAnimation(network2, 100),
            new GenerateLabels(network2, 100),
            new MergeNodes(network2, 100)
        ))
        this.matrixExplorer = this.allocate(new MatrixExplorer())
        this.infoLabel = this.allocate(new Label(''))
        const matrixStyle: MatrixStyle = {
            matrixFrame: {
                x: 40,
                y: 40,
                width: 280,
                height: 280
            },
            fontName: 'Roboto',
            toggleableCell: false,
            reorderable: false,
            showLabelsOnHover: false,
            allowDiagonals: false,
            hoverCellEffect: HoverCellEffect.HighlightSymmetric,
            hoverLabelEffect: HoverLabelEffect.HighlightSymmetric,
            hoverLabelCallback: (label) => {
                this.infoLabel.text = `Label ${label} – represents Node ${label}</br>` +
                    `Highlighted cells are connections of node ${label}.`

            },
            leaveLabelCallback: () => {
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
                this.infoLabel.text = content
            },
            leaveCellCallback: (di) => {
                this.infoLabel.text = ''
            }
        }

        this.adjacencyMatrix = this.allocate(new AdjacencyMatrix(matrixStyle, ExampleGraphs.getExample(3)))
        this.adjacencyMatrix.assignClass('my-8')

        this.interactiveMatrixContainer = this.allocate(new StackView())
        this.interactiveMatrixContainer.axis = Axis.Horizontal

        this.interactiveMatrixContainer.addAll(this.adjacencyMatrix, this.infoLabel)

        this.canvasPlayer.playFromStart()
        this.playSlide(0)

        this.backBtn.on('click', () => {
            const currentSlideIndex = this.slideProgressBar.currentSlideIndex
            const newIndex = currentSlideIndex - 1
            this.playSlide(newIndex)
            this.slideProgressBar.updateCurrentSelection(newIndex)

        })

        this.continueBtn.on('click', () => {
            const currentSlideIndex = this.slideProgressBar.currentSlideIndex
            if (currentSlideIndex === this.text.length - 1)
            {
                this.navigation.navigateTo(new PatternsIntro(), true)
            }
            else
            {
                const newIndex = this.slideProgressBar.currentSlideIndex + 1
                this.playSlide(newIndex)
                this.slideProgressBar.updateCurrentSelection(newIndex)
            }
        })
    }

    playSlide(i)
    {
        this.slideMedia.removeAll()
        this.slideText.loadLines(this.text[i](), true)

        this.backBtn.hide(i === 0)

        this.tips.text = ""


        if (i === this.text.length - 1)
        {
            this.continueBtn.title = 'Learn more about Patterns'
        }
        else
        {
            this.continueBtn.title = 'Continue'
        }

        if (i < 5)
        {
            this.slideMedia.add(this.canvasPlayer)
            this.canvasPlayer.play(i)
        }
        if (i === 5)
        {
            this.slideMedia.add(this.matrixExplorer)
            this.tips.text = "Hover on cells or links of the node-link diagram, or labels and cells of the matrix"
            this.adjacencyMatrix.view
                .style('opacity', 0)
                .transition().duration(300)
                .ease(d3.easeQuadInOut)
                .style('opacity', 1)
        }

    }

    initializeAnimationData(exampleIndex: number)
    {
        const networkData = initNetworkAnimationData(
            ExampleGraphs.getExample(exampleIndex),
            animationNetworkStyle,
            {
                padding: 10,
                spaceBetweenLabels: 10,
                cellStrokeColor: "lightgray"
            }
        )
        return networkData
    }
}