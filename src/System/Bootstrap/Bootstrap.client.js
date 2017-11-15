import Config from '../../Config/Config.client';
import FrontendServer from '../WebServer/index';
import extend from 'extend';

/**
 * The client-side bootstrap initializes the config
 * and renders the react site
 */
export default class Bootstrap {

	static defaultConfig = {
		server: {}
	};

	constructor(config = {}) {
		this.config = new Config();
		Config.init({isDev: IS_DEVELOPMENT});
		this.config = extend(true, {}, Bootstrap.defaultConfig, config);
		this.webServer = new FrontendServer(this.config.server);
		this.run();
	}

	async run() {
		this.webServer.run();
	}
}