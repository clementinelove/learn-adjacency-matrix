import * as d3 from "d3";
import {Point, Rect} from "./Geometry";

export function createCanvas(width, height): CanvasRenderingContext2D
{
    let canvas: HTMLCanvasElement = d3.select('body')
                                      .append('canvas')
                                      .attr('width', width)
                                      .attr('height', height)
                                      .node()
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    return ctx
}

export namespace CanvasRuler {

    let context: CanvasRenderingContext2D =
        document.createElement('canvas').getContext('2d')

    export function getTextMetrics(text: string, fontName: string, fontSizeInPX: number)
    {
        context.font = `${fontSizeInPX}px ${fontName}`
        return context.measureText(text)
    }
}

/**
 * > This function takes a canvas, context, width and height. It scales both the
 * canvas and the context in such a way that everything you draw will be as
 * sharp as possible for the device.
 *
 * Adapted from the gist [here](https://gist.github.com/callumlocke/cc258a193839691f60dd)
 */


export function scaleCanvas(context, width, height)
{
    const canvas = context.canvas
    // assume the device pixel ratio is 1 if the browser doesn't specify it
    const devicePixelRatio = window.devicePixelRatio || 1;

    // determine the 'backing store ratio' of the canvas context
    const backingStoreRatio = (
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1
    );

    // determine the actual ratio we want to draw at
    const ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio)
    {
        // set the 'real' canvas size to the higher width/height
        canvas.width = width * ratio;
        canvas.height = height * ratio;

        // ...then scale it back down with CSS
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }
    else
    {
        // this is a normal 1:1 device; just scale it simply
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '';
        canvas.style.height = '';
    }

    // scale the drawing context so everything will work at the higher ratio
    context.scale(ratio, ratio);
}

export class Ticker {
    private init: number
    private t: number

    constructor(initValue: number)
    {
        this.init = initValue
        this.t = initValue;
    }

    get tick()
    {
        return this.t
    }

    increment(i: number = 1)
    {
        this.t = this.t + i
    }

    reset()
    {
        this.t = this.init
    }
}


/**
 * A `TransitionScale` helps to create point value transitions for animation purposes.
 */
export class PointTransitionScale {
    private readonly xScale: d3.ScaleLinear<number, number, never>
    private readonly yScale: d3.ScaleLinear<number, number, never>

    constructor(fromX: number, fromY: number, toX: number, toY: number, duration: number)
    {
        // Don't modify this!: the value of d3.scaleLinear.domain(x) cannot be reused (object type)
        this.xScale = d3.scaleLinear().domain([0, duration]).range([fromX, toX])
        this.yScale = d3.scaleLinear().domain([0, duration]).range([fromY, toY])
    }

    x = (time: number) => {
        return this.xScale(time)
    }

    y = (time: number) => {
        return this.yScale(time)
    }

    point = (time: number): Point => {
        return new Point(this.x(time), this.y(time))
    }
}


export interface CanvasAnimation {
    started: boolean
    duration?: number
    ticker?: Ticker

    /**
     * Prepare will be called before the animation plays to get the data ready
     */
    prepare: () => void
    /**
     * Finish will be called before switching to another animation, allow you do clean-ups
     */
    finish: () => void

    /**
     * This function will be called in a non-ending loop, it allows you to draw on the given canvas.
     * @param context the canvas to be drawn.
     */
    play: (context: CanvasRenderingContext2D) => void
}

class KeyedDataStore {
    keyToData = new Map<string, any>()

    constructor(init: object = null)
    {
        if (init !== null)
        {
            for (const [key, value] of Object.entries(init))
            {
                this.keyToData.set(key, value)
            }
        }
    }

    get = <T>(key: string): T => {
        return this.keyToData.get(key)
    }

    set = <T>(key: string, value: T): void => {
        this.keyToData.set(key, value)
    }
}

new KeyedDataStore({simNodes: new Array<number>()})

export class CanvasAnimationPlayer {
    private readonly frame: Rect
    private _animationState: number = 0
    private animations: CanvasAnimation[] = []

    constructor(frame: Rect,
                ...animations: CanvasAnimation[])
    {
        this.frame = frame
        this.animations = animations
    }

    set animationState(number: number)
    {
        if (this.currentAnimation.started)
        {
            this.finishAnimation()
        }
        this._animationState = number
        this.prepareAnimation()
    }

    get animationState(): number
    {
        return this._animationState
    }

    get currentAnimation(): CanvasAnimation
    {
        return this.animations[this.animationState]
    }


    createAnimationStateButton = (toSelection, state: number): void => {
        toSelection
            .append('button')
            .attr('type', 'button')
            .text(`State ${state}`)
            .on('click', () => this.animationState = state)
    }

    createAnimationStateButtons = (toSelection, callback: () => void = null): void => {
        this.animations.forEach((v, i) => {
            toSelection
                .append('button')
                .attr('type', 'button')
                .text(`State ${i}`)
                .on('click', () => {
                    this.animationState = i
                    if (callback !== null)
                    {
                        callback()
                    }
                })
        })
    }

    draw = (parent) => {
        const {width, height} = this.frame
        const context = createCanvas(width, height)
        scaleCanvas(context, width, height)
        this.animationState = 0
        window.requestAnimationFrame(this.redraw(context))
    }

    prepareAnimation = (): void => {
        const anime = this.animations[this.animationState]
        anime.prepare()
    }

    finishAnimation = (): void => {
        this.animations[this.animationState].finish()
    }

    private redraw = (context: CanvasRenderingContext2D) => {

        const {width, height} = this.frame

        const loop = () => {
            // canvas redraw function here
            context.clearRect(0, 0, width, height)
            this.animations[this.animationState].play(context)
            window.requestAnimationFrame(loop)
        }

        return loop
    }
}