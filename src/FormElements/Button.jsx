const textColor = {
  green: 'bg-green-500 hover:bg-green-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  red: 'bg-red-500 hover:bg-red-600',
};

export default function Button(props) {

	return (
		<button onClick={props.onClick} className={`${textColor[props.color]} w-100 text-white rounded-lg px-5 py-2.5 text-center text-sm`}>{props.label}</button>
	)
}
