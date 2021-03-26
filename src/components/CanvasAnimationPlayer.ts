import {Dimension, Rect} from "../utils/structures/Geometry";
import {CanvasAnimation, createCanvas, scaleCanvas} from "../utils/CanvasUtils";
import {Component} from "../UI/Component";

export class CanvasAnimationPlayer extends Component {
    private _animationState: number = 0
    private animations: CanvasAnimation[] = []
    canvas: d3.Selection<HTMLCanvasElement, any, any, any>
    context: CanvasRenderingContext2D
    dimension: Dimension

    constructor(dimension: Dimension,
                ...animations: CanvasAnimation[])
    {
        super(null, dimension)
        this.animations = animations
        const {width, height} = this.dimension
        this.canvas = this.view.append('canvas')
                          .attr('width', width)
                          .attr('height', height)

        this.canvas.classed('mx-auto my-8 rounded-md hover:shadow-inner transition', true)
        this.context = this.canvas.node().getContext('2d')
        scaleCanvas(this.context, width, height)
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
                .append('a')
                .attr('href', '#')
                .attr('class', 'p-4 border border-gray-300 shadow-md rounded-md')
                .text(`State ${i}`)
                .on('click', () => {
                    this.animationState = i
                    console.log('Animation set to ' + i)
                    if (callback !== null)
                    {
                        callback()
                    }
                })
        })
    }

    play = () => {
        this.animationState = 0
        window.requestAnimationFrame(this.redraw(this.context))
    }

    playNext = () => {
        if (this.animationState + 1 < this.animations.length) {
            this.animationState = this.animationState + 1
            return true
        } else {
            return false
        }
    }

    prepareAnimation = (): void => {
        const anime = this.animations[this.animationState]
        anime.prepare()
    }

    finishAnimation = (): void => {
        this.animations[this.animationState].finish()
    }

    private redraw = (context: CanvasRenderingContext2D) => {

        const {width, height} = this.dimension

        const loop = () => {
            // canvas redraw function here
            context.clearRect(0, 0, width, height)
            const animation = this.animations[this.animationState]
            animation.play(context)
            if (animation.ticker.tick < animation.duration)
            {
                animation.ticker.increment()
            }
            window.requestAnimationFrame(loop)
        }

        return loop
    }


}