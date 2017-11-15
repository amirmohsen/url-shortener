import shortid from 'shortid';
import isURL from 'validator/lib/isURL';
import isInt from 'validator/lib/isInt';
import moment from 'moment';
import DB from 'src/System/DB';
import APIError from "../../System/API/errors/APIError";

/**
 * API Handler for Short URLs
 */
export default class URLAPI {

	constructor() {
		this.collection = DB.instance.collection('urls');
		this.collection.ensureIndex({
			url: 1
		}, {
			unique: true,
			background: true
		});
	}

	/**
	 * Create a new URL entry
	 * @param data
	 * @returns {Promise.<{id: Array}>}
	 */
	async create({data}) {
		let url = data.url;

		if(typeof url !== 'string' || !isURL(url)) {
			throw new APIError({
				message: 'Invalid url provided',
				type: APIError.CODES.BAD_REQUEST
			});
		}

		let document = await this.collection.findOneAndUpdate({
			url
		}, {
			$setOnInsert: {
				_id: shortid(),
				creationDateTime: new Date(),
				usageCount: 0,
				url
			}
		}, {
			upsert: true
		});

		return {
			id: document.value ? document.value._id : document.lastErrorObject.upserted
		};
	}

	/**
	 * Read url entries by id or in bulk
	 * Options are used for reading in bulk
	 * @param params
	 * @param options
	 * @returns {Promise|Query|*}
	 */
	read({params, options}) {
		let {
			latestCreationDateTime,
			lastFetchedId,
			limit = 20
		} = options;

		if(params.id) {
			if(typeof params.id !== 'string' || !shortid.isValid(params.id)) {
				throw new APIError({
					message: 'Invalid id provided',
					type: APIError.CODES.BAD_REQUEST
				});
			}

			return this.collection
				.findOne({
					_id: params.id
				})
		}

		let query = {};

		if(latestCreationDateTime) {
			let datetime = moment(latestCreationDateTime);

			if(!datetime.isValid()) {
				throw new APIError({
					message: 'Invalid date string provided for the latest creation date & time',
					type: APIError.CODES.BAD_REQUEST
				});
			}

			query = {
				...query,
				creationDateTime: {
					$lte: datetime.toDate()
				}
			};
		}

		if(lastFetchedId) {
			if(typeof lastFetchedId !== 'string' || !shortid.isValid(lastFetchedId)) {
				throw new APIError({
					message: 'Invalid id provided for the last fetched id',
					type: APIError.CODES.BAD_REQUEST
				});
			}

			query = {
				...query,
				_id: {
					$ne: lastFetchedId
				}
			}
		}

		if(typeof limit === 'string' && isInt(limit, {min: 1, max: 1000})) {
			limit = Number.parseInt(limit);
		}
		else if(!Number.isInteger(limit)) {
			throw new APIError({
				message: 'Limit option must be an integer (number or string) between 1 and 1000',
				type: APIError.CODES.BAD_REQUEST
			});
		}

		return this.collection
			.find(query)
			.sort({
				creationDateTime: -1
			})
			.limit(limit)
			.toArray();
	}

	/**
	 * Used for redirection.
	 * Not accessible on the API.
	 * @param _id
	 * @returns {Promise.<null>}
	 */
	async getRedirectionURL(_id) {
		let document = await this.collection.findOneAndUpdate({
			_id
		}, {
			$inc: {
				usageCount: 1
			}
		});

		return document.value ? document.value.url : null;
	}
}