const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = (env, dirs, paths = {}) => {
	const isProd = env && !!env.production;
	const isSSR = env && env.platform === 'node';

	return {
		name: 'server side rendering',

		target: 'node',

		externals: [nodeExternals({
			whitelist: 'monotony/lib/Server'
		})],

		entry: {
			server: dirs.cwd() === dirs.project() ? dirs.cwd('./examples/default_server.js') : dirs.project('monotony.server.js')
		},

		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						{
							loader: dirs.node_modules('css-loader'),
							options: {
								sourceMap: true,
								modules: true,
								onlyLocals: true
							}
						}
					]
				}
			]
		},

		output: {
			 path: dirs.dist('server/'),
			 filename: '[name].server.js',
			 chunkFilename: '[id].server.js',
			 publicPath: '/dist/server',
			 libraryTarget: 'commonjs2'
		},

		plugins: [
			new webpack.DefinePlugin({
				'process.env.SSR': JSON.stringify(true)
			}),
			new WriteFilePlugin({
				test: /(.+\.)?server.js$/,
			}),
			new NodemonPlugin({
				watch: dirs.dist('server/'),
				ignore: ['*.js.map', '*.client.js', '*.json', '*.html'],
				script: dirs.dist('server/server.server.js')
			})
		]
	}
};
