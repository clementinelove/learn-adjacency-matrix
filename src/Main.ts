import * as d3 from "d3";
import {cliqueEdges, UndirectedGraph, vertexArray, VertexNameStyle} from "./UndirectedGraph";
import {flatten} from "./FP";
import "./styles/main.css"
import {AdjacencyMatrix, MatrixStyle} from "./AdjacencyMatrix";
import {initNetworkAnimationData} from "./animations/NetworkAnimationData";
import {OrderedLabels} from "./OrderedLabels";
import {MatrixPattern} from "./MatrixPattern";
import {MatrixView} from "./components/svg/MatrixView";
import {Slider} from "./components/svg/Slider";
import {CanvasAnimationPlayer} from "./components/CanvasAnimationPlayer";
import {HomeController} from "./controller/HomeController";
import {App} from "./App";
import {ContentReaderController} from "./controller/ContentReaderController";
import {NavigationMenuController} from "./controller/NavigationMenuController";
import {pagesData} from "./Data/Pages";

/*
let graph = UndirectedGraph.fromMatrix([
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


let friendship = UndirectedGraph.fromTuples(['Alex', 'Zoe', 'Alice', 'Tom', 'Susie',
                                                'Emma', 'Zach', 'Lynn', 'Charlie', 'Joey'],
                                            ['Alex', 'Zoe'], ['Alex', 'Alice'], ['Zoe', 'Alice'],
                                            ['Zoe', 'Tom'], ['Charlie', 'Tom'],
                                            ['Zach', 'Charlie'], ['Zach', 'Emma'], ['Zach', 'Lynn'],
                                            ['Susie', 'Tom'], ['Susie', 'Emma'], ['Susie', 'Lynn']
)

let testGraph2x2 = UndirectedGraph.fromMatrix([
                                                  [0, 1],
                                                  [1, 0]
                                              ], OrderedLabels.numeric)


let testGraph4x4 = UndirectedGraph.fromMatrix([
                                                  [1, 0, 0, 0],
                                                  [0, 1, 0, 1],
                                                  [0, 0, 1, 1],
                                                  [0, 1, 1, 1]
                                              ], OrderedLabels.numeric)

let vArrays = vertexArray(VertexNameStyle.Numeric, 25)

// let clusterGraph = UndirectedGraph.fromVerticesAndEdges(testVertices, ...randomGraph(testVertices, false, 0.5))
let clique = UndirectedGraph
    .fromEdges(flatten(vArrays),
               ...flatten(vArrays.map((arr) => cliqueEdges(arr, false).toArray())))

// let wikiVertices = vertexArray(5)

// let nodeLink = new NodeLinkDiagram(friendship)
// nodeLink.draw(body)
const networkData = initNetworkAnimationData(
    graph,
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
    interactiveCell: false,
    cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
}

// let am = new AdjacencyMatrix(friendship, coverMatrixStyle);
// // am.draw(d3.select('#cover-matrix'));
// am.draw(d3.select('#matrix'));

//
// const nodeLinkCanvas = new CanvasAnimationPlayer(
//     {x: 0, y: 0, width: 1000, height: 1000},
//     new ForceDirectedAnimation(networkData),
//     new NodeTrixAnimation(networkData, 100),
//     new GenerateLabels(networkData, 100),
//     new MergeNodes(networkData, 100)
// )
//
// const visbox = d3.select('#vis-box')
// nodeLinkCanvas.draw(visbox)
// nodeLinkCanvas.createAnimationStateButtons(body)

const patternButtonStyle: MatrixStyle = {
    frame: {
        x: 0,
        y: 0,
        width: 50,
        height: 50
    },
    fontName: 'monospace',
    spaceBetweenLabels: 10,
    padding: 36,
    hideLabel: true,
    interactiveCell: false,
    cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
}


const patternExampleStyle: MatrixStyle = {
    frame: {
        x: 0,
        y: 0,
        width: 400,
        height: 400
    },
    fontName: 'monospace',
    spaceBetweenLabels: 10,
    padding: 36,
    hideLabel: true,
    interactiveCell: false,
    cellSizeToFontSize: (cellSize) => 0.001 * cellSize * cellSize + 0.17 * cellSize + 4.3
}

const matrixPatternExample = d3.select("#matrix-pattern-example")
const patternList = d3.select("#pattern-list")
const matrixControls = d3.select("#matrix-controls")
for (const pattern of MatrixPattern.allPatterns)
{
    const patternButton = new MatrixView(patternButtonStyle, pattern)
    patternButton.addTo(patternList)
    patternButton.assignClass('opacity-40 hover:opacity-100 mr-4 cursor-pointer')
}

let cliquePattern = new MatrixView(patternExampleStyle, [
    [1,1,1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,1,1,1,1,1,1,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,0,1,1,1],
], [
    [1,1,1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
]);

cliquePattern.addTo(matrixPatternExample);

cliquePattern.setHighlight(true)

let slider = new Slider()
slider.addTo(matrixControls)
*/

const app = new App(new ContentReaderController())
app.navigationController = new NavigationMenuController(pagesData)