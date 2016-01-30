'use strict';

var React = require('react');
var Board = require('./board');
var NextPieces = require('./nextPieces');
var Score = require('./score');

module.exports = React.createClass({
	displayName: "React1010",
	render: function() {
		return (<div>
			<div className="row">
				<div className="col-md-6"><Board/></div>
				<div className="col-md-6">
					<h1>react1010!</h1>
					<p><Score/></p>
				</div>
			</div>
			<div className="row" style={{marginTop: '10px'}}>
				<div className="col-md-6"><NextPieces/></div>
				<div className="col-md-6"> </div>
			</div>
		</div>);
	}
});
