import {ViewController} from "../UI/ViewController";
import {Component} from "../UI/Component";
import {MatrixStyle} from "../components/svg/AdjacencyMatrix";
import {Data} from "../data/Data";
import {MatrixView} from "../components/svg/MatrixView";
import {StackView} from "../UI/StackView";
import {LayoutConstraint} from "../UI/LayoutConstraint";
import {Label} from "../UI/Label";
import Alignment = StackView.Alignment;
import Axis = LayoutConstraint.Axis;

const xsPatternStyle: MatrixStyle = {
    matrixFrame: {
        x: 0,
        y: 0,
        width: 60,
        height: 60
    },
    fontName: 'monospace',
    hideLabel: true,
    toggableCell: false
}

const xxlPatternStyle: MatrixStyle = {
    matrixFrame: {
        x: 0,
        y: 0,
        width: 500,
        height: 500
    },
    fontName: 'monospace',
    hideLabel: true,
    toggableCell: true
}

export class PatternViewer extends ViewController {

    patternNameLabel = (() => {
        const label = this.allocate(new Label('Name'))
        label.assignClass('text-5xl font-frank')
        return label
    })()
    patternShapeLabel = (() => {
        const label = this.allocate(new Label('Shape'))
        label.assignClass('uppercase font-cantarell')
        return label
    })()
    patternDescriptionLabel = (() => {
        const label = this.allocate(new Label('Description'))
        label.assignClass('my-2 text-2xl')
        return label
    })()
    // patternInfoContainer = (() => {
    //     const container = new StackView()
    //     container.alignment = Alignment.Leading
    //     container.axis = Axis.Vertical
    //
    //     container.addAll(this.patternNameLabel, this.patternShapeLabel, this.patternDescriptionLabel)
    // })()

    patternInfoContainer = (() => {
        const div = new Component('infoContainer')
        const container = new StackView()
        container.alignment = Alignment.Leading
        container.axis = Axis.Vertical
        div.add(container)

        container.addAll(
            this.patternShapeLabel,
            this.patternNameLabel,
            this.patternDescriptionLabel
        )
        return container
    })()

    matrixViewer = (() => {
        const matrix = this.allocate(new MatrixView(xxlPatternStyle))
        return matrix
    })()

    matrixExample = (() => {
        const matrixContainer = new Component('matrixExample')
        return matrixContainer.add(this.matrixViewer)
    })()


    patternList = (() => {
        const patternList = new Component('patternList')

        const showPattern = (pattern) => {
            this.matrixViewer.matrix = pattern.instances[0]
            this.patternNameLabel.text = pattern.name
            this.patternShapeLabel.text = pattern.shape
            this.patternDescriptionLabel.text = pattern.description
            selectedPattern = pattern

            // play animation

            this.matrixViewer.stopAnimation()

            if (pattern.areaHighlights !== undefined)
            {
                pattern.areaHighlights.forEach((hl) => this.matrixViewer.highlightRectAreas(hl)
                )
            }

            if (pattern.cellGroupHighlights !== undefined)
            {
                pattern.cellGroupHighlights.forEach((hl) => {
                    this.matrixViewer.highlightCells(hl)
                })
            }
        }

        let selectedPattern = Data.MatrixPatterns.allPatterns[0]

        Data.MatrixPatterns.allPatterns.forEach((pattern) => {

            const patternButton = this.allocate(new MatrixView(xsPatternStyle, pattern.typicalExample))
            patternButton.assignClass('patternButton opacity-30 mr-2 cursor-pointer hover:opacity-100')
            if (pattern === selectedPattern)
            {
                patternButton.removeClass('opacity-30')
            }

            patternButton.on('click', () => {
                showPattern(pattern)
                patternList.view.selectAll('.patternButton').classed('opacity-30', true)
                patternButton.removeClass('opacity-30')
            })
            patternList.add(patternButton)
        })

        showPattern(selectedPattern)
        return patternList
    })()

    matrixControls = new Component('matrixControls')

    constructor()
    {
        super('patternViewer');


    }
}