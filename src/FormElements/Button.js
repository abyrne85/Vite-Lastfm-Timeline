export default function Button(props) {
	return (
		<button onClick={props.onClick} className={`text-white bg-${props.color}-700 hover:bg-${props.color}-800 rounded-lg px-5 py-2.5 text-center text-sm`}>{props.label}</button>
	)
}
