import {ViewController} from "../UI/ViewController";
import {AdjacencyMatrix, MatrixStyle} from "../AdjacencyMatrix";
import {OrderedLabels} from "../OrderedLabels";
import {UndirectedGraph} from "../UndirectedGraph";
import {ContentReaderController} from "./ContentReaderController";

// region Data
const coverGraph = UndirectedGraph.fromMatrix([
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
                                              ], OrderedLabels.numeric)

const coverMatrixStyle: MatrixStyle = {
    frame: {
        x: 0,
        y: 0,
        width: 300,
        height: 300
    },
    fontName: 'monospace',
    spaceBetweenLabels: 10,
    padding: 0,
    hideLabel: true,
    interactiveCell: true,
    cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
}
// endregion

export class HomeController extends ViewController {

    coverMatrix: d3.Selection<any, any, HTMLElement, any>
    startLearningBtn: d3.Selection<any, any, HTMLElement, any>
    nodeLinkBtn: d3.Selection<any, any, HTMLElement, any>
    matrixPatternsMixerBtn: d3.Selection<any, any, HTMLElement, any>
    matrixSortingBtn: d3.Selection<any, any, HTMLElement, any>

    constructor()
    {
        super('home-page');
        this.coverMatrix = this.find('coverMatrix')
        this.startLearningBtn = this.find('startLearningBtn')
        this.nodeLinkBtn = this.find('nodeLinkBtn')
        this.matrixPatternsMixerBtn = this.find('matrixPatternsMixerBtn')
        this.matrixSortingBtn = this.find('matrixSortingBtn')

        this.startLearningBtn.on('click', this.moveToReaderController)

        this.allocate(new AdjacencyMatrix(coverGraph, coverMatrixStyle))
            .addTo(this.coverMatrix)
    }

    moveToReaderController = () => {
        this.navigation.navigateTo(new ContentReaderController())
    }
}