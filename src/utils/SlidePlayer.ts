export class SlidePlayer {
    _slideIndex = 0

    get start() {
        return 0
    }

    get currentSlide() {
        return this._slideIndex
    }

    moveTo(i: number) {
        this._slideIndex = i
    }

    get nextSlide() {
        this._slideIndex = this._slideIndex + 1
        return this._slideIndex
    }
}