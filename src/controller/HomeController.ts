import {ViewController} from "../UI/ViewController";
import {AdjacencyMatrix, MatrixStyle} from "../components/svg/AdjacencyMatrix";
import {OrderedLabels} from "../utils/structures/OrderedLabels";
import {UndirectedGraph} from "../utils/structures/UndirectedGraph";
import {AdjacencyMatrixIntro} from "./tutorials/AdjacencyMatrixIntro";
import {Component} from "../UI/Component";
import {Button} from "../UI/Button";
import {pagesData} from "../data/Pages";

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
        width: 400,
        height: 400
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

    coverMatrix: AdjacencyMatrix;
    coverMatrixContainer = new Component('coverMatrix')
    startLearningBtnContainer = new Component('startLearningBtnContainer')
    startLearningBtn: Button
    nodeLinkBtn: d3.Selection<any, any, HTMLElement, any>
    matrixPatternsMixerBtn: d3.Selection<any, any, HTMLElement, any>
    matrixSortingBtn: d3.Selection<any, any, HTMLElement, any>
    chapterLinksContainer: Component

    constructor()
    {
        super('homePage');
        this.nodeLinkBtn = this.find('nodeLinkBtn')
        this.matrixPatternsMixerBtn = this.find('matrixPatternsMixerBtn')
        this.matrixSortingBtn = this.find('matrixSortingBtn')
        this.chapterLinksContainer = new Component('chapterLinks')

        this.coverMatrix = this.allocate(new AdjacencyMatrix(coverMatrixStyle, coverGraph))
        this.coverMatrix.assignClass('w-52 lg:w-96')
        this.coverMatrixContainer.add(this.coverMatrix)

        this.startLearningBtn = this.allocate(new Button('Start Learning'))
        this.startLearningBtn.assignClass('bg-blue-500 text-gray-50 rounded-md px-10 py-1.5 hover:bg-blue-400 transition text-lg lg:text-2xl')
        this.startLearningBtn.on('click', this.moveToReaderController)
        this.startLearningBtnContainer.add(this.startLearningBtn)

        pagesData.forEach((page) => {
            if (page.name.toLowerCase() !== 'home') {
                const chapterLink =  this.allocate(new Button(page.name, page.description))
                chapterLink.assignClass('p-4 rounded-md hover:bg-gray-100')
                chapterLink.titleLabel.assignClass('text-xl text-blue-400 underline')
                chapterLink.on('click',() => this.navigation.navigateTo(page.targetController()))
                this.chapterLinksContainer.add(chapterLink)
            }
        })

    }

    moveToReaderController = () => {
        this.navigation.navigateTo(new AdjacencyMatrixIntro())
    }
}