'use strict';

var React = require('react');
var NextPiecesStore = require('../flux/NextPiecesStore');
var NextPiecesActions = require('../flux/NextPiecesActions');
var Piece = require('./piece');

/**
 * Retrieve the current NextPieces data from the NextPiecesStore
 */
function getNextPieceState() {
  return {
    allNextPieces: NextPiecesStore.getAll()
  };
}

module.exports = React.createClass({
	displayName: "NextPieces",
	getInitialState: function(){
        // this._onChange = this._onChange.bind(this);
        // this._onAdd = this._onAdd.bind(this);
		return getNextPieceState();
	},
	
    componentDidMount: function(){
        NextPiecesStore.addChangeListener(this._onChange);
        NextPiecesStore.addAddListener(this._onAdd);
        NextPiecesActions.initSocket(); // We initialize the websocket connection as soon as the App component has mounted
    },

    componentWillUnmount: function(){
        NextPiecesStore.removeChangeListener(this._onChange);
        NextPiecesStore.removeAddListener(this._onAdd);
    },

    _onAdd: function(){
		// console.log('_onAdd');
		this.setState({allNextPieces: NextPiecesStore.getAll()});
	},
	
    _onChange: function(){
		var nextPieceState = getNextPieceState();
		// console.log('_onChange', nextPieceState.allNextPieces.length);
		
		if (nextPieceState.allNextPieces.length === 0){
			setTimeout(function(){
				NextPiecesActions.add();
				NextPiecesActions.add();
				NextPiecesActions.add();
			}, 200);
		}
		
        this.setState(nextPieceState);
    },
	
	render: function() {
		if (!this.state.allNextPieces){
			return (<span>Cargando... (NextPieces)</span>);
		}
		
		// console.log('allNextPieces', this.state.allNextPieces);
		var pieces = [];
		var styleBlock = {display: 'inline-block'};
		for (var i in this.state.allNextPieces){
			var pieceData = this.state.allNextPieces[i];
			pieces.push(<Piece key={pieceData.id} id={pieceData.id} style={styleBlock} mini={true} index={pieceData.index}/>);
		}
		
		return (<div className="nextPieces">
			{pieces}
		</div>);
	}
});