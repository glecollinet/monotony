import objectPath from 'object-path';
import {matchRoutes} from 'react-router-config';
import {LOCATION_CHANGE} from 'connected-react-router';

const dependencies = routes => store => next => action => {
	switch (action.type) {
		case LOCATION_CHANGE:
			if (!action.payload.isFirstRendering) {
				const branches = matchRoutes(routes, action.payload.location.pathname);
				const {
					match,
					route
				} = branches.reverse().find(({match}) => match.isExact);

				const resolve = dependencies => {
					dependencies(match).forEach(dependency => {
						store.dispatch(dependency);
					});
				}

				if (route.component.dependencies) {
					resolve(route.component.dependencies)
				} else if (route.component.load) {
					route.component.load().then(({default: {dependencies}}) => {
						resolve(dependencies)
					})
				}
			}
	}
	return next(action);
}

export default {
	dependencies
};