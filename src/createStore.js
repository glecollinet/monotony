import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'connected-react-router'

import middleware from './middleware.js'
import createRootReducer from './reducers.js';

export default ({
	history,
	reducers,
	initial = {},
	routes = []
}) => {
	return createStore(
		createRootReducer(history, reducers),
		initial,
		applyMiddleware(
			thunk,
			routerMiddleware(history),
			middleware.dependencies(routes),
			createLogger()
		)
	);
};
