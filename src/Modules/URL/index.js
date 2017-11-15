if(IS_SERVER) {
	module.exports = {
		APIHandler: require('./URLAPI').default
	};
}
else {
	module.exports = {
		APIHandler: null
	};
}