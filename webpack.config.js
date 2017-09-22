const path = require('path');

module.exports = {
    entry: './src/opa.js',
    output: {
        path: path.join(__dirname, 'out'),
        filename: 'opa.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        'env',
                    ],
                    plugins: [
                        'transform-runtime',
                    ],
                },
            }
        ]
    }
};
