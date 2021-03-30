import {ViewController} from "../UI/ViewController";
import {AdjacencyMatrix, MatrixStyle} from "../components/svg/AdjacencyMatrix";
import {OrderedLabels} from "../utils/structures/OrderedLabels";
import {UndirectedGraph} from "../utils/structures/UndirectedGraph";
import {AdjacencyMatrixIntro} from "./tutorials/AdjacencyMatrixIntro";
import {Component} from "../UI/Component";

// region data
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
    matrixFrame: {
        x: 0,
        y: 0,
        width: 300,
        height: 300
    },
    fontName: 'monospace',
    spaceBetweenLabels: 10,
    padding: 0,
    hideLabel: true,
    toggleableCell: true,
    cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
}
// endregion

export class HomeController extends ViewController {

    coverMatrix = new Component('coverMatrix')
    startLearningBtn = new Component('startLearningBtn')
    nodeLinkBtn: d3.Selection<any, any, HTMLElement, any>
    matrixPatternsMixerBtn: d3.Selection<any, any, HTMLElement, any>
    matrixSortingBtn: d3.Selection<any, any, HTMLElement, any>

    constructor()
    {
        super('homePage');
        this.nodeLinkBtn = this.find('nodeLinkBtn')
        this.matrixPatternsMixerBtn = this.find('matrixPatternsMixerBtn')
        this.matrixSortingBtn = this.find('matrixSortingBtn')
        this.startLearningBtn.on('click', this.moveToReaderController)

        this.coverMatrix.add(this.allocate(new AdjacencyMatrix(coverMatrixStyle, coverGraph)))

    }

    moveToReaderController = () => {
        this.navigation.navigateTo(new AdjacencyMatrixIntro())
    }
}