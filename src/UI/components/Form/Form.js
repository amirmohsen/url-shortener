import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Send from 'material-ui-icons/Send';
import { withStyles } from 'material-ui/styles';
import { SnackbarContent } from 'material-ui/Snackbar';
import { CircularProgress } from 'material-ui/Progress';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import green from 'material-ui/colors/green';
import IconButton from 'material-ui/IconButton';
import ContentCopy from 'material-ui-icons/ContentCopy';
import Config from 'src/Config';
import URLActions from '../../data/URL';
import styles from './Form.css';

@withRouter
@connect(state => ({
	store: {
		createdShortURLId: state.url.createdShortURLId,
		creationError: state.url.creationError
	}
}))
@withStyles(theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	snackbar: {
		margin: theme.spacing.unit,
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	}
}))
export default class Form extends Component {

	state = {
		loading: false,
		value: ''
	};

	onChange = e => this.setState({value: e.target.value});

	onSubmit = async e => {
		e.preventDefault();

		if(!this.state.value) {
			return;
		}

		this.setState({
			loading: true
		});

		await this.props.dispatch(URLActions.create({url: this.state.value}));

		this.setState({
			loading: false
		});
	};

	getCreatedShortURL() {
		if(!this.props.store.createdShortURLId) {
			return null;
		}

		const
			{ classes } = this.props,
			shortURL = `http://localhost:${Config.port}/${this.props.store.createdShortURLId}`;

		return (
			<div className={styles.messageWrapper}>
				<SnackbarContent
					className={`${classes.snackbar} ${styles.creationMessage}`}
					message={shortURL}
				/>
				<CopyToClipboard text={shortURL}>
					<IconButton className={this.props.classes.button} aria-label="Copy to clipboard">
						<ContentCopy/>
					</IconButton>
				</CopyToClipboard>
			</div>
		);
	}

	onCloseErrorMessage = () => this.props.dispatch(URLActions.error({message: ''}));

	getErrorMessage() {
		return (
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={!!this.props.store.creationError}
				onRequestClose={this.onCloseErrorMessage}
				SnackbarContentProps={{
					'aria-describedby': 'message-id',
				}}
				message={<span id="message-id">{this.props.store.creationError}</span>}
				transition={props => <Slide direction="up" {...props} />}
				action={(
					<Button color="accent" dense onClick={this.onCloseErrorMessage}>
						Dismiss
					</Button>
				)}
			/>
		);
	}

	getSubmitButtonContent() {
		if(this.state.loading) {
			return <CircularProgress size={24} className={this.props.classes.buttonProgress} />;
		}

		return [
			<span key="label">Create Short URL</span>,
			<Send key="icon" className={this.props.classes.rightIcon}/>
		];
	}

	render() {
		const { classes } = this.props;
		return (
			<form onSubmit={this.onSubmit}>
				<TextField
					label="Your URL"
					value={this.state.value}
					onChange={this.onChange}
					margin="normal"
					fullWidth
				/>
				<Button
					type="submit"
					color="primary"
					className={`${classes.button} ${styles.createButton}`}
					classes={{disabled: styles.disabledCreationButton}}
					disabled={this.state.loading}
					raised
				>
					{this.getSubmitButtonContent()}
				</Button>
				{this.getErrorMessage()}
				{this.getCreatedShortURL()}
			</form>
		);
	}
}