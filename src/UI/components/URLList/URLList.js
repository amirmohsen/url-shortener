import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { PagingState, LocalPaging } from '@devexpress/dx-react-grid';
import { Grid, TableView, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ContentCopy from 'material-ui-icons/ContentCopy';
import moment from 'moment';
import Config from 'src/Config';
import URLActions from '../../data/URL';
import styles from './URLList.css';

@withRouter
@connect(state => ({
	store: {
		currentPage: state.url.currentPage,
		items: state.url.list
	}
}))
@withStyles(theme => ({
	table: {
		minWidth: 700,
	}
}))
export default class Form extends Component {

	componentDidMount() {
		this.props.dispatch(URLActions.fetch());
	}

	onPageChange = number => this.props.dispatch(URLActions.changePage({number}));

	getRows() {
		return this.props.store.items.map(item => {
			const shortURL = `http://localhost:${Config.port}/${item._id}`;
			return {
				...item,
				copyToClipboard: (
					<CopyToClipboard text={shortURL}>
						<IconButton color="accent" className={this.props.classes.button}>
							<ContentCopy/>
						</IconButton>
					</CopyToClipboard>
				),
				creationDateTime: moment(item.creationDateTime).format('MMM Do, Y - HH:mm:ss'),
				shortURL
			};
		});
	}

	render() {
		return (
			<div className={styles.root}>
				<Grid
					rows={this.getRows()}
					columns={[
						{ name: 'shortURL', title: 'Short URL' },
						{ name: 'url', title: 'Original URL' },
						{ name: 'creationDateTime', title: 'Creation Date & Time' },
						{ name: 'usageCount', title: 'Usage Count' },
						{ name: 'copyToClipboard', title: ' ' }
					]}
				>
					<PagingState
						currentPage={this.props.store.currentPage}
						pageSize={URLActions.PAGE_SIZE}
						onCurrentPageChange={this.onPageChange}
						totalCount={this.props.store.items.length}
					/>
					<LocalPaging />
					<TableView />
					<TableHeaderRow />
					<PagingPanel />
				</Grid>
			</div>
		);
	}
}