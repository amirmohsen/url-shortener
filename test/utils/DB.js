import {MongoClient} from 'mongodb';
import extend from 'extend';

let instance;

export default class DB {

	static defaultConfig = {
		host: 'localhost',
		port: '27017'
	};
	static instance = null;

	config = {};

	constructor(config) {
		if(!instance){
			this.config = extend(true, {}, DB.defaultConfig, config);
			instance = this;
		}
		return instance;
	}

	connect() {
		return new Promise((resolve, reject) => {
			MongoClient.connect(this._getMongoURL({name: this.config.name}), (err, db) => {
				if(err) {
					reject(err);
				}
				DB.instance = db;
				resolve();
			});
		});
	}

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