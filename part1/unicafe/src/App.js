import { useState } from 'react'

const Button = ({ text, clickHandler }) => <button onClick={clickHandler}>{text}</button>

const StatisticLine = ({ text, value }) => <p>{text} {value}</p>

const Statistics = ({ good, neutral, bad }) => {
  const numResponses = good + neutral + bad
  const sum = good - bad
  const avg = sum / numResponses
  const positive = ((good / numResponses) * 100) + ' %'

  if (numResponses === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <StatisticLine text='good' value={good} />
      <StatisticLine text='neutral' value={neutral} />
      <StatisticLine text='bad' value={bad} />
      <StatisticLine text='all' value={numResponses} />
      <StatisticLine text='average' value={avg} />
      <StatisticLine text='positive' value={positive} />
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' clickHandler={handleGood} />
      <Button text='neutral' clickHandler={handleNeutral} />
      <Button text='bad' clickHandler={handleBad} />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App
