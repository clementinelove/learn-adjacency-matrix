import {Component} from "./Component";
import {Dimension} from "../utils/structures/Geometry";

export class Video extends Component {

    readonly source: string

    constructor(source: string, autoplay: boolean = false, dimension: Dimension = null)
    {
        super();
        this.source = source
        const video = this.view
                          .append('video')
                          .property("controls", true)
                          .property("autoplay", autoplay ? true : null)

        if (dimension)
        {
            video.attr('width', dimension.width)
                 .attr('height', dimension.height)
        }

        const videoSource = video.append('source')
                                 .attr('src', source)
                                 .attr('type', "video/mp4")
    }
}