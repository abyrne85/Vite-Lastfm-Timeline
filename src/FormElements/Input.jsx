export default function Input(props) {

	return (
		<div>
		<label className='block mb-2 text-sm font-medium text-gray-900'>{props.label}</label>
		<input value={props.value} onChange={e => props.onChange(e.target.value)} type={props.type} name={props.label} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5' required></input>
	</div>
	)
}
