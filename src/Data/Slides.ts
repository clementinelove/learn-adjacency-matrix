import {Component} from "../UI/Component";

enum MediaType {
    VIDEO,
    CANVAS_ANIMATION,
    SVG
}

interface Slide {
    text: string
    media: () => Component
}

const slides : Slide[] = [
]


