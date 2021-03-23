import * as d3 from "d3";
import {Component} from "./Component";
import {App} from "../App";


export class ViewController {

    navigation: App = null
    id: string // the id of the dom
    protected dom: Component
    allocated: Component[] = []

    constructor(id: string)
    {
        this.id = id;
        this.dom = new Component(id)
        this.hide(true)
    }

    allocate<T extends Component>(component: T) : T {
        this.allocated.push(component)
        return component
    }

    deallocateAll() {
        for (const component of this.allocated)
        {
            component.deallocate()
        }
    }

    hide(v: boolean) {
        this.dom.toggleClass('hidden', v)
    }

    find(id: string) {
        return this.dom.find(id)
    }
}