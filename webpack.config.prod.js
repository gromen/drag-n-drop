const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/')
        },
        client: {
            logging: 'info',
            overlay: false
        },
    },
    module:  {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}
