import axios from 'axios';
import { toUnix } from './utils';
import { BASE_URL, LAST_FM_API } from './constants';

export const getUser = async (username) => {
	return await axios.get(`${BASE_URL}?method=user.getInfo&user=${username}&api_key=${LAST_FM_API}&format=json`).then(res => res.data.user);
}

export const getWeeklyArtistChart = async ({years, username, limit}) => {
	const requests =
	years.map(({ from, to }) =>
		axios.get(`${BASE_URL}?method=user.getWeeklyArtistChart&user=${username}&api_key=${LAST_FM_API}&format=json&limit=${limit}&from=${toUnix(from)}&to=${toUnix(to)}`))
	return await axios.all(requests).then(res => res);	
}