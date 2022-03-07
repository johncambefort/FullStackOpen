import { useState } from 'react'

const Header = (props) => <h1>{props.text}</h1>;

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>;

const Feedback = ({text, numVotes}) => <p>{text} {numVotes}</p>;

const Statistics = ({good, neutral, bad}) => {
  return (<>
    <Feedback text="good" numVotes={good} />
    <Feedback text="neutral" numVotes={neutral} />
    <Feedback text="bad" numVotes={bad} />
  </>);
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGoodByOne = () => setGood(good + 1);
  const increaseNeutralByOne = () => setNeutral(neutral + 1);
  const increaseBadByOne = () => setBad(bad + 1);

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={increaseGoodByOne} text="good"/>
      <Button onClick={increaseNeutralByOne} text="neutral"/>
      <Button onClick={increaseBadByOne} text="bad"/>
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App