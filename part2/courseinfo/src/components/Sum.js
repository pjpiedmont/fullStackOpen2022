const Sum = ({ parts }) => {
	const sum = parts.reduce((acc, curr) => {
		return acc + curr.exercises
	}, 0)

	return <p><strong>total of {sum} exercises</strong></p>
}

export default Sum