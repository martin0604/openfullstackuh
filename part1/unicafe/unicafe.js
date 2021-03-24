import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>Give feedback</h2>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      <h2>Statistics</h2>
      <label>good {good}</label>
      <label>neutral {neutral}</label>
      <label>bad {bad}</label>
    </div>
  )
};

ReactDOM.render(<App />, 
  document.getElementById('unicafe')
);


//Unicafe step 2
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  
  const [feedback, setFeedback] = useState({
    good: 0, neutral: 0, bad: 0, average: 0, total: 0, positive: 0
  });
  /*const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)
  const [total, setTotal] = useState(0)
  const [positive, setPositive] = useState(0)*/

  const increaseGood = function () {

    const newFeedback = {
      good: feedback.good + 1,
      neutral: feedback.neutral,
      bad: feedback.bad,
      average: (feedback.good - feedback.bad)/(feedback.total+1),
      total: feedback.total + 1,
      positive: ((feedback.good + 1)/(feedback.total + 1)) * 100
    }
    setFeedback(newFeedback);
    /*console.log("antes",good);
    setGood(good+1);
    console.log("despues",good);
    setTotal(total + 1);
    setPositive((good/total)*100);
    setAverage((good - bad)/total);*/
  } 

  const increaseNeutral = function () {
    const newFeedback = {
      good: feedback.good,
      neutral: feedback.neutral + 1,
      bad: feedback.bad,
      average: (feedback.good - feedback.bad)/(feedback.total+1),
      total: feedback.total + 1,
      positive: ((feedback.good)/(feedback.total+1)) * 100
    }
    setFeedback(newFeedback);
    /*setNeutral(neutral+1);
    setTotal(total + 1);
    setPositive((good/total)*100);
    setAverage((good - bad)/total);*/
  } 

  const increaseBad = function () {
    const newFeedback = {
      good: feedback.good,
      neutral: feedback.neutral,
      bad: feedback.bad + 1,
      average: (feedback.good - feedback.bad)/(feedback.total+1),
      total: feedback.total + 1,
      positive: ((feedback.good)/(feedback.total+1)) * 100
    }
    setFeedback(newFeedback);
    /*setBad(bad+1);
    setTotal(total + 1);
    setPositive((good/total)*100);
    setAverage((good-bad)/total);*/
  } 

  return (
    <div>
      <h2>Give feedback</h2>
      <button onClick={increaseGood}>good</button>
      <button onClick={increaseNeutral}>neutral</button>
      <button onClick={increaseBad}>bad</button>

      <h2>Statistics</h2>
      <label>good {feedback.good}</label><br/>
      <label>neutral {feedback.neutral}</label><br/>
      <label>bad {feedback.bad}</label><br/>
      <label>all {feedback.total}</label><br/>
      <label>average {feedback.average}</label><br/>
      <label>positive {feedback.positive}%</label>
    </div>
  )
};

ReactDOM.render(<App />, 
  document.getElementById('root')
);

//Unicafe final state

import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Statistic = (props) => {
  return (
    <tr>
      <td><label>{props.text}</label></td>
      <td><label>{props.value}</label></td>
    </tr>
  )
}

const Button = (props) => {
return (
    <button onClick={props.handleClick}>{props.text}</button>
)
}

const Statistics = (props) => {

  if(props.feedback.total == 0){
    return (
      <div>
        <label>No feedback given</label>
      </div>
    )
  }

  return (
    <div>
      <table>
        <tbody>
      <Statistic text="good" value={props.feedback.good}/>
      <Statistic text="neutral" value={props.feedback.neutral}/>
      <Statistic text="bad" value={props.feedback.bad}/>
      <Statistic text="all" value={props.feedback.total}/>
      <Statistic text="average" value={props.feedback.average}/>
      <Statistic text="positive" value={props.feedback.positive}/>
      </tbody>
      </table>
    </div>
  )

};


const App = () => {
  
  const [feedback, setFeedback] = useState({
    good: 0, neutral: 0, bad: 0, average: 0, total: 0, positive: 0
  });
  

  const increaseGood = function () {

    const newFeedback = {
      good: feedback.good + 1,
      neutral: feedback.neutral,
      bad: feedback.bad,
      average: (feedback.good+1 - feedback.bad)/(feedback.total+1),
      total: feedback.total + 1,
      positive: ((feedback.good + 1)/(feedback.total + 1)) * 100
    }
    setFeedback(newFeedback);
    
  } 

  const increaseNeutral = function () {
    const newFeedback = {
      good: feedback.good,
      neutral: feedback.neutral + 1,
      bad: feedback.bad,
      average: (feedback.good - feedback.bad)/(feedback.total+1),
      total: feedback.total + 1,
      positive: ((feedback.good)/(feedback.total+1)) * 100
    }
    setFeedback(newFeedback);
   
  } 

  const increaseBad = function () {
    const newFeedback = {
      good: feedback.good,
      neutral: feedback.neutral,
      bad: feedback.bad + 1,
      average: (feedback.good - feedback.bad+1)/(feedback.total+1),
      total: feedback.total + 1,
      positive: ((feedback.good)/(feedback.total+1)) * 100
    }
    setFeedback(newFeedback);
    
  } 

  return (
    <div>
      <h2>Give feedback</h2>
      <Button text="good" handleClick={increaseGood}/>
      <Button text="neutral" handleClick={increaseNeutral}/>
      <Button text="bad" handleClick={increaseBad}/>

      <h2>Statistics</h2>

      <Statistics feedback={feedback}/>
      
    </div>
  )
};

ReactDOM.render(<App />, 
  document.getElementById('root')
);