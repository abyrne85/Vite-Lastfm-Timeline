export const toUnix = (date) => Math.floor(new Date(date).getTime() / 1000);
export const fromUnix = (unix) => new Date(unix * 1000);

export 	const getYearsArray = (startYear, endYear, cumulative) => {
	const yearsActive = endYear - startYear;
	const years = [];
	for (let i = endYear; i >= endYear - yearsActive; i--) {
		years.push({
			year: i,
			from : cumulative ? `01/01/${startYear}` : `01/01/${i}`,
			to: `12/31/${i}`
		});
	}
	return years;
}