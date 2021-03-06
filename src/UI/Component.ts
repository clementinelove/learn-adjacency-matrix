import * as d3 from "d3";
import {Dimension} from "../utils/structures/Geometry";
import {v4 as uuid} from 'uuid';

export class Component {

    /**
     * Controls need to have prefix since uuid may start with a number
     */
    selectorPrefix = 'Component'

    readonly id: string
    readonly dimension: Dimension

    get view(): d3.Selection<any, any, any, any>
    {
        return d3.select("#" + this.id)
    }

    // if id is null or undefined, generate a new id and div
    constructor(id: string = null, dimension: Dimension = null)
    {
        if (id === null || id === undefined)
        {
            this.id = this.constructor.name + '-' + uuid()
            d3.select('body')
              .append('div')
              .attr('id', this.id)
        }
        else
        {
            this.id = id
        }

        this.dimension = dimension


        if (dimension !== null)
        {
            const {width, height} = dimension
            this.view
                .attr('width', `${width}px`)
                .attr('height', `${height}px`)
        }
        if (id === null)
        {
            this.hide(true)
        }
    }

    get node(): HTMLElement
    {
        return this.view.node()
    }

    public addTo = (parent: d3.Selection<any, any, any, any>) => {
        parent.node()
              .appendChild(this.view.node())
        this.hide(false)
    }

    find = (id: string) => {
        return this.view.select(`#${id}`)
    }

    public on = (type, listener): void => {
        this.view.on(type, listener)
    }

    public hide = (v: boolean) => {
        this.view.classed('hidden', v)
    }

    toggleClass = (str, v) => {
        this.view.classed(str, v)
    }

    public assignClass = (str) => {
        this.view.classed(str, true)
    }

    public removeClass = (str) => {
        this.view.classed(str, false)
    }

    add(component: Component)
    {
        this.node
            .appendChild(component.view.node())
        component.hide(false)
    }

    addAll(...components: Component[])
    {
        components.forEach((c) => this.add(c))
    }

    remove(component: Component = null)
    {
        component.hide(true)
        // if (component === null) {
        //     const node = this.view.node() as HTMLElement
        //     node.removeChild(node.firstChild)
        // } else {
        //     this.find(`${component.id}`)
        // }
    }

    removeAll()
    {
        this.view.selectChildren().classed('hidden', true)
    }

    deallocate()
    {
        this.view.remove()
    }
}

