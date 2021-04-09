import {Equatable} from "../Utils";

export class ObjectSet<T extends Equatable<T>> implements Iterable<T> {
    private values: T[] = []

    get size()
    {
        return this.values.length
    }

    constructor(array: T[] = [])
    {
        array.forEach((v) => {
            this.add(v)
        })
    }

    toArray = (): T[] => {
        return this.values.slice()
    }

    private indexOf = (value: T): number => {
        return this.values.findIndex((v) => v.equals(value))
    }

    has = (value: T): boolean => {
        return this.indexOf(value) !== -1
    }

    add = (newValue: T): boolean => {
        if (this.has(newValue))
        {
            // existing value
            return false
        }
        else
        {
            // new value
            this.values.push(newValue)
            return true
        }
    }

    remove = (valueToDelete: T): boolean => {
        let index = this.indexOf(valueToDelete)
        if (index !== -1)
        {
            // new value
            this.values.splice(index, 1)
            return true
        }
        else
        {
            // value doesn't exist
            return false
        }
    }


    [Symbol.iterator](): Iterator<T>
    {
        let index = 0;
        let values = this.values.slice();

        return {
            next(): IteratorResult<T>
            {
                if (index < values.length)
                {
                    const valueIndex = index
                    index = index + 1

                    return {
                        done: false,
                        value: values[valueIndex]
                    }
                }
                else
                {
                    return {
                        done: true,
                        value: null
                    }
                }
            }
        }
    }

    forEach = (f: (value: T, index: number) => void) => {
        this.values.forEach(f)
    }

}