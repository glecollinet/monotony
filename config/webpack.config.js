const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const merge = require('webpack-merge');

const client = require('./webpack.client.js');
const server = require('./webpack.server.js');

fs.emptyDirSync('./dist/server');
fs.emptyDirSync('./dist/public/app');

module.exports = (env, paths = {}) => {
	const prod = env && !!env.production;

	const dirs = {
		cwd: (location = '') => path.resolve(__dirname, `../${location}`),
		project: (location = '') => path.resolve(process.cwd(), location),
		node_modules(nm = '') {
			return this.project(`./node_modules/${nm}`);
		},
		dist(location = '') {
			return this.project(`./dist/${location}`);
		}
	};

	console.log(' - - - - - - - - - - - - - ');
	console.log(`Production:         ${!!prod}`);
	console.log(`Directories:`)
	Object.keys(dirs).map(dir => {
		console.log(` - ${dir}:  ${dirs[dir]()}`);
	});
	console.log(' - - - - - - - - - - - - - ');

	console.log(dirs.node_modules());

	const common = {
		mode: prod ? 'production' : 'development',

		devtool: prod ? false : 'source-map',

		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					loader: dirs.node_modules('babel-loader'),
					exclude: dirs.node_modules(),
					options: {
						plugins: [
							dirs.node_modules('@loadable/babel-plugin'),
							dirs.node_modules('react-hot-loader/babel'),
							dirs.node_modules('@babel/plugin-proposal-class-properties')
						],
						presets: [
							dirs.node_modules('@babel/preset-env'),
							dirs.node_modules('@babel/preset-react')
						]
					}
				}
			]
		},

		resolve: {
			modules: [
				dirs.node_modules(),
				dirs.project('node_modules'),
				dirs.project('src'),
				dirs.cwd('src'),
				dirs.cwd('examples'),
			].filter(Boolean),
			extensions: ['.js', '.jsx', '.css'],
			alias: {
				'react-dom': dirs.node_modules('@hot-loader/react-dom')
			}
		}
	};

	return [
		merge(common, client(env, dirs, paths)),
		merge(common, server(env, dirs, paths))
	];
};
