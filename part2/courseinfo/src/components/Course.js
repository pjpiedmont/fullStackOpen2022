import Header from './Header'
import Content from './Content'
import Sum from './Sum'

const Course = ({ course }) => (
	<div>
		<Header name={course.name} />
		<Content parts={course.parts} />
		<Sum parts={course.parts} />
	</div>
)

export default Course