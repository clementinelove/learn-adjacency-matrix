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

export const intro : string[][] = [
    ['This is a node-link diagram. Usually, it works fine.'],
    ['But once the dataset gets bigger, occlusion and link crossings start to appear.'],
    ['This is where adjacency matrix can help.'],
    ['It is symmetric.'],
    ['With each filled cell representing an existing relationship.'],
    ['That said, if we wish to learn more from the matrix, it\'d be helpful to know some common pattern.']
]

export const reordering : string[][] = [
    ['Sometimes, these patterns won’t show up in the matrix.'],
    ['But that’s not the end of it. What we can do is to reorder them.'],
    ['Either manually, or use some algorithms.'],
    ['Try drag the labels of the matrix above to form up a block pattern.']
]

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