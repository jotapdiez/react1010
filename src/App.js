import React from 'react';
import Board from './Board'
import Score from './Score'
import NextPieces from './NextPieces'
// import logo from './logo.svg';
import './styles.css';

function App() {
  return (<div className="row">
    <div className="col-md-4">
      <h1>React<span className="text-danger">10</span><span className="text-primary">10</span>!</h1>
        <Score/>
        <NextPieces/>
    </div>
    <div className="col-md-8">
      <Board />
    </div>
  </div>);
}

export default App;
