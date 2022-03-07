import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Feedback = ({ text, num }) => (
  <p>
    {text} {num}
  </p>
);

const Statistics = ({ good, neutral, bad }) => {
  
  const calcAvgFeedback = (good, neutral, bad) => {
    if (good + neutral + bad === 0) { // avoid division by 0
      return 0;
    }
    return (good - bad) / (good + neutral + bad);
  };

  if(good + neutral + bad === 0) {
    return (<p>No feedback given</p>);
  }

  return (
    <>
      <Feedback text="good" num={good} />
      <Feedback text="neutral" num={neutral} />
      <Feedback text="bad" num={bad} />
      <Feedback text="all" num={good + neutral + bad} />
      <Feedback text="average" num={calcAvgFeedback(good, neutral, bad)} />
      <p>positive {good / (good + neutral + bad) * 100} %</p>
    </>
  );
};

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
      <Button onClick={increaseGoodByOne} text="good" />
      <Button onClick={increaseNeutralByOne} text="neutral" />
      <Button onClick={increaseBadByOne} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
