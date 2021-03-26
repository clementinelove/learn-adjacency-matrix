import {ViewController} from "../UI/ViewController";
import {Component} from "../UI/Component";
import {AdjacencyMatrix} from "../components/svg/AdjacencyMatrix";

export class PatternViewer extends ViewController {

    matrixExample = new Component('matrixExample')
    patternList = new Component('patternList')
    matrixControls = new Component('matrixControls')


    constructor()
    {
        super('patternViewer');

    }
}