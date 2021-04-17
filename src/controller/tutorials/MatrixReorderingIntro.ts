import {AdjacencyMatrix, MatrixStyle} from "../../components/svg/AdjacencyMatrix";
import {ContentReader} from "../ContentReader";
import {SlideProgressDelegate} from "../../components/SlideProgressBar";
import compareColumn from "../../data/video/compareColumn.mp4";
import {Video} from "../../UI/Video";
import {UndirectedGraph} from "../../utils/structures/UndirectedGraph";
import {OrderedLabels} from "../../utils/structures/OrderedLabels";
import {andmap} from "../../utils/FPUtils";
import {LayoutConstraint} from "../../UI/LayoutConstraint";
import {HomeController} from "../HomeController";
import {colorBrush} from "../../utils/Utils";
import Axis = LayoutConstraint.Axis;
import {Highlight} from "../../utils/Highlight";
import {FreePlayController} from "../FreePlayController";

const matrixExample1 = [
    [1, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1],
    [1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 0]
]
const matrixExample2 = [
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
];

const connector0Color = '#ff3563'
const connector1Color = '#e39832'
const connector2Color = '#48d8ff'

const connector0 = colorBrush(connector0Color)
const connector1 = colorBrush(connector1Color)
const connector2 = colorBrush(connector2Color)

export class MatrixReorderingIntro extends ContentReader implements SlideProgressDelegate {

    text: ((self) => string[])[] = [
        () => ['Sometimes, the pattern or the insights you are looking for just won’t show up right away.'],
        () => ['What we can do is to <em>reorder</em> them.', 'There are several ways of reordering, the one we will use in this tutorial is based on <em>similarity</em>.'],
        () => ["To see where to move a node to, simply compare each cell against <strong>every other</strong> columns' cells one at a time, then you could move the column <strong>beside the one with highest 'similarity'</strong>."],
        () => ["In the example above, the most 'similar' node to node 2 is node 1, since node 2 is already beside node 1, there is no need to move it around.",
            "But for node 3, its most similar node is node 1, so we can move node 3 beside node 1."],
        () => ["Notice that since the adjacency matrix is symmetric, when you move a column to another column position, its corresponding row needs to be swapped, too.",
            "Same rule applies when you reorder a row: its corresponding column needs to move as the row moves."],
        () => ["Now, you can drag the labels to reorder the matrix by yourself! ", "There is no correct answer here, just to let you experiment how reordering works.", "Try it now and click 'Continue' when you think you've found the pattern you are looking for."],
        (self: MatrixReorderingIntro) => {
            if (self.userReorderedLabels.length === 0)
            {
                return ["Here is the matrix that auto-reordered by the machine on-the-fly.",
                    "Do you think this result is helpful in seeing patterns?"]
            }
            else
            {
                const autoReorderResult = ['4', '3', '1', '2', '5', '6']
                if (andmap((label, i) => {
                    return label === autoReorderResult[i]
                }, this.userReorderedLabels))
                {
                    return ["On the left is the matrix that reordered by you. The right one is the same network, auto-reordered using an <strong>algorithm</strong>.",
                        "Your result is completely identical to machine's result! (the label order is reversed, though)"]
                }
                else if (andmap((label, i) => {
                    return label === autoReorderResult[5 - i]
                }, this.userReorderedLabels))
                {
                    return ["On the left is the matrix that reordered by you. The right one is the same network, auto-reordered using an <strong>algorithm</strong>.",
                        "The pattern you find is completely identical to machine's result!"]
                }
                else
                {
                    return ["On the left is the matrix that reordered by you. The right one is the same network, auto-reordered using an <strong>algorithm</strong>."]
                }
            }
        }, // todo:  compare user reordered and auto reordered
        () => [`The algorithm we used is <a href="https://hal.inria.fr/hal-01326759/document" title='You can learn more about this algorithm here.' class='underline text-blue-400' style='cursor: help' target="_blank"><em>optimal leaf ordering</em></a>. Manually reorder the matrix is doable, and useful when you don't have a computer around.`,
            "That said, when you have a huge matrix, you can ask computers to reorder the matrix for you to help you see the patterns."],
        () => ["There you go. This matrix is now auto reordered using <i>optimal leaf ordering</i>.", "Computer can be fast but pay attention that it might not always get the pattern you wanted. You can still manually reorder a matrix by yourself."],
        () => [
            `We can now easily identify three ${Highlight.main('node clusters')} along with some connectors.`,
            `${connector0('Red connector')} connects top cluster to middle cluster;`,
            `${connector1('Yellow connector')} connects top cluster to bottom cluster;`,
            `${connector2('Teal connector')} connects middle cluster to bottom cluster.`
        ],
    ]


    matrixStyle: MatrixStyle =
        {
            matrixFrame: {
                x: 40,
                y: 40,
                width: 400,
                height: 400
            },
            fontName: 'Roboto',
            spaceBetweenLabels: 10,
            padding: 36,
            hideLabel: false,
            toggleableCell: false,
            highlightColor: '#fc6b94',
            cellStrokeColor: 'lightgray',
            reorderable: false,
            showLabelsOnHover: false,
            cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
        }

