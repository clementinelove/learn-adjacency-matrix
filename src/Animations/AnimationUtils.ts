import * as d3 from "d3";

// use currentTime/duration to get range value
export function animationScale(timeline: number | Array<any>, totalDuration: number, range: Array<any>, ease: (t: number) => number = null)
{

    const startValue = range[0]
    const endValue = range[range.length - 1]

    let scale = d3.scaleLinear()
                  .domain([0, 1])
                  .range(range)

    scale = ease === null ? scale : scale.interpolate(easeInterpolate(ease));

    if (typeof timeline === "number")
    {
        const animationDuration = timeline * totalDuration
        return (tick): number => {
            if (tick > animationDuration)
            {
                return endValue
            }
            else
            {
                return scale(tick / animationDuration)
            }
        }
    }
    else
    {
        const [animationStartPoint, animationEndPoint] = [timeline[0] * totalDuration, timeline[timeline.length - 1] * totalDuration]
        const animationDuration = animationEndPoint - animationStartPoint
        return (tick): any => {
            if (tick < animationStartPoint)
            {
                return startValue
            }
            else if (tick > animationEndPoint)
            {
                return endValue
            }
            else
            {
                const animationProgress = (tick - animationStartPoint) / animationDuration
                return scale(animationProgress)
            }
        }
    }


}


function easeInterpolate(ease)
{
    return function (a, b) {
        var i = d3.interpolate(a, b);
        return function (t) {
            return i(ease(t));
        };
    };
}

export function timelineSlices(array: number[])
{
    array.push(1)
    return array.map((timePoint, i, arr) => {
        if (i === 0)
        {
            return [0, timePoint]
        }

        else
        {
            return [arr[i - 1], timePoint]
        }
    })
}