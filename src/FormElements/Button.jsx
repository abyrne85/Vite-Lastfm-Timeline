const textColor = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
};

export default function Button(props) {

	return (
		<button onClick={props.onClick} className={`${textColor[props.color]} w-100 text-white rounded-lg px-5 py-2.5 text-center text-sm`}>{props.label}</button>
	)
}
