import {ViewController} from "../../UI/ViewController";
import {AdjacencyMatrix} from "../../components/svg/AdjacencyMatrix";
import {ExampleGraphs} from "../../data/ExampleGraphs";
import {ContentReader} from "./ContentReader";
import {intro, reordering, SlideTextIterator} from "../../data/Slides";

export class MatrixReorderingIntro extends ContentReader {

    constructor()
    {
        super()
        const adjacencyMatrix = this.allocate(new AdjacencyMatrix(ExampleGraphs.getExample(0)))
        this.slideMedia.add(adjacencyMatrix)

        const slideTextData = new SlideTextIterator(reordering)
        this.slideText.loadLines(slideTextData.current(), true, () => this.continueBtn.hide(false))
        // canvasPlayer.createAnimationStateButtons(d3.select('body'))

        this.continueBtn.on('click', () => {
            this.slideText.loadLines(slideTextData.next(), true, () => this.continueBtn.hide(false))
            this.continueBtn.hide(true)
        })
    }


}