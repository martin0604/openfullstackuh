import React, { useState } from 'react'
import ReactDOM from 'react-dom'

//Anecdotes Final state
const App = (props) => {
  const [poll, setPoll] = useState(
    {
      selected: 0,
      anecdotes:[
      {text: 'If it hurts, do it more often', votes: 0},
      {text:'Adding manpower to a late software project makes it later!', votes: 0},
      {text:'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.', votes: 0},
      {text:'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', votes: 0},
      {text:'Premature optimization is the root of all evil.', votes: 0},
      {text:'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.', votes: 0}
      ]
    }
  );

  const [bestAnecdote, setBestAnecdote] = useState({anecdote: "No data", votes: 0})

  const increaseVotes = function(selected) {
    const newPoll = {
      ...poll
    }
    newPoll.anecdotes[selected].votes = poll.anecdotes[selected].votes + 1;
    setPoll(newPoll);
    checkVotes();
  }

  const setAnecdote = function(){
    const newPoll = {
      ...poll,
      selected: Math.round(Math.random()*5)
    };
    setPoll(newPoll);
  }

  //Determine anecdote with highest number of votes
  const checkVotes = function(){
    let votes = poll.anecdotes.map(anecdote => anecdote.votes);
    let highest = 0;
    let anecdoteIndex;
    for(let i = 0; i < votes.length; i++){ //Check highest number in the set of votes
      if(votes[i] >= highest){ 
        highest = votes[i];
        anecdoteIndex = i;
      }
    }
    const newBestAnecdote = {
      anecdote: poll.anecdotes[anecdoteIndex].text,
      votes: highest
    }
    setBestAnecdote(newBestAnecdote);
  }
  
  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{poll.anecdotes.map(anecdote => anecdote.text)[poll.selected]}</div>
      has {poll.anecdotes.map(anecdote => anecdote.votes)[poll.selected]} votes
      <div>
      <button onClick={() => increaseVotes(poll.selected)}>Vote</button>
      <button onClick={() => setAnecdote()}>Next anecdote</button>
      </div>
      <h2>Anecdote with most votes</h2>
      <div>{bestAnecdote.anecdote}</div>
      <div>has {bestAnecdote.votes} votes</div>
    </div>
    
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]


ReactDOM.render(<App />, 
  document.getElementById('root')
);