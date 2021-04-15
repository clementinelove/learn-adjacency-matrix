import {ContentReader} from "../ContentReader";
import {AdjacencyMatrix, MatrixStyle} from "../../components/svg/AdjacencyMatrix";
import {Data} from "../../data/Data";
import {GridView} from "../../UI/GridView";
import {MatrixView} from "../../components/svg/MatrixView";
import {Label} from "../../UI/Label";
import {StackView} from "../../UI/StackView";
import {LayoutConstraint} from "../../UI/LayoutConstraint";
import {PatternMenuItem} from "../../components/PatternMenuItem";
import {UndirectedGraph} from "../../utils/structures/UndirectedGraph";
import {OrderedLabels} from "../../utils/structures/OrderedLabels";
import {SlideProgressDelegate} from "../../components/SlideProgressBar";
import {MatrixReorderingIntro} from "./MatrixReorderingIntro";
import Alignment = StackView.Alignment;
import Axis = LayoutConstraint.Axis;
import HoverCellEffect = AdjacencyMatrix.HoverCellEffect;
import {Highlight} from "../../utils/Highlight";

const patternsList = [
    Data.MatrixPatterns.selfLinks,
    Data.MatrixPatterns.cluster,
    Data.MatrixPatterns.clique,
    Data.MatrixPatterns.paths,
    Data.MatrixPatterns.connectors,
    Data.MatrixPatterns.hub
]

export class PatternsIntro extends ContentReader implements SlideProgressDelegate {

    PATTERN_ICON_RESPONSIVE_CSS_STYLE = 'w-16 lg:w-20 xl:w-24 2xl:w-28'

    text = [
        () => ['To help us interpret an adjacency matrix, there are six common visual patterns to know.'],
        // Self Links
        () => [`Diagonals are ${Highlight.main('Self Links')}, which as the name suggests, are links that connect a node to itself.`, `They could appear, for example, as self-citations in a citation network.`, `Some relationship simply doesn't have any self-links, e.g. marriage (after all you can't marry to yourself, or <a href="https://en.wikipedia.org/wiki/Sologamy" class="text-blue-400 underline" target="_blank">can you?</a>).`],
        // Node Cluster
        () => [`${Highlight.main('Node Cluster')} is a cluster of nodes where almost all the nodes in it are connected.`, 'Self links are not required.'],
        // Node Clique
        () => [`If all links would be present, the cluster would be a ${Highlight.main('Node Clique')}.`, 'Self links are not required.'],
        // Paths
        () => [
            `${Highlight.main('Paths')} are set of links that forms up a <strong>continuous</strong> connection that lead a node to another node. Usually in stairs shape.`,
            "In our example, Node 1 can use the 'stair' to find any nodes along the path, which eventually leads it to Node 10."
        ],
        // Connectors
        () => [`Sometimes, off-diagonal cells can be ${Highlight.main('Connectors')} that <strong>connects</strong> between two ${Highlight.secondary('node cliques or clusters')}.`, `In our example, the ${Highlight.main('highlighted cells')} located at the off-diagonal position connect ${Highlight.secondary('two cliques')}.`],
        // Hub Node
        () => [`A dense row or column is suggesting the node has many connections (that is, it's 'highly connected'), known as ${Highlight.main('Hub Node')}.`],
        () => ["Now you should be able to interpret an adjacency matrix without too much trouble.",
            "However, sometimes these patterns are not so obvious to see, and requires some care from us.",
            "Let's move on to the next part: <strong>matrix reordering</strong>."]
    ]

    menuButtonSize = 70

    static smPatternStyle: MatrixStyle = {
        matrixFrame: {
            x: 0,
            y: 0,
            width: 72,
            height: 72
        },
        fontName: 'monospace',
        hideLabel: true,
        toggleableCell: false
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
        toggleableCell: false
    }

    static xlPatternStyle: MatrixStyle = {
        matrixFrame: {
            x: 20,
            y: 20,
            width: 300,
            height: 300
        },
        fontName: 'Roboto',
        reorderable: false,
        toggleableCell: false,
        hoverCellEffect: HoverCellEffect.HighlightRelated,
        hideLabel: false,
    }

    allPatternsShowcaseMatrixContainer: GridView = (() => {
        const patternsContainer = this.allocate(new GridView(2, 3))
        Data.MatrixPatterns.allPatterns.forEach((ptrn, i) => {
            const matrix = new PatternMenuItem(ptrn, this.menuButtonSize)
            matrix.assignClass(`m-4`)
            matrix.matrixView.assignClass(this.PATTERN_ICON_RESPONSIVE_CSS_STYLE)
            patternsContainer.add(matrix)
        })
        patternsContainer.assignClass('my-16')
        return patternsContainer
    })()

    _selectedMatrixIndex = 0

    set selectedMatrixIndex(v: number)
    {
        this._selectedMatrixIndex = v
        this.updatePatternsMenu()
    }