    adjacencyMatrix: AdjacencyMatrix
    matrixForComparision: AdjacencyMatrix
    compareColumnVideo: Video;

    userReorderedLabels = []

    constructor()
    {
        super('Reordering')
        this.adjacencyMatrix = this.allocate(new AdjacencyMatrix(this.matrixStyle, UndirectedGraph.fromMatrix(matrixExample1, OrderedLabels.numeric)))
        this.matrixForComparision = this.allocate(new AdjacencyMatrix(this.matrixStyle, UndirectedGraph.fromMatrix(matrixExample1, OrderedLabels.numeric)))

        this.adjacencyMatrix.assignClass(MatrixReorderingIntro.MAIN_MEDIA_CSS_STYLE)
        this.matrixForComparision.assignClass(MatrixReorderingIntro.MAIN_MEDIA_CSS_STYLE)
        this.compareColumnVideo = this.allocate(new Video(compareColumn, true, {width: 720, height: 405}))
        this.slideProgressBar.delegate = this
        this.slideProgressBar.render()

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
                this.navigation.navigateTo(new FreePlayController(), true)
            }
            else
            {
                if (currentSlideIndex === 5)
                {
                    this.userReorderedLabels = this.adjacencyMatrix.orderedLabels
                }
                const newIndex = currentSlideIndex + 1
                this.playSlide(newIndex)
                this.slideProgressBar.updateCurrentSelection(newIndex)
            }
        })

        this.playSlide(0)
    }


    playSlide(i): void
    {
        this.slideMedia.removeAll()
        this.continueBtn.title = 'Continue'
        this.tips.text = ''
        this.slideMedia.axis = Axis.Horizontal
        this.slideText.loadLines(this.text[i](this), true)

        this.backBtn.hide(i === 0)

        if (i >= 0 && i <= 1)
        {
            this.slideMedia.add(this.adjacencyMatrix)
            this.adjacencyMatrix.reorderable = false
            this.adjacencyMatrix.graph = UndirectedGraph.fromMatrix(matrixExample1, OrderedLabels.numeric)
        }
        if (i == 2)
        {
            this.slideMedia.add(this.compareColumnVideo)
        }
        if (i >= 3 && i <= 6)
        {
            this.slideMedia.add(this.adjacencyMatrix)
            this.adjacencyMatrix.graph = UndirectedGraph.fromMatrix(matrixExample1, OrderedLabels.numeric)
            this.adjacencyMatrix.reorderable = false
            if (i == 3)
            {
                this.adjacencyMatrix.highlightLabel('1', true, '#2cbcff')
                this.adjacencyMatrix.highlightLabel('2', true, '#ee228b')
                this.adjacencyMatrix.highlightLabel('3', true, '#ecb11e')
            }
            if (i == 4)
            {
                // I don't understand why I can't write i == 3 || i == 4, so strange
                this.adjacencyMatrix.highlightLabel('1', false, '#2cbcff')
                this.adjacencyMatrix.highlightLabel('2', false, '#ee228b')
                this.adjacencyMatrix.highlightLabel('3', false, '#ecb11e')
                this.adjacencyMatrix.setOrderedLabels(['3', '1', '2', '4', '5', '6'], true)
            }
            if (i == 5)
            {
                this.tips.text = `${this.interactiveIcon} Drag <strong>labels on top and left of the matrix</strong> to reorder them`
                this.adjacencyMatrix.reorderable = true
                this.adjacencyMatrix.setOrderedLabels(['3', '1', '2', '4', '5', '6'], false)
            }
            if (i == 6)
            {

                if (this.userReorderedLabels.length !== 0)
                {
                    this.slideMedia.add(this.matrixForComparision)
                    this.adjacencyMatrix.setOrderedLabels(this.userReorderedLabels, true)
                    this.matrixForComparision.autoReorderLabels()
                }
                else
                {
                    this.adjacencyMatrix.autoReorderLabels()
                }
            }
        }
        if (i >= 7 && i <= 9)
        {
            this.slideMedia.add(this.adjacencyMatrix)
            this.adjacencyMatrix.graph = UndirectedGraph.fromMatrix(matrixExample2, OrderedLabels.numeric)
            this.adjacencyMatrix.reorderable = false
            if (i == 8)
            {
                this.adjacencyMatrix.autoReorderLabels()
            }
            if (i == 9)
            {
                this.continueBtn.title = 'Do you have any real-world examples?'
                this.adjacencyMatrix.autoReorderLabels(false)
                // clusters
                this.adjacencyMatrix.highlightRectAreas(Highlight.areas([[[0, 0], [7, 7]], [[9, 9], [12, 12]], [[13, 13], [17, 17]]]), 2)
                // connector 0
                this.adjacencyMatrix.highlightCells(Highlight.cells([[0, 10], [10, 0]], false, connector0Color), 2)
                // connector 1
                this.adjacencyMatrix.highlightRectAreas(Highlight.areas([[[13, 0], [17, 5]], [[0, 13], [5, 17]]],
                                                                        true, true, false,
                                                                        connector1Color), 2)
                // connector 2
                this.adjacencyMatrix.highlightCells(Highlight.cells([[16, 11], [11, 16]], false, connector2Color), 2)
            }
        }

    }


}