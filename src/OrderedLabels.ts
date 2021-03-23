import {Vertex} from "./animations/GenerateLabels";

const charCodeOfLowercaseA = 'a'.charCodeAt(0)
const charCodeOfUppercaseA = 'A'.charCodeAt(0)

export class OrderedLabels {
    public readonly vertexAt: (index: number) => string

    private constructor(vertexAt: (index: number) => string)
    {
        this.vertexAt = vertexAt;
    }

    public labelArray = (length: number) => {
        const newArray = new Array<string>(length)
        for (let i = 0; i < length; i++)
        {
            newArray[i] = this.vertexAt(i)
        }
        return newArray
    }

    static manual = (array: Array<Vertex>): OrderedLabels => {
        return new OrderedLabels((i) => array[i])
    }

    static numeric: OrderedLabels = new OrderedLabels((i) => `${i + 1}`)
    static alphabeticLowercase = new OrderedLabels((i) => String.fromCharCode(charCodeOfLowercaseA + i))
    static alphabeticUppercase = new OrderedLabels((i) => String.fromCharCode(charCodeOfUppercaseA + i))
}
