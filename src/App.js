import React from 'react';
import Board from './Board'
import Score from './Score'
import NextPieces from './NextPieces'
// import logo from './logo.svg';
import './styles.css';

function App() {
  return (<div className="container">
    <div className="left-container">
      <div className="score-container">
        <h1>React<span className="text-danger">10</span><span className="text-primary">10</span>!</h1>
        <Score/>
      </div>
      <NextPieces/>
    </div>
    <div className="board-container">
      <Board />
    </div>
  </div>);
}

export default App;
