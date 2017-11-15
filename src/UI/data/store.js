import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {reducer as url} from './URL';
import {reducer as router, middleware as routerMiddleware} from './Router';

// In development, connect to the redux browser extension if available
const composeEnhancers = (IS_DEVELOPMENT && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Building the redux store
const store = createStore(
	combineReducers({
		url,
		router
	}),
	composeEnhancers(
		applyMiddleware(
			thunk,
			routerMiddleware
		)
	)
);

export default store;