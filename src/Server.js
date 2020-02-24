import path from 'path';
import express from 'express';
import {createElement} from 'react';
import {Provider} from 'react-redux';
import objectPath from 'object-path';
import pino from 'express-pino-logger';
import {createMemoryHistory} from 'history';
import {StaticRouter} from 'react-router-dom';
import {renderToString} from 'react-dom/server';
import {ChunkExtractor} from '@loadable/server';
import {renderRoutes, matchRoutes} from 'react-router-config';

import logger from './logger.js';
import createStore from './createStore.js';

export default class Server {
	constructor({
		name,
		attach,
		reducers,
		routes = [],
		port = 3000
	}) {
		this.name = name;
		this.attach = attach;
		this.routes = routes;
		this.reducers = reducers;
		this.port = process.env.PORT || port;

		this.log = logger;
	}

	start() {
		const app = express();

		// express logs
		app.use(pino({
			logger: this.log
		}));

		app.use('/', express.static('dist/public'));

		// give app to the parent to attached things to
		this.attach(app, this.log);

		// rendering time
		app.use('/', (req, res, next) => {
			const history = createMemoryHistory({
				initialEntries: [req.path]
			});
			const extractor = new ChunkExtractor({
				statsFile: path.resolve('./dist/public/app/loadable-stats.json'),
				entrypoints: ['client']
			});

			const store = createStore({
				history,
				reducers: this.reducers,
				routes: this.routes
			});

			const branches = matchRoutes(this.routes, req.path);

			const match = objectPath.get(branches.find(({match}) => match.isExact), 'match', {});

			const promises = branches
				.filter(({route}) => !!objectPath.get(route, 'component.dependencies', false))
				.map(({route}) => route.component.dependencies)
				.flatMap(dependencies => dependencies(match).map(dependency => store.dispatch(dependency)));

			if (promises.length) {
				this.log.info(`resolving ${promises.length} async dependencies`);
			}


			return Promise.all(promises).then(() => {
				// StaticRouter will return this object after the renderToString
				// for example: if a <Redirect was used, context.url will populate
				const context = {};

				const html = renderToString(extractor.collectChunks(createElement(
					Provider,
					{store},
					createElement(
						StaticRouter,
						{
							context,
							location: req.url
						},
						renderRoutes(this.routes)
					)
				)));

				return res.status(!!match ? 200 : 404).send(`
					<!DOCTYPE html>
					<html>
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
						<title>${this.name}</title>
						${extractor.getLinkTags()}
						${extractor.getStyleTags()}
					</head>
					<body>
						<div id="app">${html}</div>
						<script id="__MONOTONY_HYDRATE__" type="application/json">${JSON.stringify(store.getState()).replace(/</g, '\\u003c')}</script>
						${extractor.getScriptTags()}
					</html>
				`);
			})
			.catch((err) => {
				this.log.error(err);
				return res.send(err.message);
			});
		});

		// start er up
		app.listen(this.port, () => {
			this.log.info(`server listening on port ${this.port}`);
		});
	}
}
