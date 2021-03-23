import {ViewController} from "../UI/ViewController";
import {CanvasAnimationPlayer} from "../components/CanvasAnimationPlayer";
import {initNetworkAnimationData} from "../animations/NetworkAnimationData";
import {exampleGraph0} from "../Data/graphs";
import {ForceDirectedAnimation} from "../animations/ForceDirectedAnimation";
import {NodeTrixAnimation} from "../animations/NodeTrixAnimation";
import {GenerateLabels} from "../animations/GenerateLabels";
import {MergeNodes} from "../animations/MergeNodes";
import {Component} from "../UI/Component";
import {SlideText} from "../components/dom/SlideText";
import {TitledButton} from "../components/TitledButton";
import {AddMoreNodes} from "../animations/AddMoreNodes";

export class ContentReaderController extends ViewController {

    slideMedia: Component = new Component("slideMedia")
    slideText: SlideText = this.allocate(new SlideText())
    messageBox: Component = new Component('messageBox')
    continueBtn: Component = new Component('continueBtn')

    constructor()
    {
        super('contentReader');
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
        this.messageBox.add(this.slideText)
        canvasPlayer.play()
        this.slideText.addLine('This is a node link diagram.')
        this.slideText.addLine('Usually, it works just fine. ')
        // canvasPlayer.createAnimationStateButtons(d3.select('body'))
        this.continueBtn.on('click', () => {
            canvasPlayer.playNext()
        })
    }

    initializeAnimationData()
    {
        const networkData = initNetworkAnimationData(
            exampleGraph0,
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