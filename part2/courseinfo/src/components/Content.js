import Part from './Part'

const Content = ({ parts }) => {
	const list = parts.map(part => <Part name={part.name} exercises={part.exercises} key={part.id} />)

	return list
}

export default Content