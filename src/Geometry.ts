import {PointTransitionScale} from "./CanvasUtils";

export interface Rect {
    x: number
    y: number
    width: number
    height: number
}

export interface Dimension {
    width: number
    height: number
}

export type PointTuple = [number, number]

export class Point {
    public readonly x: number
    public readonly y: number

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    static fromTuple(t: [number, number] | PointTuple): Point
    {
        return new Point(t[0], t[1])
    }
}

export function distance(end1: Point | PointTuple, end2: Point | PointTuple)
{
    let p1 = end1
    let p2 = end2
    if (!(p1 instanceof Point))
    {
        p1 = Point.fromTuple(end1 as PointTuple)
    }
    if (!(p2 instanceof Point))
    {
        p2 = Point.fromTuple(end2 as PointTuple)
    }
    let distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    return distance
}

export function midpoint(p1: Point, p2: Point)
{
    let x = p1.x > p2.x ? p2.x + (p1.x - p2.x) / 2 : p1.x + (p2.x - p1.x) / 2
    let y = p1.y > p2.y ? p2.y + (p1.y - p2.y) / 2 : p1.y + (p2.y - p1.y) / 2
    return new Point(x, y)
}

/**
 * See: [Find points at a given distance on a line of given slope](https://www.geeksforgeeks.org/find-points-at-a-given-distance-on-a-line-of-given-slope/)
 *
 * @param endPoint1
 * @param endPoint2
 * @param distance
 */
export function controlPointPosition(endPoint1: Point, endPoint2: Point, distance: number): Point
{
    const gradientOfPerpendicular = -(endPoint2.x - endPoint1.x) / (endPoint2.y - endPoint1.y)
    const mp = midpoint(endPoint1, endPoint2)
    const dx = distance / Math.sqrt(1 + gradientOfPerpendicular * gradientOfPerpendicular)
    const x = mp.x + dx
    const y = mp.y + gradientOfPerpendicular * dx
    return new Point(x, y)
}

// const smoothControlPointFinder = (source, mid, target) => (positiveDistance: boolean) => {
//     const maxControlPoint = controlPointPosition(source, target,
//                                                  (positiveDistance ? 1 : -1) * distance(source, target) / 2)
//     const controlPointTransitionScaler =
//         new PointTransitionScale(mid.x, mid.y,
//                                  maxControlPoint.x, maxControlPoint.y,
//                                  this.duration)
//     return controlPointTransitionScaler.point(currentTick);
// }
//
//
// (source, mid, target) => (positiveDistance: boolean) => {
//     return controlPointPosition(source, target,
//                                 (positiveDistance ? 1 : -1) * distance(source, target) / 2
//     )

// ctx.ellipse(100,100, 0, Point.distance([0,0], [100, 100]), - Math.PI / 4, 0, 2* Math.PI)

export function pArc(context: CanvasRenderingContext2D | d3.Path, arcEnd1: Point, controlPoint: Point, arcEnd2: Point, radius: number)
{
    context.moveTo(arcEnd1.x, arcEnd1.y)
    // range: 0 - distance(arcEnd1, arcEnd2) / 2
    context.arcTo(controlPoint.x, controlPoint.y, arcEnd2.x, arcEnd2.y, radius)
    context.lineTo(arcEnd2.x, arcEnd2.y)
}

export function arc(context: CanvasRenderingContext2D,
                    arcEnd1: Point, controlPoint: Point, arcEnd2: Point, radius: number,
                    stroke: string = 'grey', strokeWidth: number = 1)
{
    context.beginPath()
    pArc(context, arcEnd1, controlPoint, arcEnd2, radius);
    context.lineWidth = strokeWidth
    context.strokeStyle = stroke
    context.stroke()
    context.closePath()
}

export function filledArc(context: CanvasRenderingContext2D, arcEnd1: Point, controlPoint: Point, arcEnd2: Point,
                          radius: number, offset0: number, offset1: number,
                          fill: string = 'grey') {
    const filledArcShape = new Path2D()
    filledArcShape.moveTo(arcEnd1.x, arcEnd1.y)
    // range: 0 - distance(arcEnd1, arcEnd2) / 2
    filledArcShape.arcTo(controlPoint.x, controlPoint.y, arcEnd2.x, arcEnd2.y, radius + offset0)
    filledArcShape.lineTo(arcEnd2.x, arcEnd2.y)
    filledArcShape.moveTo(arcEnd1.x, arcEnd1.y)
    // range: 0 - distance(arcEnd1, arcEnd2) / 2
    filledArcShape.arcTo(controlPoint.x, controlPoint.y, arcEnd2.x, arcEnd2.y, radius + offset1)
    filledArcShape.lineTo(arcEnd2.x, arcEnd2.y)
    filledArcShape.closePath()
    context.fillStyle = fill
    context.fill(filledArcShape, "evenodd")
}

export function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, sideLength: number, roundedPercentage) {
    const r = sideLength / 2 * roundedPercentage
    const lineLength = sideLength - r
    context.beginPath()
    context.moveTo(x + r, y)
    context.arcTo(x + sideLength, y, x + sideLength, y + r , r)
    context.arcTo(x + sideLength, y + sideLength, x + lineLength, y + sideLength, r)
    context.arcTo(x, y + sideLength, x, lineLength, r)
    context.arcTo(x, y, x + r, y, r)
    context.closePath()
}