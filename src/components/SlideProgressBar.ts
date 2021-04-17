import {Component} from "../UI/Component";
import {Label} from "../UI/Label";

export class SlideProgressBar extends Component {

    buttonSideLength: number = 8
    borderWidth: number = 1
    borderRadius: number = 2
    buttonSpacing: number = 12

    currentSlideIndex: number
    totalSlideCount: number

    progressLabel: Label
    slideSelectionControl: d3.Selection<SVGElement, any, any, any>
    private _delegate: SlideProgressDelegate

    private mainTone = '#7B7B80'
    private secondaryTone = '#C3C3C7'
    private

    set delegate(value: SlideProgressDelegate)
    {
        this._delegate = value;
        this.totalSlideCount = value.text.length
        this.currentSlideIndex = 0

    }

    constructor()
    {
        super();
    }

    render()
    {
        this.view.classed('mb-4 flex flex-col items-start', true)
        this.progressLabel = new Label('')
        this.progressLabel.assignClass('tracking-widest font-roboto font-light')
        this.progressLabel.color = this.mainTone
        this.add(this.progressLabel)
        const [width, height] = [
            this.totalSlideCount * (this.buttonSideLength + this.borderWidth) + (this.totalSlideCount - 1) * this.buttonSpacing,
            this.buttonSideLength + 2 * this.borderWidth
        ]
        this.slideSelectionControl = this.view.append('svg')
                                         .attr('viewBox', `0 0 ${width} ${height}`)
                                         .style('width', width)

        this.joinButtons()

        this.updateCurrentSelection(this.currentSlideIndex)
    }

    updateCurrentSelection = (newSelection: number) => {
        this.currentSlideIndex = newSelection
        this.progressLabel.text = `${newSelection + 1} / ${this.totalSlideCount}`
        this.joinButtons()
    }

    joinButtons = () => {
        const indexes = Array<number>(this.totalSlideCount)
        for (let i = 0; i < this.totalSlideCount; i++)
        {
            indexes[i] = i
        }
        this.slideSelectionControl.selectAll('rect')
            .data(indexes)
            .join((enter) =>
                      enter.append('rect')
                           .attr('width', this.buttonSideLength)
                           .attr('height', this.buttonSideLength)
                           .attr('x', (d, i) => this.borderWidth + i * this.buttonSideLength + i * this.buttonSpacing)
                           .attr('y', this.borderWidth)
                           .attr('rx', this.borderRadius)
                           .style('fill', (d) => d === this.currentSlideIndex ? this.mainTone : 'white')
                           .style('stroke-width', this.borderWidth)
                           .style('cursor', 'pointer')
                           .on('click', (event, slideIndex) => {
                               console.log(slideIndex)
                               this._delegate.playSlide(slideIndex)
                               this.updateCurrentSelection(slideIndex)
                           }),
                  (update) =>
                      update
                          .style('fill', (d) => d === this.currentSlideIndex ? this.mainTone : this.secondaryTone)
            )
    }

    update
}

export interface SlideProgressDelegate {
    text: ((self) => string[])[]
    playSlide: (i) => void
}