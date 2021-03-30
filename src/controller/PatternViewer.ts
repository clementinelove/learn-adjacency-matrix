import {ViewController} from "../UI/ViewController";
import {Component} from "../UI/Component";
import {AdjacencyMatrix, MatrixStyle} from "../components/svg/AdjacencyMatrix";
import {Data, MatrixPatternData} from "../data/Data";
import {MatrixView} from "../components/svg/MatrixView";
import {StackView} from "../UI/StackView";
import {LayoutConstraint} from "../UI/LayoutConstraint";
import {Label} from "../UI/Label";
import {OrderedLabels} from "../utils/structures/OrderedLabels";
import {UndirectedGraph} from "../utils/structures/UndirectedGraph";
import HoverCellEffect = AdjacencyMatrix.HoverCellEffect;
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;

const xsPatternStyle: MatrixStyle = {
    matrixFrame: {
        x: 0,
        y: 0,
        width: 60,
        height: 60
    },
    fontName: 'monospace',
    hideLabel: true,
    toggleableCell: false
}

const xxlPatternStyle: MatrixStyle = {
    matrixFrame: {
        x: 24,
        y: 24,
        width: 300,
        height: 300
    },
    fontName: 'monospace',
    hideLabel: false,
    reorderable: false,
    toggleableCell: false,
    hoverCellEffect: HoverCellEffect.HighlightRelated,
    showLabelsOnHover: true
}

export class PatternViewer extends ViewController {

    selectedPattern: MatrixPatternData

    patternNameLabel: Label
    patternShapeLabel: Label
    patternDescriptionLabel: Label
    patternInfoContainer: StackView

    matrix: AdjacencyMatrix

    mainContainer: Component


    patternList :Component

    constructor()
    {
        super('patternViewer');
        this.selectedPattern = Data.MatrixPatterns.allPatterns[0]

        this.initializeMatrix()
        this.initializeLabels()
        this.initializePatternList()
        this.mainContainer = new Component('matrixInfoContainer')
        this.mainContainer.addAll(this.matrix, this.patternInfoContainer)

        this.selectPattern(this.selectedPattern)
    }

    initializeMatrix() {
        const matrix = this.allocate(new AdjacencyMatrix(xxlPatternStyle))
        this.matrix = matrix
    }

    initializeLabels() {
        const patternNameLabel = this.allocate(new Label('Name'))
        patternNameLabel.assignClass('text-2xl font-frank')
        this.patternNameLabel = patternNameLabel

        const patternShapeLabel = this.allocate(new Label('Shape'))
        patternShapeLabel.assignClass('uppercase font-cantarell tracking-widest text-sm')
        this.patternShapeLabel = patternShapeLabel

        const patternDescriptionLabel = this.allocate(new Label('Description'))
        patternDescriptionLabel.assignClass('my-2 text-base max-w-md')
        this.patternDescriptionLabel = patternDescriptionLabel

        const patternInfoContainer = new StackView()
        patternInfoContainer.alignment = Alignment.Leading
        patternInfoContainer.axis = Axis.Vertical
        patternInfoContainer.view.classed('pb-4', true)

        patternInfoContainer.addAll(
            this.patternShapeLabel,
            this.patternNameLabel,
            this.patternDescriptionLabel
        )
        this.patternInfoContainer = patternInfoContainer
    }


    initializePatternList()
    {
        const patternList = new Component('patternList')

        Data.MatrixPatterns.allPatterns.forEach((pattern) => {

            const patternButton = this.allocate(new MatrixView(xsPatternStyle, pattern.typicalExample))
            patternButton.assignClass('patternButton opacity-30 mr-2 cursor-pointer hover:opacity-100')
            if (pattern === this.selectedPattern)
            {
                patternButton.removeClass('opacity-30')
            }

            patternButton.on('click', () => {
                this.selectPattern(pattern)
                patternList.view.selectAll('.patternButton').classed('opacity-30', true)
                patternButton.removeClass('opacity-30')
            })
            patternList.add(patternButton)
        })

        this.patternList = patternList
    }

    selectPattern = (pattern) => {
        this.matrix.graph = UndirectedGraph.fromMatrix(pattern.instances[0], OrderedLabels.numeric)
        this.selectedPattern = pattern
        this.patternNameLabel.text = pattern.name
        this.patternShapeLabel.text = pattern.shape
        this.patternDescriptionLabel.text = pattern.description

        // play animation

        this.matrix.stopAnimation()

        if (pattern.areaHighlights !== undefined)
        {
            pattern.areaHighlights.forEach((hl) => this.matrix.highlightRectAreas(hl))
        }

        if (pattern.cellGroupHighlights !== undefined)
        {
            pattern.cellGroupHighlights.forEach((hl) => {
                this.matrix.highlightCells(hl)
            })
        }
    }
}