import {ContentReader} from "../ContentReader";
import {SlideProgressDelegate} from "../../components/SlideProgressBar";
import {ViewController} from "../../UI/ViewController";
import {AdjacencyMatrix} from "../../components/svg/AdjacencyMatrix";

export class VariantIntro extends ViewController{

    adjacencyMatrix: AdjacencyMatrix


    constructor()
    {
        super('examples');
        this.adjacencyMatrix = this.allocate(new AdjacencyMatrix());
    }
}