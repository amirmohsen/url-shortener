import {APIHandler as URLAPIHandler} from './URL';

/**
 * API routes
 */
export default [
	{
		handler: URLAPIHandler,
		name: 'urls',
		route: '/urls',
		actions: [
			{
				method: 'GET',
				name: 'read',
				route: '/:id?'
			},
			{
				method: 'POST',
				name: 'create',
				route: '/'
			}
		]
	}
];