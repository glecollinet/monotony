import Server from '../src/Server.js';

import config from './default_monotony.config.js';

new Server({
	...config,
	port: 3000,
	attach: (app, log) => {
		// do anything here, you have express
		app.use('/lol', (req, res, next) => {
			log.info('LOLOL')
			return res.send('LOLOLOL');
		});

		app.use('/favicon.ico', (req, res) => {
			return res.status(404).send(' ');
		})
	}
}).start();
