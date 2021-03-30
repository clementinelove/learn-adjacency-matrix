import {ViewController} from "../../UI/ViewController";
import {AdjacencyMatrix} from "../../components/svg/AdjacencyMatrix";
import {ExampleGraphs} from "../../data/ExampleGraphs";
import {ContentReader} from "./ContentReader";
import {SlideTextIterator} from "../../data/Slides";

const reordering : string[][] = [
    ['Sometimes, the pattern or the insights you are looking for just won’t show up right away.'],
    ['What we can do is to reorder them. How will you reorder them depends on your aim.'],
    ['You can either use automatic algorithms to reorder the matrix.'],
    ['Or you can reorder them manually.', 'Try dragging the labels around, see what will happen!'],
    ['Notice that since the matrix is symmetric, when you manually swap columns / rows, their corresponding rows / columns should to be swapped, too.']
]

export class MatrixReorderingIntro extends ContentReader {

    matrixStyle =
        {
            matrixFrame: {
                x: 20,
                y: 20,
                width: 400,
                height: 400
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

    constructor()
    {
        super()
        const adjacencyMatrix = this.allocate(new AdjacencyMatrix(this.matrixStyle, ExampleGraphs.getExample(0)))
        this.slideMedia.add(adjacencyMatrix)

        const slideTextData = new SlideTextIterator(reordering)
        this.slideText.loadLines(slideTextData.current(), true, () => this.continueBtn.hide(false))
        // canvasPlayer.createAnimationStateButtons(d3.select('body'))

        this.continueBtn.on('click', () => {
            this.slideText.loadLines(slideTextData.next(), true, () => this.continueBtn.hide(false))
            this.continueBtn.hide(true)
            if (slideTextData.currentIndex === 2) {
                adjacencyMatrix.autoReorderLabels()
            }
        })
    }


}