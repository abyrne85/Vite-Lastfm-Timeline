import { useState } from 'react';
import { getUser } from '../api.js';
import { fromUnix } from '../utils.js';
import { LIST_TYPES, CUMULATIVE_OPTIONS } from '../constants';
import Button from '../FormElements/Button';
import Dropdown from '../FormElements/Dropdown';
import Input from '../FormElements/Input';
import InputRange from 'react-input-range';

function Options({onSubmit}) {

	const [username, setUsername] = useState('');
	const [startYear, setStartYear] = useState('');
	const [endYear, setEndYear] = useState(`${new Date().getFullYear()}`);
	const [limit, setLimit] = useState(10);
	const [listType, setListType] = useState(LIST_TYPES[0].value);
	const [cumulative, setCumulative] = useState(CUMULATIVE_OPTIONS[0].value);
	const [artistRange, setArtistRange] = useState({min: 1, max: 10});


	const [user, setUser] = useState();

	const _fetchUser = async () => {
		const user = await getUser(username)
		setUser(user);
		return user;
	}

	const _getStartYear = (user) => {
		const startYear = fromUnix(user.registered.unixtime).getFullYear().toString();
		setStartYear(startYear);
		return startYear;
	}

	const submit = async () => {
		if (!user) {
			const user = await _fetchUser();
			return onSubmit({ username, startYear: _getStartYear(user), endYear, limit, listType, cumulative, artistRange });
		}
		onSubmit({ username, startYear, endYear, limit, listType, cumulative, artistRange });
	};

	const clear = () => {
		setUsername('');
		setEndYear(`${new Date().getFullYear()}`);
		setLimit(10);
		setUser(null);
		setArtistRange({min:1, max: 10});
	};


	return (
		<><div className='w-9/12 mx-auto flex items-end gap-2 flex-wrap'>
			<Input value={username} onChange={setUsername} type='username' label='user name'></Input>
			{user && <>
				<Input value={startYear} onChange={setStartYear} type='number' label='start year'></Input>
				<Input value={endYear} onChange={setEndYear} type='number' label='end year'></Input>
				<Input value={limit} onChange={setLimit} type='number' label='limit'></Input>
				<Dropdown options={LIST_TYPES} label='list type' onOptionSelected={setListType}></Dropdown>
				<Dropdown options={CUMULATIVE_OPTIONS} label='cumulative' onOptionSelected={setCumulative}></Dropdown>
			</>}
			<Button onClick={submit} color="blue" label="submit"></Button>
			<Button onClick={clear} color="red" label="clear"></Button>
		</div>
			{user && <div className='w-9/12 mx-auto mt-5'>
				<InputRange
          maxValue={limit}
          minValue={1}
          value={artistRange}
					onChange={value => setArtistRange(value)}/>
			</div>}
		</>
	);
}

export default Options;