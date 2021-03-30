import {ViewController} from "../../UI/ViewController";
import {CanvasAnimationPlayer} from "../../components/CanvasAnimationPlayer";
import {initNetworkAnimationData} from "../../data/animations/network/NetworkAnimationData";
import {ForceDirectedAnimation} from "../../data/animations/network/ForceDirectedAnimation";
import {NodeTrixAnimation} from "../../data/animations/network/NodeTrixAnimation";
import {GenerateLabels} from "../../data/animations/network/GenerateLabels";
import {MergeNodes} from "../../data/animations/network/MergeNodes";
import {Component} from "../../UI/Component";
import {SlideText} from "../../components/SlideText";
import {AddMoreNodes} from "../../data/animations/network/AddMoreNodes";
import {SlideTextIterator} from "../../data/Slides";
import {ExampleGraphs} from "../../data/ExampleGraphs";
import {ContentReader} from "./ContentReader";
import {AdjacencyMatrix} from "../../components/svg/AdjacencyMatrix";

const intro : string[][] = [
    ['This is a node-link diagram. Usually, it works fine.'],
    ['But once the dataset gets bigger, occlusion and link crossings start to appear.'],
    ['This is where adjacency matrix can help.'],
    ["It's symmetric. Labels that represent nodes are usually written on the top and left of the matrix."],
    ['With each filled cell representing an existing relationship between two nodes.'],
    ["Now, try hover your mouse on these cells and see what they mean.", "Click 'Continue' button when you finished."],
    ['That said, if we wish to learn more from the matrix, it\'d be helpful to know some common pattern.']
]

export class AdjacencyMatrixIntro extends ContentReader {

    adjacencyMatrix = (() => {
        const matrix = this.allocate(new AdjacencyMatrix(ExampleGraphs.getExample(3)))
        return matrix
    })()

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
            if (slideTextData.currentIndex === 5) {
                this.slideMedia.remove(canvasPlayer)
                this.slideMedia.add(this.adjacencyMatrix)
            } else {
                canvasPlayer.playNext()
            }

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