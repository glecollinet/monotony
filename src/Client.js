import {createElement} from 'react';
import {Provider} from 'react-redux';
import {render, hydrate} from 'react-dom';
import {createBrowserHistory} from 'history';
import {renderRoutes} from 'react-router-config';
import {loadableReady} from '@loadable/component';
import {ConnectedRouter} from 'connected-react-router';

import createStore from './createStore.js';

export default class Client {
	constructor({
		container,
		reducers,
		routes = []
	}) {
		this.routes = routes;
		this.reducers = reducers;
		this.history = createBrowserHistory();
	}

	start() {
		let initial = {};

		try {
			initial = JSON.parse(document.getElementById('__MONOTONY_HYDRATE__').textContent);
		} catch (error) {
			console.warn('[MONOTONY] Could not server side render, trying to client side render, error:', error);
		}

		const hydrated = Object.keys(initial).length;
		const method = hydrated ? hydrate : render;

		const store = createStore({
			initial,
			reducers: this.reducers,
			history: this.history,
			routes: this.routes
		});

		const App = createElement(
			Provider,
			{store},
			createElement(
				ConnectedRouter,
				{history: this.history},
				renderRoutes(this.routes)
			)
		);

		const init = () => {
			method(App, document.getElementById('app'), () => {
				console.log(`[MONOTONY] ${method.name} success!`);
			})
		}

		if (hydrated) {
			return loadableReady(init)
		}



		return init();
	}
}
