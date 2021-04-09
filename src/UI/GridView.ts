import {Component} from "./Component";

export class GridView extends Component {

    selectorPrefix = 'GridView'

    constructor(rowCount: number, colCount: number)
    {
        super();
        this.assignClass(`grid grid-rows-${rowCount} grid-cols-${colCount}`)
    }
}