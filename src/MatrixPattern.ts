export class MatrixPattern {

    private constructor()
    {
    }

    static readonly clique = [
        [0, 1, 1, 1, 1],
        [1, 0, 1, 1, 1],
        [1, 1, 0, 1, 1],
        [1, 1, 1, 0, 1],
        [1, 1, 1, 1, 0]
    ]

    static readonly cluster = [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0]
    ]

    static readonly selfLink = [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1]
    ]

    // static readonly path = [
    //     [1, 0, 0, 0, 0],
    //     [1, 1, 0, 0, 0],
    //     [0, 1, 1, 0, 0],
    //     [0, 0, 1, 1, 0],
    //     [0, 0, 0, 1, 1]
    // ]

    static readonly path = [
        [0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 0],
        [0, 1, 1, 0, 0]
    ]

    static readonly connector = [
        [1, 1, 0, 1, 0],
        [1, 1, 0, 0, 1],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 1, 1],
        [0, 1, 0, 1, 1]
    ]

    static readonly hub = [
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]
    ]

    static allPatterns = [
        MatrixPattern.clique,
        MatrixPattern.cluster,
        MatrixPattern.selfLink,
        MatrixPattern.path,
        MatrixPattern.connector,
        MatrixPattern.hub
    ]

}
