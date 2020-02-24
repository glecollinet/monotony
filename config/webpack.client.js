const path = require('path');
const webpack = require('webpack');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const log = require('../lib/logger.js');

module.exports = (env, dirs, paths = {}) => {
	const isProd = env && !!env.production;
	const isSSR = env && env.platform === 'node';

	return {
		name: 'client side rendering',

		target: 'web',

		entry: {
			client: [
				dirs.node_modules('react-hot-loader/patch'),
				dirs.cwd() === dirs.project() ? dirs.cwd('./examples/default_client.js') : dirs.project('monotony.client.js')
			]
		},

		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: !isProd
							}
						},
						{
							loader: dirs.node_modules('css-loader'),
							options: {
								sourceMap: !isProd,
								modules: true
							}
						}
					]
				},
				{
					test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: dirs.node_modules('file-loader'),
							options: {
								name: '[name].[ext]',
								outputPath: 'fonts/'
							}
						}
					]
				}
			]
		},

		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			}
		},

		plugins: [
			new LoadablePlugin(),
			new MiniCssExtractPlugin(),
			new CopyPlugin([
				{ from: dirs.project('./src/images'), to: dirs.dist('public/app/images') },
			]),
		],

		output: {
			 path: dirs.dist('public/app/'),
			 filename: '[name].client.js',
			 chunkFilename: '[id].client.js',
			 publicPath: '/app/'
		},

		devServer: {
			contentBase: 'dist/public',
			port: 9090,
			hot: true,
			proxy: {
				'/': {
					target: 'http://localhost:3000',
					onError: (error, req, res) => res.send(`
						<!DOCTYPE html>
						<html>
							<head>
								<title>Still compiling...</title>
								<meta http-equiv="refresh" content="1">
								<style>
									html, body {padding: 0;margin: 0;}
									body {padding: 20px;text-align: center;}
									h1, h2 {font-family: arial;font-weight: normal;margin: 20px 0;}
								</style>
							</head>
							<body><h1>Still compiling...</h1><p>or something is very wrong, check your terminal</p></body>
						</html>
					`)
				}
			},
			onListening: server => {
				log.info('Listening on port:', server.listeningApp.address().port);
			},
			writeToDisk: filePath => {
				return /dist\/node\//.test(filePath) || /loadable-stats/.test(filePath)
			}
		}
	}
};
