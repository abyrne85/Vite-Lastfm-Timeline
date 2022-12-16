import Options from "../Options/Options";
import Chart from "../Chart/Chart";
import { useState } from 'react';
import { getYearsArray } from "../utils";
import { getWeeklyArtistChart } from "../api";

function Timeline() {

	const [chartData, setChartData] = useState([]);
	const [years, setYears] = useState();
	const [limit, setLimit] = useState();
	const [listType, setListType] = useState();

	const fetchLastFMTimeline = async (data) => {
		setLimit(data.limit);
		setListType(data.listType);
		setChartData([]);
		const years = getYearsArray(data.startYear, data.endYear, data.cumulative);
		setYears(years);
		const artists = await getWeeklyArtistChart({ years, username: data.username, limit: data.limit });
		const chartData = artists.map(({ data }, i) => ({
			year: years[i].year,
			artists: _formatArtists(data.weeklyartistchart.artist, years[i].year)
		})).reverse();
		setChartData(chartData);
	}


	const _formatArtists = (artists, year) => {
		return artists.map(a => ({
			name: a.name,
			rank: a['@attr'].rank,
			plays: a.playcount,
			year
		}))
	}

	return (
		<div className="flex flex-col">
			<div className="mt-5 mb-5">
				<Options onSubmit={(data) => fetchLastFMTimeline(data)}></Options>
			</div>
			<div className="flex-1">
				<div className="w-[95vw] mx-auto h-100">
					{chartData.length > 0 ? <Chart chartData={chartData} years={years} limit={limit} listType={listType}></Chart> : null}
				</div>
			</div>
		</div>
	);
}

export default Timeline;
