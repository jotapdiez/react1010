'use strict';

var React = require('react');

var ConstatntsDragAndDrop = require('./const_dragAndDrop');
var MATRIX_PIECES = require('./const_pieces_matrix').MATRIX_PIECES;
var ConstantsGame = require('./const_game');

//id, index, style, mini
module.exports = React.createClass({
	displayName: "Piece",
	getInitialState: function(){
		return {
			red: ( (Math.round( Math.random())) === 1 ? 'F' : '0'),
			green: ( (Math.round( Math.random())) === 1 ? 'F' : '0'),
			blue: ( (Math.round( Math.random())) === 1 ? 'F' : '0'),
			pieceIndex: null,
			onDrag: false
		};
	},
	
	componentWillMount: function(){
		var pieceIndex = ( this.props.index ? this.props.index : Math.round(Math.random() * MATRIX_PIECES.length));
		// console.log('pieceIndex', pieceIndex);
		
		this.setState({pieceIndex: pieceIndex});
	},
	
	onDragStart: function(e) {
		var selectedIndex = parseInt(e.currentTarget.dataset.key);
		e.dataTransfer.effectAllowed = ConstatntsDragAndDrop.ALLOWED_DROP_EFFECT;
		
		var data = {
			matrix: MATRIX_PIECES[this.state.pieceIndex],
			pickedFrom: this.state.pick,
			pieceId: this.props.id
		};
		// console.log('Piece::onDragStart::data', data);
		e.dataTransfer.setData(ConstatntsDragAndDrop.DRAG_DROP_CONTENT_TYPE, JSON.stringify(data));
		e.dataTransfer.dropEffect = "move";
		
		this.setState({
			selected: selectedIndex,
			onDrag: true
		});
	},
	
	onDragEnd: function(e){
		this.setState({
			onDrag: false
		});
	},
	
	selectPiecePortion: function(row, column, e){
		// console.log('Piece::onClick', row, column);
		this.setState({
			pick: {
				r: row, 
				c: column
			}
		});
	},
	
	render: function() {
		if (!this.state.pieceIndex){
			return (<div>Cargando... {this.state.pieceIndex}</div>);
		}
		
		var blockStyle = {backgroundColor: '#' + this.state.red + this.state.green + this.state.blue};
		var size = (this.props.mini && !this.state.onDrag ? ConstantsGame.BLOCK_WIDTH / 2 : ConstantsGame.BLOCK_WIDTH);
		var columnBlockStyle = {display: 'inline-block', width: size + 'px', height: size + 'px'};
		var rows = [];
		var piece = MATRIX_PIECES[this.state.pieceIndex];
		for (var r in piece){
			var row = piece[r];
			// console.log('row', row);
			var cols = [];
			for (var c in row){
				// console.log('row['+c+']', row[c]);
				var pieceObj = (<div className="nullPiece"> </div>);
				if (row[c] === 1){
					pieceObj = (<div className="piece" style={blockStyle} onMouseDown={this.selectPiecePortion.bind(this, r, c)}> </div>);
				}
				cols.push( <div key={"pcol" + c} className="column" style={columnBlockStyle}>{pieceObj}</div>);
			}
			
			if (cols.length > 0){
				rows.push( <div key={'r' + r} className="_row">{cols}</div>);
			}
		}

		// var blockStyle = {backgroundColor:'#'+this.state.red+this.state.green+this.state.blue, width: ConstantsGame.BLOCK_WIDTH+'px', height: BLOCK_HEIGHT+'px'};
		// console.log('rows', rows);
		return (<div style={this.props.style} className="board" draggable='true' onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>{rows}</div>);
	}
});
