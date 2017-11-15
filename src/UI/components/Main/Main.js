import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Container, Row, Col} from 'react-grid-system';
import {Switch, Route} from 'react-router-dom';
import Home from '../Home/Home';
import PageNotFound from '../PageNotFound/PageNotFound';
import './Main.css';

export default class Main extends Component {

	render() {
		return (
			<div>
				<Helmet titleTemplate="%s | URL Shortener">
					<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
					<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
					<title>URL Shortener</title>
				</Helmet>
				<Container fluid>
					<Row>
						<Col xs={12}>
							<h1>URL Shortener</h1>
						</Col>
					</Row>
				</Container>
				<Switch>
					<Route
						path="/"
						component={Home}
						exact
					/>
					<Route
						path="/*"
						component={PageNotFound}
					/>
				</Switch>
			</div>
		);
	}
}