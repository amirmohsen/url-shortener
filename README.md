# URL Shortener

A sample URL shortening web app. This app is not meant to be used in production as it lacks
many security protections such as API rate limiting and has only one test suite that do basic raw
API tests. It also lacks React SSR (server-side-rendering) due to time constraints.
It is a proof of concept really more than anything.

This app was originally designed for working with a custom vhost (customizable in the config).
However, to reduce the setup burden, it also runs on localhost with no custom vhost.

## Installation & Usage

After cloning the repo, you have two ways of running the application.

After following either of the following setups, you can access the app on port `5000`. If you have setup
a vhost in your machine's `hosts` file, you can access it directly on the vhost. Default vhost is `tny.local`.
Otherwise just go to `localhost:5000`. 

### Docker
Ensure you have a recent version of docker installed on your host machine.
The database is not persistent in this docker setup which means on every build, you get a fresh database.

#### Production
Run `docker-compose -f ./docker-compose.prod.yml up --build`

When you see `Listening on port 5000`, browse to `localhost:5000`.

#### Development
Run `docker-compose -f ./docker-compose.dev.yml up --build`

The docker development environment is only there to demonstrate what the build process looks like,
but is not fully functional. The webpack process doesn't recompile on file change and `npm install` is much
slower. For a true development experience, please follow the **local development** instructions.

#### Tests
Run `docker-compose -f ./docker-compose.test.yml up --build`

There's one test suite here with three tests in it. It first starts a production server then runs API calls against the
server. Before each test, it drops the database.

### Local (native machine setup)
For local usage, ensure you have the following installed on your machine:

- Node.js 8+
- Npm 5+ (version 5 is bundled with node.js 8)
- MongoDB 3.4+

Start MongoDB: `mongod`

Install the dependencies: `npm install`

Generate the skeleton config: `npm run config`

Build the builder script: `npm run build-builder`.
Alternatively, if you plan on making changes to the builder,
you can run `npm run build-builder-dev` which includes a watch.

#### Production
Build: `npm run build`
Start the server: `npm start`

#### Development
Build, watch and start in one command: `npm run dev`

The above command first does a double server and client build then goes into watch mode and recompiles on file changes.
After the initial compilation, it starts the server. If the server (or shared) files change, it restarts the server using nodemon.

#### Tests
Generate the skeleton config: `npm run config-test`
By default, the config it generated for a secondary development server that can be run alongside your primary development server.

If you wish to use this secondary development server, run `npm run test-build`.
If you wish to use your primary development (or production) server,
make changes to the generated config files under the `test/config` folder so they point to it.

Then run the tests, `npm test`

## App Structure
This is the structure of the `src` directory

- Builder: a flexible, configurable build tool for different environments,
using webpack, babel, nodemon, etc. This is compiled separately using babel-cli.
- Config: run-time Config classes both on the backend and frontend
- Modules: the api handlers and routes (shared to some extent between client and server)
- System: core app functionality
	- API: API clients (server and client), API server, API error, API helpers, etc
	- BaseError: base error class for all errors in this app
	- Bootstrap: client and server bootstrap classes
	- DB: class on the server that handles the database connection
	- Logger: helper class on the server for logging
	- WebServer
		- FrontendServer: renders react on the client
		- BackendServer: initializes express middleware and delegates requests to other server classes
		- ContentServer: serves static html (React SSR has been removed due to time constraints)
- UI
 - components: react views
 - data: redux store, action creators and reducers
- client.js: client entry point
- client.vendors.js: client vendors - used to generate a DLL bundle in webpack during dev to improve rebuild times
- server.js: server entry point