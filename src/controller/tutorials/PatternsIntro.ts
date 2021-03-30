import {ContentReader} from "./ContentReader";
import {MatrixStyle} from "../../components/svg/AdjacencyMatrix";
import {Data} from "../../data/Data";
import {GridView} from "../../UI/GridView";
import {MatrixView} from "../../components/svg/MatrixView";
import {Label} from "../../UI/Label";
import {StackView} from "../../UI/StackView";
import {LayoutConstraint} from "../../UI/LayoutConstraint";
import {PatternViewer} from "../PatternViewer";
import {PatternMenuItem} from "../../components/PatternMenuItem";
import {SlidePlayer} from "../../utils/SlidePlayer";
import Alignment = StackView.Alignment;
import Axis = LayoutConstraint.Axis;

const intro = [
    ['To help us interpret an adjacency matrix, there are six common visual patterns to know.'],
    ['Node Cluster is a cluster of nodes where almost all the nodes in it are connected.'],
    ['If all links would be present, the cluster would be a Node Clique.'],
    ['Diagonals are Self Links, which as the name suggests, are links that connect a node to itself.', 'They could appear, for example, as self-citations in a citation network.'],
    ['Stairs are set of links that forms up connections that lead a node to another node.'],
    ['Sometimes, off-diagonal cells can be connectors that connects between two cliques or clusters.'],
    ["A dense row or column is suggesting the node has many connections (that is, it's 'highly connected')"]
]

const patternsList = [
    Data.MatrixPatterns.cluster,
    Data.MatrixPatterns.clique,
    Data.MatrixPatterns.selfLinks,
    Data.MatrixPatterns.paths,
    Data.MatrixPatterns.connectors,
    Data.MatrixPatterns.hub
]

export class PatternsIntro extends ContentReader {

    menuButtonSize = 100

    static smPatternStyle: MatrixStyle = {
        matrixFrame: {
            x: 0,
            y: 0,
            width: 72,
            height: 72
        },
        fontName: 'monospace',
        hideLabel: true,
        toggableCell: false
    }

    static mdPatternStyle: MatrixStyle = {
        matrixFrame: {
            x: 0,
            y: 0,
            width: 100,
            height: 100
        },
        fontName: 'monospace',
        hideLabel: true,
        toggableCell: false
    }

    static xlPatternStyle: MatrixStyle = {
        matrixFrame: {
            x: 0,
            y: 0,
            width: 360,
            height: 360
        },
        fontName: 'monospace',
        hideLabel: true,
        toggableCell: false
    }

    allPatternsShowcaseMatrixContainer: GridView = (() => {
        const patternsContainer = this.allocate(new GridView(2, 3))
        Data.MatrixPatterns.allPatterns.forEach((ptrn, i) => {
            const matrix = new PatternMenuItem(ptrn, this.menuButtonSize)
            matrix.assignClass('m-4')
            patternsContainer.add(matrix)
        })
        patternsContainer.assignClass('my-16')
        return patternsContainer
    })()

    selectedMatrixIndex = 0

    patternsMenu = (() => {
        const menu = this.allocate(new StackView())
        menu.alignment = Alignment.Center
        menu.axis = Axis.Horizontal
        patternsList.forEach((pattern, i) => {
            const btn = new PatternMenuItem(pattern, this.menuButtonSize)
            btn.assignClass('patternMenuItem opacity-30 cursor-pointer hover:opacity-100')
            btn.on('click', () => {
                this.playSlide(1 + i)
                menu.view.selectAll('.patternMenuItem')
                    .classed('opacity-30', true)
                btn.removeClass('opacity-30')
            })

            if (i === this.selectedMatrixIndex)
            {
                btn.removeClass('opacity-30')
            }

            menu.add(btn)
        })
        return menu
    })()

    showcaseMatrix: MatrixView = (() => {
        const patternMatrix = this.allocate(
            new MatrixView(PatternsIntro.xlPatternStyle)
        )
        patternMatrix.assignClass('my-8 shadow')
        return patternMatrix
    })()

    showcaseNameLabel: Label = (() => {
        const label = this.allocate(new Label(""))
        label.assignClass('capitalize text-5xl font-frank')
        return label
    })()

    showcaseShapeLabel: Label = (() => {
        const label = this.allocate(new Label(""))
        label.assignClass('uppercase text-lg tracking-widest')
        return label
    })()

    showcaseIdentityMatrix = (() => {
        const patternMatrix = this.allocate(
            new MatrixView(PatternsIntro.smPatternStyle)
        )
        patternMatrix.assignClass('mr-4')
        return patternMatrix
    })()

    showcaseMatrixInfoContainer: StackView = (() => {
        const infoContainer = this.allocate(new StackView())
        infoContainer.axis = Axis.Horizontal

        const labelContainer = this.allocate(new StackView())
        labelContainer.axis = Axis.Vertical
        labelContainer.alignment = Alignment.Leading
        labelContainer.addAll(this.showcaseShapeLabel, this.showcaseNameLabel)

        infoContainer.addAll(this.showcaseIdentityMatrix, labelContainer)
        return infoContainer
    })()

    showcaseContainer: StackView = (() => {
        const container = this.allocate(new StackView())
        container.axis = Axis.Vertical
        container.alignment = Alignment.Leading
        container.addAll(this.showcaseMatrix, this.showcaseMatrixInfoContainer)
        return container
    })()

    mediaContainer: StackView = (() => {
        const container = this.allocate(new StackView())
        container.axis = Axis.Vertical
        container.alignment = Alignment.Center
        container.addAll(this.patternsMenu, this.showcaseContainer)
        return container
    })()

    slideTextData: SlidePlayer

    constructor()
    {
        super();

        this.slideMedia.add(this.allPatternsShowcaseMatrixContainer)
        const slidePlayer = new SlidePlayer()
        this.slideTextData = slidePlayer

        this.playSlide(slidePlayer.start)
        this.continueBtn.on('click', () => {
            this.playNextSlide()
        })
    }

    playNextSlide()
    {
        this.playSlide(this.slideTextData.nextSlide)
    }

    playSlide(i)
    {

        this.slideTextData.moveTo(i)

        this.slideMedia.removeAll()

        this.slideText.loadLines(intro[i], true, () => this.continueBtn.hide(false))
        this.continueBtn.hide(true)


        if (i === 0) {
            this.slideMedia.add(this.allPatternsShowcaseMatrixContainer)
        } else if (i >= 1 && i < patternsList.length + 1) {
            this.slideMedia.add(this.mediaContainer)

            const pattern = patternsList[i - 1]

            this.selectedMatrixIndex = i - 1

            this.showcaseMatrix.matrix = pattern.instances[0]

            this.showcaseMatrix.stopAnimation()

            if (pattern.areaHighlights !== undefined)
            {
                pattern.areaHighlights.forEach((hl) => this.showcaseMatrix.highlightRectAreas(hl)
                )
            }

            if (pattern.cellGroupHighlights !== undefined)
            {
                pattern.cellGroupHighlights.forEach((hl) => {
                    this.showcaseMatrix.highlightCells(hl)
                })
            }

            this.showcaseIdentityMatrix.matrix = pattern.typicalExample
            this.showcaseNameLabel.setText(pattern.name)
            this.showcaseShapeLabel.setText(pattern.shape)
        }

        if (i === patternsList.length) {
            this.continueBtn.view.text('Go to Pattern Viewer')
            this.continueBtn.on('click', () => {
                this.navigation.navigateTo(new PatternViewer())
            })
        } else {
            this.continueBtn.view.text('Continue')
        }

    }
}