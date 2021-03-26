import {ViewController} from "../../UI/ViewController";
import {CanvasAnimationPlayer} from "../../components/CanvasAnimationPlayer";
import {initNetworkAnimationData} from "../../data/animations/NetworkAnimationData";
import {ForceDirectedAnimation} from "../../data/animations/ForceDirectedAnimation";
import {NodeTrixAnimation} from "../../data/animations/NodeTrixAnimation";
import {GenerateLabels} from "../../data/animations/GenerateLabels";
import {MergeNodes} from "../../data/animations/MergeNodes";
import {Component} from "../../UI/Component";
import {SlideText} from "../../components/SlideText";
import {AddMoreNodes} from "../../data/animations/AddMoreNodes";
import {intro, SlideTextIterator} from "../../data/Slides";
import {ExampleGraphs} from "../../data/ExampleGraphs";
import {ContentReader} from "./ContentReader";

export class AdjacencyMatrixIntro extends ContentReader {

    constructor()
    {
        super();
        const networkData = this.initializeAnimationData()
        const canvasPlayer = this.allocate(new CanvasAnimationPlayer(
            {width: 500, height: 500},
            new ForceDirectedAnimation(networkData),
            new AddMoreNodes(networkData),
            new NodeTrixAnimation(networkData, 100),
            new GenerateLabels(networkData, 100),
            new MergeNodes(networkData, 100)
        ))
        this.slideMedia.add(canvasPlayer)

        canvasPlayer.play()

        const slideTextData = new SlideTextIterator(intro)

        this.slideText.loadLines(slideTextData.current(), true, () => this.continueBtn.hide(false))
        // canvasPlayer.createAnimationStateButtons(d3.select('body'))

        this.continueBtn.on('click', () => {
            this.slideText.loadLines(slideTextData.next(), true, () => this.continueBtn.hide(false))
            canvasPlayer.playNext()
            this.continueBtn.hide(true)
        })
    }

    initializeAnimationData()
    {
        const networkData = initNetworkAnimationData(
            ExampleGraphs.getExample(2),
            {
                frame: {
                    x: 0,
                    y: 0,
                    width: 500,
                    height: 500
                },
                fontName: 'sans-serif',
                fontSize: 10,
                textColor: 'black',
                nodeColor: 'white',
                nodeRadius: 12,
                nodeStrokeColor: 'black',
                linkColor: '#aaa'
            },
            {
                padding: 10,
                spaceBetweenLabels: 10,
                cellStrokeColor: "lightgray"
            }
        )
        return networkData
    }
}