    updatePatternsMenu = () => {
        this.patternsMenu.view.selectAll('.patternMenuItem')
            .classed('opacity-30', (d, i) => {
                return i !== this._selectedMatrixIndex
            })
    }

    patternsMenu = (() => {
        const menu = this.allocate(new StackView())
        menu.assignClass('space-x-4')
        menu.alignment = Alignment.Leading
        menu.axis = Axis.Horizontal
        patternsList.forEach((pattern, i) => {
            const btn = new PatternMenuItem(pattern, this.menuButtonSize, false)
            btn.assignClass(`patternMenuItem opacity-30 cursor-pointer hover:opacity-100`)
            btn.matrixView.assignClass(this.PATTERN_ICON_RESPONSIVE_CSS_STYLE)
            btn.on('click', () => {
                const newSlideIndex = 1 + i
                this.slideProgressBar.updateCurrentSelection(newSlideIndex)
                this.playSlide(newSlideIndex)
                menu.view.selectAll('.patternMenuItem')
                    .classed('opacity-30', true)
                btn.removeClass('opacity-30')
            })

            if (i === this._selectedMatrixIndex)
            {
                btn.removeClass('opacity-30')
            }

            menu.add(btn)
        })
        return menu
    })()

    showcaseMatrix: AdjacencyMatrix = (() => {
        const patternMatrix = this.allocate(
            new AdjacencyMatrix(PatternsIntro.xlPatternStyle)
        )
        patternMatrix.assignClass('m-8 w-96')
        return patternMatrix
    })()

    showcaseShapeLabel: Label = (() => {
        const label = this.allocate(new Label(""))
        label.assignClass('lowercase text-base tracking-widest text-gray-500')
        return label
    })()

    showcaseNameLabel: Label = (() => {
        const label = this.allocate(new Label(""))
        label.assignClass('capitalize text-3xl font-medium')
        return label
    })()


    showcaseDescriptionLabel: Label = (() => {
        const label = this.allocate(new Label(""))
        label.assignClass('mt-4 text-lg w-80')
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
        labelContainer.addAll(this.showcaseShapeLabel, this.showcaseNameLabel, this.showcaseDescriptionLabel)

        infoContainer.addAll(labelContainer)
        infoContainer.assignClass('mt-8')
        return infoContainer
    })()

    showcaseContainer: StackView = (() => {
        const container = this.allocate(new StackView())
        container.axis = Axis.Horizontal
        container.alignment = Alignment.Leading
        container.addAll(this.showcaseMatrix, this.showcaseMatrixInfoContainer)
        container.assignClass('my-2')
        return container
    })()

    mediaContainer: StackView = (() => {
        const container = this.allocate(new StackView())
        container.axis = Axis.Vertical
        container.alignment = Alignment.Center
        container.addAll(this.showcaseContainer, this.patternsMenu)
        return container
    })()

    constructor()
    {
        super('Patterns');

        this.slideMedia.add(this.allPatternsShowcaseMatrixContainer)
        this.slideProgressBar.delegate = this
        this.slideProgressBar.render()
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
                this.navigation.navigateTo(new MatrixReorderingIntro(), true)
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
        this.tips.text = ''


        this.backBtn.hide(i === 0)

        if (i === 0)
        {
            this.slideMedia.add(this.allPatternsShowcaseMatrixContainer)
        }
        if (i >= 1 && i < patternsList.length + 1)
        {
            this.slideMedia.add(this.mediaContainer)
            this.tips.text = `${this.interactiveIcon} You can hover on cells to see their connections`

            const pattern = patternsList[i - 1]

            this.selectedMatrixIndex = i - 1

            this.showcaseMatrix.graph = UndirectedGraph.fromMatrix(pattern.instances[0], OrderedLabels.numeric)

            this.showcaseMatrix.stopAnimation()

            if (pattern.areaHighlights !== undefined)
            {
                pattern.areaHighlights.forEach((hl) => this.showcaseMatrix.highlightRectAreas(hl))
            }

            if (pattern.cellGroupHighlights !== undefined)
            {
                pattern.cellGroupHighlights.forEach((hl) => {
                    this.showcaseMatrix.highlightCells(hl)
                })
            }

            if (pattern.labelHighlight !== undefined)
            {
                pattern.labelHighlight.forEach(({indexes, color}) => {
                    indexes.forEach(i => {
                        this.showcaseMatrix.highlightLabel(this.showcaseMatrix.orderedLabels[i], false, color)
                    })
                })
            }

            this.showcaseIdentityMatrix.matrix = pattern.typicalExample
            this.showcaseNameLabel.setText(pattern.name)
            this.showcaseShapeLabel.setText(pattern.shape)
            this.showcaseDescriptionLabel.text = pattern.description
        }
        if (i === 7)
        {
            this.slideMedia.add(this.allPatternsShowcaseMatrixContainer)
        }

        if (i === this.text.length - 1)
        {
            this.continueBtn.title= 'Learn more about Matrix Reordering'
        }
        else
        {
            this.continueBtn.title = 'Continue'
        }
    }
}