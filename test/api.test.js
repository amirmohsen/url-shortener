import 'isomorphic-fetch';
import {stringify as queryStringify} from 'qs';
import extend from 'extend';
import sharedConfig from './config/shared.json';
import './utils/setupDB';

const fetchData = (path, options = {}) => {
	options = extend(true, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	}, options);
	return fetch(
		new Request(`http://api.${sharedConfig.domain}:${sharedConfig.port}${path}`, options)
	).then(response => response.json());
};

describe('Raw API calls:', () => {
	test('Creating Short URL for "https://www.google.co.uk/"', async () => {
		let {data} = await fetchData('/urls', {
			method: 'POST',
			body: JSON.stringify({
				url: 'https://www.google.co.uk/'
			})
		});

		expect(data).toBeDefined();
		expect(typeof data.id).toBe('string');
		expect(data.id.length).toBeGreaterThanOrEqual(7);
		expect(data.id.length).toBeLessThanOrEqual(14);
		expect(data.id).toMatch(/[a-zA-Z0-9\-_]+/g);
	});

	test('Creating Short URL for "https://www.netflix.com/" and fetching it', async () => {
		let url = 'https://www.netflix.com/';

		let {data} = await fetchData('/urls', {
			method: 'POST',
			body: JSON.stringify({
				url
			})
		});

		let {data: doc} = await fetchData(`/urls/${data.id}`, {
			method: 'GET'
		});

		expect(data.id).toBe(doc._id);
		expect(url).toBe(doc.url);
	});

	test('Creating 1000 short URLs and fetching them using various options', async () => {
		for(let i = 0; i < 500; i++) {
			await fetchData('/urls', {
				method: 'POST',
				body: JSON.stringify({
					url: `http://test${i}.local`
				})
			});
		}

		let {data} = await fetchData('/urls', {
			method: 'GET'
		});

		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBe(20);

		let items = await fetchData(`/urls?${queryStringify({ limit: 1000 })}`, {
			method: 'GET'
		});

		data = items.data;

		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBe(500);

		let latestItem = data[0];

		for(let i = 500; i < 1000; i++) {
			await fetchData('/urls', {
				method: 'POST',
				body: JSON.stringify({
					url: `http://test${i}.local`
				})
			});
		}

		items = await fetchData(`/urls?${queryStringify({ limit: 1000, latestCreationDateTime: latestItem.creationDateTime })}`, {
			method: 'GET'
		});

		data = items.data;

		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBe(500);

		items = await fetchData(`/urls?${queryStringify({ limit: 1000, latestCreationDateTime: latestItem.creationDateTime, lastFetchedId: latestItem._id })}`, {
			method: 'GET'
		});

		data = items.data;

		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBe(499);
	});
});