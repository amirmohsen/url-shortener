import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';
import Form from '../Form/Form';
import URLList from '../URLList/URLList';

export default class Home extends Component {

	render() {
		return (
			<Container fluid>
				<Row>
					<Col xs={12} lg={8} offset={{lg: 2}}>
						<Form/>
					</Col>
				</Row>
				<Row>
					<Col xs={12} lg={8} offset={{lg: 2}}>
						<URLList/>
					</Col>
				</Row>
			</Container>
		);
	}
}