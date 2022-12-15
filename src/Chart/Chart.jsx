import { useState } from 'react';
import Button from '../FormElements/Button';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const options = {
	maintainAspectRatio: true,
	scales: {
		y: {
			display: false,
		}
	},
	hover: {
		mode: 'dataset',
		intersect: false
	},
	plugins: {
		htmlLegend: {
			containerID: 'legend-container',
		},
		legend: {
			display: false,
		},
	}
};


const chartSetDefaults = {
	data: [],
	tension: 0.2,
	pointHoverRadius: 15,
	hoverBorderWidth: 10,
	borderWidth: 2
};

const colors = [
	'#003f5c',
	'#444e86',
	'#955196',
	'#dd5182',
	'#ff6e54',
	'#ffa600',
]

const plugins = [{
	beforeInit: (chart) => {
		const originalFit = chart.legend.fit;
		chart.legend.fit = function fit() {
			originalFit.bind(chart.legend)();
			this.height += 45;
		}
	}
},
{
	id: 'htmlLegend',
	afterUpdate(chart, args, options) {
		const legendContainer = document.getElementById( options.containerID);

		// Remove old legend items
		while (legendContainer.firstChild) {
			legendContainer.firstChild.remove();
		}

		// Reuse the built-in legendItems generator
		const items = chart.options.plugins.legend.labels.generateLabels(chart);

		items.forEach(item => {
			const pill = document.createElement('span');
			pill.style.alignItems = 'center';
			pill.style.cursor = 'pointer';

			pill.onclick = (e) => {
				chart._metasets.forEach(({dataset}) => dataset.options.borderWidth = 2);
				chart._metasets[item.datasetIndex].dataset.options.borderWidth = 20;
				chart.render();
			};

			pill.onmouseover = (e) => {
				pill.style.opacity ='1';
			};

			pill.onmouseout = () => {
				pill.style.opacity = '0.8';
			};


			pill.style.color = '#ffffff';
			pill.style.textDecoration = item.hidden ? 'line-through' : '';
			pill.style.background = item.fillStyle;
			pill.style.borderColor = item.strokeStyle;
			pill.style.borderWidth = item.lineWidth + 'px';
			pill.style.borderRadius = '5px';
			pill.style.padding = '5px';
			pill.style.opacity = '0.8'

			const text = document.createTextNode(item.text);
			pill.appendChild(text);
			legendContainer.appendChild(pill);
		});
	}
}
]

const _formatChartDataSets = (props) => {
	const allArtists = [];
	let flattened = [];
	let colorIndex = 0;

	props.chartData.forEach(({ artists }) => artists.forEach(a => flattened.push(a)));
	props.chartData.forEach(({ artists }) => artists.forEach(({ name }) => {
		if (!allArtists.find(d => d.label === name)) {
			allArtists.push({
				...chartSetDefaults,
				borderColor: colors[colorIndex],
				backgroundColor: colors[colorIndex],
				pointHoverBackgroundColor: colors[colorIndex],
				label: name,
			});
			if(colorIndex < colors.length - 1)colorIndex = colorIndex + 1
			else colorIndex = 0;
		}
	}));


	allArtists.forEach(artist => {
		artist.data = props.years.map(({ year }) => {
			const flattenedArtist = flattened.find(a => a.year === year && a.name === artist.label);
			if (props.listType === 'rank') return flattenedArtist ? flattenedArtist.rank : parseInt(props.limit) + 1;
			if (props.listType === 'playcount') return flattenedArtist && flattenedArtist.plays;
			return null;
		}).reverse();
	});
	options.scales.y.reverse = props.listType === 'rank' ? true : false;

	return allArtists;
}

function Chart(props) {

	const [data, setData] = useState({
		labels : props.years.map(y => y.year).reverse(),
		datasets: _formatChartDataSets(props),
	});

	const [showLegend, setShowLegend] = useState(true);

	return <>
	<Button onClick={() => setShowLegend(!showLegend)} color="green" label={showLegend ? 'Hide Artists' : 'Show Artists'}></Button>

	<div id="legend-container" className={`${showLegend ? 'h-100' : 'h-0 overflow-hidden'} flex flex-wrap justify-center gap-1 mt-1`}></div>
	<Line options={options} data={data} plugins={plugins} />
	</>;
}
export default Chart;
