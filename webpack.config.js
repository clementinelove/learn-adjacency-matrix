const path = require('path')

module.exports = {
    entry: './src/Main.ts',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000
    },
    mode: 'development',
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.mp4$/i,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
}
