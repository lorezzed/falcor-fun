module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
        // loader: ['babel-loader']
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' , query: { presets: ['react']}},
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};