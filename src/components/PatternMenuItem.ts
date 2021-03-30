import {Component} from "../UI/Component";
import {MatrixView} from "./svg/MatrixView";
import {MatrixPatternData} from "../data/Data";
import {MatrixStyle} from "./svg/AdjacencyMatrix";
import {Label} from "../UI/Label";
import {StackView} from "../UI/StackView";
import {LayoutConstraint} from "../UI/LayoutConstraint";
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;

const matrixStyle: MatrixStyle = {
    matrixFrame: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    fontName: 'monospace',
    hideLabel: true,
    toggleableCell: false
}

export class PatternMenuItem extends Component {

    matrixView : MatrixView
    patternNameLabel: Label
    container: StackView

    initializeMatrix = (pattern, size, showLabel: boolean = true) => {
        const matrix = new MatrixView({
                                          matrixFrame: {
                                              x: 0,
                                              y: 0,
                                              width: size,
                                              height: size
                                          },
                                          fontName: 'monospace',
                                          hideLabel: true,
                                          toggleableCell: false
                                      }, pattern.typicalExample)
        matrix.assignClass('transition shadow-md hover:shadow-lg')
        matrix.on('mouseover',() => {
            this.patternNameLabel.view
                .transition()
                .duration(100)
                .style('opacity', 1)
        })
        matrix.on('mouseleave', () => {
            this.patternNameLabel.view
                .transition()
                .duration(100)
                .style('opacity', 0)
        })
        this.matrixView = matrix
        if (!showLabel) {
            this.patternNameLabel.hide(true)
        }
    }

    initializePatternNameLabel = (pattern: MatrixPatternData) => {
        const label = new Label(pattern.name)
        label.assignClass('text-sm font-cantarell mb-2')
        this.patternNameLabel = label
    }

    initializeContainer = () => {
        const container = new StackView()
        container.axis = Axis.Vertical
        container.alignment = Alignment.Center
        container.addAll(this.patternNameLabel, this.matrixView)
        this.patternNameLabel.view.style('opacity', 0)
        this.add(container)
        return container
    }

    constructor(pattern: MatrixPatternData, size: number, showLabel: boolean = true)
    {
        super();

        this.initializePatternNameLabel(pattern)
        this.initializeMatrix(pattern, size, false)
        this.initializeContainer()
        if (!showLabel) {
            this.patternNameLabel.hide(true)
        }
    }


}