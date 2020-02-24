import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import Client from './Client.js';
import Server from './Server.js';

import webpackConfig from '../config/webpack.config.js';

export const start = paths => {
	const config = webpackConfig(process.env, paths);

	const compiler = Webpack(config);

	const server = new WebpackDevServer(compiler, config[0].devServer);

	server.listen(config[0].devServer.port, '127.0.0.1');
}

export const build = paths => {
	const config = webpackConfig(
		{
			...process.env,
			production: true
		}, paths
	);

	Webpack(config , (err, stats) => {
		if (err || stats.hasErrors()) {
			console.error('ERROR');
		}
		// Done processing
		console.log(stats);
	});
};

export {
	Client,
	Server
};

export default {
	start,
	build,
	Client,
	Server
};
