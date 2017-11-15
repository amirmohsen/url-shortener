import API from 'src/System/API';

/**
 * URL redux action creators and reducer
 */
export default class URL {

	/**
	 * Default page size
	 * @type {number}
	 */
	static PAGE_SIZE = 10;

	/**
	 * Initial data
	 * @type {{done: boolean, currentPage: number, createdShortURLId: string, creationError: string, list: Array}}
	 */
	static data = {
		done: false,
		currentPage: 0,
		createdShortURLId: '',
		creationError: '',
		list: []
	};

	/**
	 * All url entries on the server are fetched
	 * @returns {{type: string}}
	 */
	static done() {
		return {
			type: 'URL.done'
		};
	}

	/**
	 * Change the page in the url table
	 * @param number
	 * @returns {function(*, *)}
	 */
	static changePage({number}) {
		return async (dispatch, getState) => {
			const state = getState().url;

			if(Math.ceil(state.list.length / URL.PAGE_SIZE) === (number + 1) && !state.done && state.list.length) {
				let listItem = state.list[state.list.length - 1];

				if(listItem) {
					dispatch(this.fetch({
						latestCreationDateTime: listItem.creationDateTime,
						lastFetchedId: listItem._id
					}, true))
				}
			}

			dispatch({
				type: 'URL.changePage',
				payload: number
			});
		};
	}

	/**
	 * Fetch the next batch of urls (in batches of 20 == 2 pages)
	 * @param options
	 * @param append
	 * @returns {function(*)}
	 */
	static fetch(options = {}, append = false) {
		return async dispatch => {
			let {data} = await API.urls.read({
				options
			});

			if(data) {
				dispatch({
					type: 'URL.fetch',
					payload: data,
					append
				});

				if(data.length < 20) {
					dispatch(this.done());
				}
			}
		};
	}

	/**
	 * Create a new URL entry by calling the API and re-fetching urls
	 * This resets the paging
	 * @param url
	 * @returns {function(*)}
	 */
	static create({url}) {
		return async dispatch => {
			let {data, error} = await API.urls.create({
				data: {
					url
				}
			});

			if(data) {
				dispatch({
					type: 'URL.create',
					payload: data.id
				});

				dispatch(this.fetch());
			}
			else {
				let message = 'Unknown error occurred.';

				if(error && error.message) {
					message = error.message;
				}

				dispatch(this.error({message}));
			}
		};
	}

	/**
	 * Adding a url creation error
	 * @param message
	 * @returns {{type: string, payload: *}}
	 */
	static error({message}) {
		return {
			type: 'URL.error',
			payload: message
		};
	}

	/**
	 * URL reducer
	 * @param state
	 * @param action
	 * @returns {*}
	 */
	static reducer(state = URL.data, action) {
		switch(action.type) {
			case 'URL.done':
				return {
					...state,
					done: true
				};
			case 'URL.fetch':
				return {
					...state,
					list: action.append ? [...state.list, ...action.payload] : action.payload
				};
			case 'URL.create':
				return {
					...state,
					createdShortURLId: action.payload
				};
			case 'URL.changePage':
				return {
					...state,
					currentPage: action.payload
				};
			case 'URL.error':
				return {
					...state,
					creationError: action.payload
				};
			default:
				return state;
		}
	}
}

export const reducer = URL.reducer.bind(URL);