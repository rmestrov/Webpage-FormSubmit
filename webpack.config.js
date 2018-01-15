module.exports = {
    entry: './js/app.js',
    output: {
        filename: './dist/bundle.js'
    },
	 module: {
        loaders: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader'],
            }
        ],
    }
};