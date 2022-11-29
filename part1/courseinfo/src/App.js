const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part.name} {props.part.exercises}</p>
  )
}

const Content = (props) => {  
  const parts = props.course.parts.map((part, i) => {
    return <Part part={part} key={i} />
  })

  return (
    <div>
      {parts}
    </div>
  )
}

const Total = (props) => {
  const sum = props.course.parts.reduce((acc, curr) => {
    return acc + curr.exercises
  }, props.course.parts[0].exercises)

  return (
    <p>Number of exercises {sum}</p>
  )
}

const App = () => {
	const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
	return (
	  <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
	  </div>
	)
}
  
export default App
