import APIError from '../errors/APIError';

/**
 * It wraps API actions and catches errors to prevent the server from
 * crashing as well as turning code errors into well-formatted api errors.
 * @param realAction
 */
export default realAction => async function replacementAction(args) {
	let response;

	try {
		let data = await realAction.call(this, args);

		response = {
			data,
			meta: {
				code: 200
			}
		};
	}
	catch(e) {
		if(e instanceof APIError) {
			response = {
				error: {
					type: e.type,
					code: e.code,
					title: e.title,
					message: e.message,
					details: e.details
				},
				meta: {
					code: e.code
				}
			};
		}
		else {
			console.error(e);

			response = {
				error: {
					type: APIError.CODES.INTERNAL_ERROR,
					code: APIError.CODE_DETAILS[APIError.CODES.INTERNAL_ERROR].code,
					title: APIError.CODE_DETAILS[APIError.CODES.INTERNAL_ERROR].title,
					message: 'An unknown error occurred.',
					details: {}
				},
				meta: {
					code: APIError.CODE_DETAILS[APIError.CODES.INTERNAL_ERROR].code
				}
			};
		}
	}

	return response;
};