const path = require('path');

module.exports = {
    entry: {
        main: './app'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-react-jsx', {pragma: 'createElement'}]]
                    }
                }
            }
        ]
    },
    mode: 'development',
    optimization: {
        minimize: false
    }
}