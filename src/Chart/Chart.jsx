import { useEffect, useState } from 'react';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	LineController,
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
	responsive: true,
	maintainAspectRatio: false,
	interaction: {
		mode: 'nearest'
	},
	scales: {
		y: {
			ticks: {
				stepSize: 5
			}
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
	hoverBorderWidth: 5,
	borderWidth: 2,
	spanGaps: null
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

			pill.onclick = () => {
				chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
				chart.update();
			};

			pill.onmouseover = (e) => {
				chart._metasets[item.datasetIndex].dataset.options.borderWidth = 10;
				chart._metasets[item.datasetIndex].dataset.options.pointRadius = 20;
				chart.render();
			};

			pill.onmouseout = () => {
				chart._metasets[item.datasetIndex].dataset.options.borderWidth = 3;
				chart._metasets[item.datasetIndex].dataset.options.pointRadius = 15;
				chart.render();
			};


			pill.style.color = '#ffffff';
			pill.style.textDecoration = item.hidden ? 'line-through' : '';
			pill.style.background = item.fillStyle;
			pill.style.borderColor = item.strokeStyle;
			pill.style.borderWidth = item.lineWidth + 'px';
			pill.style.borderRadius = '5px';
			pill.style.padding = '5px';

			const text = document.createTextNode(item.text);
			pill.appendChild(text);
			legendContainer.appendChild(pill);
		});
	}
}
]

function Chart(props) {

	const labels = props.years.map(y => y.year).reverse();

	const [data, setData] = useState({
		labels,
		datasets: [],
	})

	useEffect(() => {
		_formatChartDataSets(props.chartData);
	});

	const _generateColors = (colorIndex) => ({
		borderColor: colors[colorIndex],
		backgroundColor: colors[colorIndex],
		pointHoverBackgroundColor: colors[colorIndex],
	});

	const _formatChartDataSets = (chartData) => {
		const allArtists = [];
		let flattened = [];
		let colorIndex = 0;

		chartData.forEach(({ artists }) => artists.forEach(a => flattened.push(a)));
		chartData.forEach(({ artists }) => artists.forEach(({ name, rank, plays }) => {
			if (!allArtists.find(d => d.label === name)) {
				allArtists.push({
					...chartSetDefaults,
					..._generateColors(colorIndex),
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

		data.datasets = allArtists;
		setData(data);
	}

	return <>
	<div id="legend-container" className="flex flex-wrap gap-1 mx-5"></div> 
	<Line options={options} data={data} plugins={plugins} />
	</>;
}
export default Chart;
