import routes from '../../Modules/routes';
import APIClient from './APIClient';

/**
 * Base API class for all API calls both on the frontend and backend.
 */
export default class API {}

// The fields and methods are dynamically generated from the routes
for(let {name, route: baseRoute, actions} of routes) {
	API[name] = new APIClient({
		name,
		baseRoute,
		actions
	});
}

