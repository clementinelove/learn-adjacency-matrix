import {ViewController} from "../UI/ViewController";
import {StackView} from "../UI/StackView";
import {AdjacencyMatrix, MatrixStyle} from "../components/svg/AdjacencyMatrix";
import {LayoutConstraint} from "../UI/LayoutConstraint";
import {examples} from "../data/NetworkExamples";
import {Button} from "../UI/Button";
import {UndirectedGraph} from "../utils/structures/UndirectedGraph";
import {Label} from "../UI/Label";
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;
import HoverLabelEffect = AdjacencyMatrix.HoverLabelEffect;
import HoverCellEffect = AdjacencyMatrix.HoverCellEffect;
import {NodeLinkDiagram} from "../components/svg/NodeLinkDiagram";

export class FreePlayController extends ViewController {

    mainContainer: StackView
    examplesMenu: StackView
    adjacencyMatrix: AdjacencyMatrix
    nodeLinkDiagram: NodeLinkDiagram

    constructor()
    {
        super('freePlay');

        this.mainContainer = this.allocate(new StackView())
        this.view.add(this.mainContainer)
        const matrixDetailContainer = this.allocate(new StackView(Axis.Horizontal))
        matrixDetailContainer.assignClass('my-4')

        const matrixInfoContainer = this.allocate(new StackView(Axis.Vertical, Alignment.Leading))
        matrixInfoContainer.assignClass('space-y-2 w-3/4')
        const nameLabel = this.allocate(new Label(''))
        nameLabel.assignClass('text-2xl font-black')
        const descriptionLabel = this.allocate(new Label(''))
        const entityLabel = this.allocate(new Label(''))
        entityLabel.assignClass('capitalize')
        const relationshipLabel = this.allocate(new Label(''))
        relationshipLabel.assignClass('capitalize')
        matrixInfoContainer.addAll(nameLabel, descriptionLabel, entityLabel, relationshipLabel)

        const showExample = (i) => {
            const example = examples[i]
            this.adjacencyMatrix.graph = UndirectedGraph.fromTuples(example.vertices, example.edges)
            nameLabel.text = example.name
            descriptionLabel.text = example.description
            entityLabel.text = `<b>Node Name</b>: ${example.entityName}`
            relationshipLabel.text = `<b>Relationship Name</b>: ${example.relationshipName}`
        }

        const examplesLabel = this.allocate(new Label('EXAMPLES'))
        examplesLabel.assignClass('mb-4 tracking-widest uppercase text-gray-400')

        this.examplesMenu = this.allocate(new StackView(Axis.Horizontal))
        this.examplesMenu.assignClass('space-x-8')
        examples.forEach((example, i) => {
            const exampleButton = new Button(example.name)
            exampleButton.assignClass('text-gray-600 hover:text-black')
            this.examplesMenu.add(exampleButton)
            exampleButton.on('click', () => {
                showExample(i)
            })
        })

        const adjacencyMatrixStyle: MatrixStyle = {
            matrixFrame: {
                x: 30,
                y: 30,
                width: 900,
                height: 900
            },
            fontName: 'Roboto',
            spaceBetweenLabels: 10,
            fillColor: (di) => {
              if (di.filling === false) {
                  return 'white'
              }  else {
                  switch (di.filling) {
                      case null:
                          return '#000'
                      case 1:
                          return '#9CA3AF'
                      case 2:
                          return '#4B5563'
                      case 3:
                          return '#1F2937'
                      case 4:
                          return '#080c13'
                  }
              }
            },
            padding: 36,
            hideLabel: false,
            hoverLabelEffect: HoverLabelEffect.HighlightSymmetric,
            hoverCellEffect: HoverCellEffect.HighlightSymmetric,
            toggleableCell: false,
            highlightColor: '#fc6b94',
            allowSelfLinks: false,
        }


        this.adjacencyMatrix = this.allocate(new AdjacencyMatrix(adjacencyMatrixStyle))
        this.adjacencyMatrix.assignClass('w-3/4')

        const autoReorder = this.allocate(new Button('Auto Reorder The Matrix'))
        autoReorder.assignClass('mt-8 bg-blue-500 text-gray-50 rounded-md px-6 py-1.5 hover:bg-blue-400 transition')
        autoReorder.on('click', () => this.adjacencyMatrix.autoReorderLabels(true))

        matrixInfoContainer.add(autoReorder)

        matrixDetailContainer.addAll(this.adjacencyMatrix, matrixInfoContainer)


        const attributionLabel = this.allocate(new Label('These dataset were selected from <a href="http://konect.cc/" class="underline text-blue-400" target="_blank">the KONECT Project</a>. <br/> If you are interested in other network datasets, go and take a look there.'))

        attributionLabel.assignClass('text-gray-400 text-center')

        this.mainContainer.addAll(examplesLabel, this.examplesMenu, matrixDetailContainer, attributionLabel)
        showExample(0)
    }
}