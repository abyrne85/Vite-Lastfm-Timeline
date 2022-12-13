import axios from 'axios';
import { toUnix } from './utils';
export const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';
export const LAST_FM_API = 'bf55a5190c3ffaac7d4d96c9ac1ef32a';


export const getUser = async (username) => {
	return await axios.get(`${BASE_URL}?method=user.getInfo&user=${username}&api_key=${LAST_FM_API}&format=json`).then(res => res.data.user);
}

export const getWeeklyArtistChart = async ({years, username, limit}) => {
	const requests =
	years.map(({ from, to }) =>
		axios.get(`${BASE_URL}?method=user.getWeeklyArtistChart&user=${username}&api_key=${LAST_FM_API}&format=json&limit=${limit}&from=${toUnix(from)}&to=${toUnix(to)}`))
	return await axios.all(requests).then(res => res);	
}