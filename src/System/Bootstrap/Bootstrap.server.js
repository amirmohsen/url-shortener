import {resolve} from 'path';
import DB from '../DB';
import BackendServer from '../WebServer';
import Logger from '../Logger';
import Config from '../../Config';

/**
 * The server-side bootstrap initializes the config,
 * starts the database connection and the web server in sequence
 */
export default class Bootstrap {

	constructor() {
		Config.init({
			isDev: IS_DEVELOPMENT,
			root: resolve(__dirname, '../../../')
		});
		this.setup();
	}

	async setup() {
		Logger.init();
		await this.setupDB();
		this.setupWebServer();
	}

	setupDB() {
		this.db = new DB();
		return this.db.connect();
	}

	setupWebServer() {
		this.webServer = new BackendServer();
		this.webServer.run();
	}
}