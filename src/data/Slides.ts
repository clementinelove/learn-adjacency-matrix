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

export class SlideTextIterator {
    currentIndex = 0
    slides

    constructor(slides, startIndex = 0)
    {
        this.slides = slides
        this.currentIndex = startIndex;
    }

    current() {
        return this.slides[this.currentIndex]
    }

    of(i: number) {
        return this.slides[i]
    }

    next() {
        if (this.currentIndex + 1 < this.slides.length) {
            this.currentIndex = this.currentIndex + 1
            return this.slides[this.currentIndex]
        }
    }
}