import { useState } from 'react';

function Dropdown(props) {
  const [open, setOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(props.options[0]);

  const handleOpen = () => {
    setOpen(!open);
  };

	const handleSelection = (opt) => {
		setSelectedOption(opt);
		setOpen(!open);
		props.onOptionSelected(opt.value);
	};

	return (
		<div className="relative">
		<label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>{props.label}</label>
		<button onClick={handleOpen} className="w-100 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">{selectedOption.label}</button>
		{open && <div className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 absolute">
			<ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
				{props.options.map((opt, i) => (
					<li key={i} onClick={e => handleSelection(opt)} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
					{opt.label}
					</li>
				))}
			</ul>
		</div>}
		</div>
	)
}

export default Dropdown