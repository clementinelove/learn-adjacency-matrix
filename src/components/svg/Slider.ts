import {Component} from "../../UI/Component";
import {Rect} from "../../utils/structures/Geometry";
import * as d3 from "d3";
import {CanvasRuler} from "../../utils/CanvasUtils";
import {SVGComponent} from "../../UI/SVGComponent";


export interface SliderStyle {
    frame?: Rect
    buttonRadius: number
    tickCount: number
    tickLineSideLength: number
    type: SliderType
}

export enum SliderType {
    DISCRETE, SNAP, FREE
}

export class Slider extends SVGComponent {

    static padding = 10
    value: number // percentage
    style: SliderStyle

    constructor(style: SliderStyle = {
        frame: {x: 0, y: 0, width: 300, height: 50},
        buttonRadius: 10,
        tickCount: 3,
        tickLineSideLength: 4,
        type: SliderType.SNAP
    })
    {
        super(undefined, style.frame);
        style.type = SliderType.DISCRETE
        this.style = style
        this.initializeUI()
    }

    private initializeUI = () => {

        const {width, height} = this.frame
        const borderWidth = 1
        const buttonRadius = 10
        const tickCount = 3
        const tickLineSideLength = 4
        const gap = 8 // gap between control and control label
        const padding = 10
        const axisY = borderWidth + buttonRadius
        let startLabel = 'Sparse'
        let endLabel = 'Dense'
        let fontSize = 10

        const lineStartX = padding + borderWidth + buttonRadius
        const lineEndX = width - padding - borderWidth - buttonRadius

        const lineLength = lineEndX - lineStartX
        const tickLineStartY = axisY - tickLineSideLength
        const tickLineEndY = axisY + tickLineSideLength
        const tickSpacing = lineLength / (tickCount - 1)

        const textStartY = (borderWidth + buttonRadius) * 2 + gap
        this.svg.append('text')
            .text('Sparse')
            .attr('x', lineStartX)
            .attr('y', textStartY)
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'middle')
            .style('font-size', fontSize)
            .classed('font-opensans text-sm', true)

        this.svg.append('text')
            .text('Dense')
            .attr('x', lineEndX)
            .attr('y', textStartY)
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'middle')
            .style('font-size', fontSize)
            .classed('font-opensans', true)


        this.drawLine(lineStartX, axisY, lineEndX, axisY)

        const snapPoints = []
        for (let i = 0; i < tickCount; i++)
        {
            const tickX = lineStartX + i * tickSpacing
            snapPoints.push(tickX)
            this.drawLine(tickX, tickLineStartY, tickX, tickLineEndY)
        }

        const findNearestSnap = (x) => {
            const snapPoints = []
            for (let i = 0; i < tickCount; i++)
            {
                const tickX = lineStartX + i * tickSpacing
                snapPoints.push(tickX)
            }
            // until next distance > last distance => return last snap
            let lastDistance = null
            let lastSnap = null
            for (let i = 0; i < tickCount; i++)
            {
                const snap = snapPoints[i]
                const distance = Math.abs(x - snap)
                if (lastDistance === null)
                {
                    lastDistance = distance
                    lastSnap = snap
                }
                else if (distance > lastDistance)
                {
                    return lastSnap
                }
                else
                {
                    lastDistance = distance
                    lastSnap = snap
                }
            }
            return lastSnap
        }

        this.svg.append('line')
            .attr('x1', lineStartX)
            .attr('y1', axisY)
            .attr('x2', lineEndX)
            .attr('y2', axisY)
            .attr('stroke', 'black')

        this.svg.append('circle')
            .attr('id', 'sliderButton')
            .attr('cx', lineStartX)
            .attr('cy', axisY)
            .attr('r', 10)
            .style('fill', 'white')
            .style('stroke', 'black')
            .attr('cursor', 'grab')
            .call(d3.drag()
                    .on('start', () => {
                        d3.select('#sliderButton')
                            // .attr('cx',event.x)
                          .attr('cursor', 'grabbing')
                    })
                    .on('drag', (event) => {
                        let x = event.x
                        if (x >= lineStartX && x <= lineEndX)
                        {
                            let newCX
                            switch (this.style.type)
                            {
                                case SliderType.SNAP:
                                    newCX = x
                                    break
                                case SliderType.FREE:
                                    newCX = x
                                    break
                                case SliderType.DISCRETE:
                                    newCX = findNearestSnap(x)
                                    break
                            }

                            d3.select('#sliderButton')
                              .attr('cx', newCX)
                              .attr('cursor', 'grabbing')
                        }

                    })
                    .on('end', (e) => {

                        let newCX
                        switch (this.style.type)
                        {
                            case SliderType.FREE:
                                newCX = e.x
                                break
                            case SliderType.SNAP:
                                newCX = findNearestSnap(e.x)
                                break
                            case SliderType.DISCRETE:
                                newCX = findNearestSnap(e.x)
                                break
                        }

                        d3.select('#sliderButton')
                          .attr('cx', findNearestSnap(e.x))
                          .attr('cursor', 'grab')
                    })
            )
    }

    drawLine = (x1, y1, x2, y2) => {
        this.svg.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', 'black')
    }


}