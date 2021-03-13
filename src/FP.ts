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