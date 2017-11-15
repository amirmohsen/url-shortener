import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Container, Row, Col} from 'react-grid-system';

export default class PageNotFound extends Component {

	render() {
		return (
			<div>
				<Helmet>
					<title>Page Not Found</title>
				</Helmet>
				<Container fluid>
					<Row>
						<Col xs={12} lg={8} offset={{lg: 2}}>
							<p>Page Not Found</p>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}