import * as d3 from "d3";
import {cliqueEdges, UndirectedGraph, vertexArray, VertexNameStyle} from "./UndirectedGraph";
import {flatten} from "./FP";
import {
    initNetworkAnimationData
} from "./NodeLinkCanvasAnimation";
import {CanvasAnimationPlayer, KeyedDataStore} from "./CanvasUtils";
import {NodeLinkDiagram} from "./NodeLinkDiagram";
import {MergeNodes} from "./Animations/MergeNodes";
import {GenerateLabels} from "./Animations/GenerateLabels";
import {ForceDirectedAnimation} from "./Animations/ForceDirectedAnimation";
import {NodeTrixAnimation} from "./Animations/NodeTrixAnimation";

let drawingContext = d3.select('body');

let graph = UndirectedGraph.fromRelationshipMatrix(
    UndirectedGraph.numbersToVertexArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]), [
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
    ], true)


let friendship = UndirectedGraph.fromVertexTuple(['Alex', 'Zoe', 'Alice', 'Tom', 'Susie',
                                                     'Emma', 'Zach', 'Lynn', 'Charlie', 'Joey'],
                                                 ['Alex', 'Zoe'], ['Alex', 'Alice'], ['Zoe', 'Alice'],
                                                 ['Zoe', 'Tom'], ['Charlie', 'Tom'],
                                                 ['Zach', 'Charlie'], ['Zach', 'Emma'], ['Zach', 'Lynn'],
                                                 ['Susie', 'Tom'], ['Susie', 'Emma'], ['Susie', 'Lynn']
)

let testGraph2x2 = UndirectedGraph.fromRelationshipMatrix(UndirectedGraph.numbersToVertexArray([1, 2]),
                                                          [
                                                              [0, 1],
                                                              [1, 0]
                                                          ], true
)


let testGraph4x4 = UndirectedGraph.fromRelationshipMatrix(UndirectedGraph.numbersToVertexArray([1, 2, 3, 4]),
                                                          [
                                                              [1, 0, 0, 0],
                                                              [0, 1, 0, 1],
                                                              [0, 0, 1, 1],
                                                              [0, 1, 1, 1]
                                                          ], true
)

let vArrays = vertexArray(VertexNameStyle.Numeric, 25)

// let clusterGraph = UndirectedGraph.fromVerticesAndEdges(testVertices, ...randomGraph(testVertices, false, 0.5))
let clique = UndirectedGraph
    .fromVerticesAndEdges(flatten(vArrays),
                          ...flatten(vArrays.map((arr) => cliqueEdges(arr, false).toArray())))

// let wikiVertices = vertexArray(5)
// let am = new AdjacencyMatrix(friendship);
// am.draw(drawingContext);
//
// let nodeLink = new NodeLinkDiagram(friendship)
// nodeLink.draw(drawingContext)
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
        matrixMargin: 10,
        cellStrokeColor: "lightgray"
    }
)

const keyedStore = new KeyedDataStore()
keyedStore.set("NETWORK_DATA", networkData)
//
// const nodeLinkSVG = new NodeLinkDiagram(graph)
// nodeLinkSVG.draw(drawingContext)

const nodeLinkCanvas = new CanvasAnimationPlayer(
    {x: 0, y: 0, width: 500, height: 500},
    new ForceDirectedAnimation(networkData),
    new NodeTrixAnimation(networkData, 100),
    new GenerateLabels(networkData, 100),
    new MergeNodes(networkData, 100)
)

nodeLinkCanvas.draw(drawingContext)
nodeLinkCanvas.createAnimationStateButtons(drawingContext)