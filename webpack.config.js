var webpack = require('webpack');

const path = require('path');

var JS_SOURCE = [
					"./src/js/app.js",
					"./src/js/odometer.min.js"
			   ]

module.exports = {
	entry: JS_SOURCE,
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist/js')
	},
	plugins:[
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			})
	]
}
