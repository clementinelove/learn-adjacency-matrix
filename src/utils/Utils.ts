// In place shuffle.
// See https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm

export function shuffled<T>(array: Array<T>): Array<T>
{
    let clone = array.slice()
    for (var i = clone.length - 1; i > 0; i--)
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = clone[i];
        clone[i] = clone[j];
        clone[j] = temp;
    }
    return clone
}

export function sumOfArithmeticSequence(start: number, difference: number, count: number)
{
    let end = start + (count - 1) * difference
    let sum = (count * (start + end)) / 2
    return sum
}

type Bound = number

export class Range implements Iterable<number> {

    readonly lowerBound: Bound
    readonly upperBound: Bound
    readonly isClosed: boolean

    private constructor(lowerBound: Bound, upperBound: Bound, isClosed: boolean)
    {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.isClosed = isClosed;
    }

    [Symbol.iterator](): Iterator<Bound>
    {
        return new RangeIterator(this)
    }

    // lowerBound ... upperBound
    static closed(lowerBound: Bound, upperBound: Bound)
    {
        this.validBounds(lowerBound, upperBound)
        return new Range(lowerBound, upperBound, true)
    }

    // lowerBound ..< upperBound
    static halfOpen(lowerBound: Bound, upperBound: Bound)
    {
        this.validBounds(lowerBound, upperBound)
        return new Range(lowerBound, upperBound, false)
    }

    private static validBounds(lowerBound: Bound, upperBound: Bound)
    {
        // todo check bounds should be integer
        return upperBound > lowerBound
    }

}

class RangeIterator implements Iterator<Bound> {
    private counter: Bound
    private range: Range

    constructor(range: Range)
    {
        this.range = range;
        this.counter = this.range.lowerBound
    }

    public next(): { done: boolean, value: number }
    {

        let done: boolean = null
        if (this.range.isClosed)
        {
            done = (this.counter === this.range.upperBound);
        }
        else
        {
            done = (this.counter === this.range.upperBound - 1);
        }

        let returnedValue = {
            done: done,
            value: this.counter
        }

        this.counter = this.counter + 1

        return returnedValue
    }
}

export interface Equatable<T> {
    equals(anotherValue: T): boolean
}

export function replaceUndefinedWithDefaultValues<T extends object>(obj: T, defaultValueObj: T) : T {
    let objWithDefault : T = Object()
    for (const key in defaultValueObj) {
        objWithDefault[key] = defaultValueObj[key]
        // if (obj[key] === undefined) {
        //     objWithDefault[key] = defaultValueObj[key]
        // } else {
        //     objWithDefault[key] = obj[key]
        // }
    }
    for (const key in obj) {
        objWithDefault[key] = obj[key]
    }
    return objWithDefault
}

export const colorBrush = (color: string) : ((string) => string) => {
    return (html: string) => {
        return `<span style="color: ${color}">${html}</span>`
    }
}