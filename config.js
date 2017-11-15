process.on('unhandledRejection', (reason, p) => { throw reason });

require('babel-polyfill');

const
	skeletons = {
		client: {},
		dev: {
			devServerPort: 3000
		},
		server: {
			db: {
				host: "localhost",
				name: "url_shortener",
				port: "27017",
				user: "",
				pass: ""
			}
		},
		shared: {
			domain: "tny.local",
			port: 5000
		}
	},
	{resolve} = require('path'),
	{outputJSON} = require('fs-extra'),
	argv = require('yargs').argv,
	isDocker = !!argv.docker,
	isTest = !!argv.test,
	create = () => {
		let configDir = 'config';

		if(isDocker) {
			skeletons.server.db.host = "mongo";
		}

		if(isTest) {
			configDir = 'test/config';

			if(!isDocker) {
				skeletons.dev.devServerPort = 3200;
				skeletons.server.db.name = 'url_shortener_test';
				skeletons.shared.domain = 'tny.test.local';
				skeletons.shared.port = 5500;
			}
		}

		let promises = [];

		for(const [file, value] of Object.entries(skeletons)) {
			promises.push(outputJSON(resolve(__dirname, configDir, `${file}.json`), value, { spaces: '\t' }));
		}

		return Promise.all(promises);
	};

create();
