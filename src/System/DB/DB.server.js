import {MongoClient} from 'mongodb';
import extend from 'extend';
import Config from '../../Config/Config.server';

let instance;

/**
 * This class wraps the connection to the mongodb database.
 * This class is a singleton.
 */
export default class DB {

	static defaultConfig = {
		host: 'localhost',
		port: '27017'
	};
	static instance = null;

	config = {};

	constructor() {
		if(!instance){
			this.config = extend(true, {}, DB.defaultConfig, Config.db);
			instance = this;
		}
		return instance;
	}

	/**
	 * Connects to a MongoDB database
	 * @returns {Promise}
	 */
	connect() {
		return new Promise((resolve, reject) => {
			MongoClient.connect(this._getMongoURL({name: this.config.name}), (err, db) => {
				if(err) {
					return reject(err);
				}
				console.log('DB connected');
				DB.instance = db;
				resolve();
			});
		});
	}

	/**
	 * Build a mongo connection url from config
	 * @param name
	 * @returns {string}
	 * @private
	 */
	_getMongoURL({name}) {
		let url = `${this.config.host}:${this.config.port}/${name}`;

		if(this.config.user) {
			let auth = this.config.user;

			if(this.config.pass) {
				auth += `:${this.config.pass}`;
			}

			url = `${auth}@${url}`;
		}

		return `mongodb://${url}`;
	}
}