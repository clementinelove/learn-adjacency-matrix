import {colorBrush} from "./Utils";
import {Edge} from "./structures/UndirectedGraph";
import {Vertex} from "../data/animations/network/GenerateLabels";

type Cell = [number, number]
type Area = [Cell, Cell]
export namespace Highlight {

    export const mainHighlightColor = '#6ebbff'
    export const secondaryHighlightColor = '#e29905'

    export interface LabelHighlight {
        indexes: number[]
        color?: string
    }

    export interface NodeHighlight {
        vertices: Vertex[]
        color?: string
    }

    export interface NodeLinkHighlight {
        vertices: Vertex[]
        color?: string
    }

    export interface LinkHighlight {
        edges: Edge[]
        color?: string
    }

    export const label = (index: number, color = mainHighlightColor) => {
        return [index, color]
    }

    export const area = (area: Area,
                         highlightFilledOnly: boolean = true,
                         oneByOne: boolean = false,
                         color: string = mainHighlightColor) => {
        return new AreaHighlight([area], false, oneByOne, highlightFilledOnly, color)
    }

    export const areas = (areas: Area[],
                          union: boolean = true,
                          highlightFilledOnly: boolean = true,
                          oneByOne: boolean = false, color: string = mainHighlightColor) => {
        return new AreaHighlight(areas, union, oneByOne, highlightFilledOnly, color)
    }

    export const cells = (cells: Cell[],
                          oneByOne: boolean = false,
                          color: string = mainHighlightColor) => {
        return new CellGroupHighlight(cells, oneByOne, color)
    }

    export const cell = (cell: Cell,
                         oneByOne: boolean = false,
                         color: string = mainHighlightColor) => {
        return new CellGroupHighlight([cell], oneByOne, color)
    }

    export const main = colorBrush(mainHighlightColor)
    export const secondary = colorBrush(secondaryHighlightColor)

    export class AreaHighlight {

        private _areas: Area[]
        private _color: string
        private _highlightFilledOnly: boolean
        private _isOneByOne: boolean
        private _isReverse: boolean
        _exceptions: Cell[] = []
        private _duration: number = 500
        private _delay: number = 50
        private _union: boolean


        get union(): boolean
        {
            return this._union;
        }

        get isOneByOne(): boolean
        {
            return this._isOneByOne;
        }

        get isReverse(): boolean
        {
            return this._isReverse;
        }

        get exceptions(): Cell[]
        {
            return this._exceptions
        }

        get areas(): Area[]
        {
            return this._areas;
        }

        get color(): string
        {
            return this._color;
        }

        get highlightFilledOnly(): boolean
        {
            return this._highlightFilledOnly;
        }


        get duration(): number
        {
            return this._duration;
        }

        get delay(): number
        {
            return this._delay;
        }

        constructor(areas: Area[],
                    union: boolean = true,
                    oneByOne: boolean,
                    highlightFilledOnly: boolean = true, color: string = 'blue')
        {
            this._areas = areas
            this._union = union
            this._isOneByOne = oneByOne
            this._highlightFilledOnly = highlightFilledOnly
            this._color = color
        }

        animateOneByOne(v: boolean, reverseDirection: boolean = false): AreaHighlight
        {
            this._isOneByOne = v
            this._isReverse = reverseDirection
            return this
        }

        highlightColor(color: string): AreaHighlight
        {
            this._color = color
            return this
        }

        animateDuration(duration: number)
        {
            this._duration = duration
            return this
        }

        animateDelay(delay: number)
        {
            this._delay = delay
            return this
        }

        except(...cells: Cell[]): AreaHighlight
        {
            this._exceptions = cells
            return this
        }
    }

    export class CellGroupHighlight {
        readonly cells: Cell[]
        readonly color: string
        readonly oneByOne: boolean

        constructor(cells: Cell[], oneByOne: boolean = false, color: string)
        {
            this.cells = cells;
            this.color = color;
            this.oneByOne = oneByOne;
        }
    }

}