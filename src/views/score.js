'use strict';

var React = require('react');
var ScoreStore = require('../flux/ScoreStore');
var ScoreActions = require('../flux/ScoreActions');

function getScore() {
  return ScoreStore.getScore();
}

function getDrops() {
  return ScoreStore.getDrops();
}

module.exports = React.createClass({
	displayName: "Score",
	getInitialState: function(){
        // this._onChange = this._onChange.bind(this);
		return {
			score: getScore(),
			drops: getDrops()
		};
	},
	
    componentDidMount: function(){
        ScoreStore.addChangeListener(this._onChange);
        ScoreActions.initSocket(); // We initialize the websocket connection as soon as the App component has mounted
    },

    componentWillUnmount: function(){
        ScoreStore.removeChangeListener(this._onChange);
    },

    _onChange: function(){
        this.setState({
			score: getScore(),
			drops: getDrops()
		});
    },
	
	render: function() {
		return (<div className="score">
			<span><strong>Puntaje:</strong></span><span>{this.state.score}</span>
			<br/>
			<span><strong>Movimientos:</strong></span><span>{this.state.drops}</span>
		</div>);
	}
});