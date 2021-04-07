export function flatten<T>(arr: Array<T | T[]>)
{
    let flatten: T[] = Array()
    for (let i = 0; i < arr.length; i++)
    {
        if (Array.isArray(arr[i]))
        {
            let subArr = arr[i] as Array<T>
            if (subArr.length !== 0)
            {
                flatten = flatten.concat(arr[i] as Array<T>)
            }
        }
        else
        {
            flatten.push(arr[i] as T)
        }
    }
    return flatten
}

export function andmap<T>(predicate: (v: T, index: number)=> boolean, arr: Array<T>) {
    let result: boolean = null
    arr.forEach((v, i) => {
        if (result === null) {
            result = predicate(v, i)
        } else {
            result = predicate(v, i) && result
            if (result === false) {
                return false
            }
        }
    })
    return result
}

export function ormap<T>(predicate: (v: T)=> boolean, arr: Array<T>) {
    let result: boolean = null
    arr.forEach((v) => {
        if (result === null) {
            result = predicate(v)
        } else {
            result = predicate(v) || result
        }
    })
    return result
}